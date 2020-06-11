class Country {
  name: string;
  isoCode: string;
  studios?: {};

  constructor(name: string, isoCode: string, studios?: {}) {
    this.name = name;
    this.isoCode = isoCode;
    this.studios = studios;
  }
}

export default Country;
