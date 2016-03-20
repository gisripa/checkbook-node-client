const https = require('https')
const http = require('http')
const crypto = require('crypto')

module.exports = Resource;

function Resource(checkbook) {

    if (!(this instanceof Resource)) {
        return new Resource(checkbook);
    }
    this._checkbook = checkbook;
}

Resource.prototype._timeoutHandler = function(timeout, req, callback) {
    var self = this;
    return function() {
        var timeoutErr = new Error('ETIMEDOUT');
        timeoutErr.code = 'ETIMEDOUT';

        req._isAborted = true;
        req.abort();

        callback.call(
            self,
            new Error('Request aborted due to timeout being reached (' + timeout + 'ms)'),
            null
        );
    }
}

Resource.prototype._responseHandler = function(req, callback) {
    var self = this;
    return function(res) {
        var response = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            response += chunk;
        });
        res.on('end', function() {
            var err;

            try {
                response = JSON.parse(response);
            } catch (e) {
                return callback.call(
                    self,
                    new Error('Invalid JSON received from the Checkbook'),
                    null
                );
            }

            if (res.statusCode === 401) {
                err = new Error("Invalid credentials");
            } else if (res.statusCode === 404) {
                err = new Error("Item not found");
            } else if (res.statusCode === 301) {
                err = new Error('API sent us a 301 redirect, stopping call.');
            } else if (res.statusCode === 400) {
                err = new Error('The data you sent was not accepted as valid');
            }
            if (err) {
                return callback.call(self, err, null);
            } else {
                callback.call(self, null, response);
            }
        });
    };
}

Resource.prototype._errorHandler = function(req, callback) {
    var self = this;
    return function(error) {
      if (req._isAborted) return; // already handled
      callback.call(
        self,
        new Error('An error occurred with our connection to Checkbook'),
        null
      );
    }
}

Resource.prototype._request = function(method, path, data, callback) {

    var self = this;

    var requestData = new Buffer(JSON.stringify(data || {}));
    var host = self._checkbook.get('host');
    var realm = self._checkbook.get('realm');
    if (realm === 'dev' || realm === 'sandbox' || realm === 'stage') {
        host = realm+'.'+host;
    }

    var key = self._checkbook.get('key');
    var secret = self._checkbook.get('secret');
    path = self._checkbook.get('basePath') + path;

    var hmacMessage = method+'application/json' + path;
    var hmacSignature = crypto
                            .createHmac('sha256', secret)
                            .update(hmacMessage)
                            .digest('base64');
    var authorizationHeader = key+':'+hmacSignature;
    var headers = {
      'Authorization': authorizationHeader,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': requestData.length,
      'User-Agent': 'Checkbook/v2 NodeBindings'
    };
    makeRequest();

    function makeRequest() {

        var timeout = self._checkbook.get('timeout');
        var request_obj = {
            host: host,
            port: self._checkbook.get('port'),
            path: path,
            method: method,
            headers: headers
        };
        var req = (
            self._checkbook.get('protocol') == 'http' ? http : https
        ).request(request_obj);

        req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
        req.on('response', self._responseHandler(req, callback));
        req.on('error', self._errorHandler(req, callback));

        req.write(requestData);
        req.end();

    }

}