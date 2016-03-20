'use strict';

Checkbook.DEFAULT_REALM = 'dev';
Checkbook.DEFAULT_HOST = 'checkbook.io';
Checkbook.DEFAULT_PROTOCOL = 'https';
Checkbook.DEFAULT_PORT = '443';
Checkbook.DEFAULT_BASE_PATH = '/v2';
Checkbook.DEFAULT_TIMEOUT = require('http').createServer().timeout;

Checkbook.resources = {
  Check: require('./resources/Check'),
  Invoice: require('./resources/Invoice')
};

function Checkbook(key, secret) {

    if (!(this instanceof Checkbook)) {
        return new Checkbook(key, secret);
    }

    this._api = {
        host: Checkbook.DEFAULT_HOST,
        port: Checkbook.DEFAULT_PORT,
        protocol: Checkbook.DEFAULT_PROTOCOL,
        basePath: Checkbook.DEFAULT_BASE_PATH,
        timeout: Checkbook.DEFAULT_TIMEOUT,
        realm: Checkbook.DEFAULT_REALM
    };

    if(typeof(key) !== 'undefined' && typeof(secret) !== 'undefined') {
        this.set('key', key);
        this.set('secret', secret);
    }

    this._init();
}

Checkbook.prototype = {
    setRealm: function(realm) {
        this.set('realm', realm.toLowerCase());
    },

    setProtocol: function(protocol) {
        this.set('protocol', protocol.toLowerCase());
    },

    setPort: function(port) {
        this.set('port', port);
    },

    setTimeout: function(timeout) {
        this.set('timeout', timeout == null ? Checkbook.DEFAULT_TIMEOUT : timeout);
    },

    set: function(key, value) {
        this._api[key] = value;
    },

    get: function(key) {
        return this._api[key];
    },

    _init: function() {
        var Resource = require('./Resource')
        var _resource = new Resource(this);
        for (var name in Checkbook.resources) {
            if(Checkbook.resources.hasOwnProperty(name)) {
                // create checkbook endpoint resources
                this[name.toLowerCase()] = new Checkbook.resources[name](_resource);
            }
        }
    }

};

module.exports = Checkbook;