import Studio from "../models/Studio";

type CountryStudiosListing = {
  count: number | null;
  list: Studio[];
};

class Country {
  name: string;
  isoCode: string;
  studios: CountryStudiosListing;

  constructor(
    name: string,
    isoCode: string,
    studios: CountryStudiosListing = { count: null, list: [] }
  ) {
    this.name = name;
    this.isoCode = isoCode;
    this.studios = studios;
  }
}

export default Country;
