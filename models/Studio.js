const Studio = function (id, stringId, name, quantity, endpoint) {
  this._id = id;
  this._strId = stringId;
  this.name = name;
  this.quantity = quantity;
  this.endpoint = endpoint;
};

module.exports = Studio;
