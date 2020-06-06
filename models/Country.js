const Country = function (id, name, isoCode, studios = {}) {
  this._id = id;
  this.name = name;
  this.isoCode = isoCode;
  this.studios = studios;
};

module.exports = Country;