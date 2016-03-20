function Check(resource) {
	if (!(this instanceof Check)) {
        return new Check(resource);
    }
    this._resource = resource;
}

Check.prototype.sendDigital = function(data, callback) {
	var self = this;
	self._resource._request('POST', '/check/digital', data, callback);
}

Check.prototype.sendPhysical = function(data, callback) {
	var self = this;
	self._resource._request('POST', '/check/physical', data, callback);
}

Check.prototype.cancel = function(checkId, callback) {
	var self = this;
	self._resource._request('GET', '/check/cancel/'+checkId, null, callback);
}

Check.prototype.getById = function(checkId, callback) {
	var self = this;
	self._resource._request('GET', '/check/'+checkId, null, callback);
}

module.exports = Check;
