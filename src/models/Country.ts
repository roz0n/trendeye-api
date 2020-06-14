import Studio from "../models/Studio";

type CountryStudiosListing = {
  count: number | null;
  list: Studio[];
};

class Country {
  name: string;
  iso_code: string;
  studios: CountryStudiosListing;

  constructor(
    name: string,
    iso_code: string,
    studios: CountryStudiosListing = { count: null, list: [] }
  ) {
    this.name = name;
    this.iso_code = iso_code;
    this.studios = studios;
  }
}

export default Country;
