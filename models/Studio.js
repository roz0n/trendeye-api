const Studio = function (id, stringId, name, quantity) {
  this._id = id;
  this._strId = stringId;
  this.name = name;
  this.quantity = quantity;
};

module.exports = Studio;
