function Invoice(resource) {
	if (!(this instanceof Invoice)) {
        return new Invoice(resource);
    }
    this._resource = resource;
}

Invoice.prototype.get = function(callback) {
	var self = this;
	self._resource._request('GET', '/invoice', null, callback);
}

Invoice.prototype.create = function(data, callback) {
	var self = this;
	self._resource._request('POST', '/invoice', data, callback);
}

Invoice.prototype.getById = function(id, callback) {
	var self = this;
	self._resource._request('GET', '/invoice/'+id, null, callback);
}

Invoice.prototype.cancel = function(id, callback) {
	var self = this;
	self._resource._request('GET', '/invoice/cancel/'+id, null, callback);
}

module.exports = Invoice;