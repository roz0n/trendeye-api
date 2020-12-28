import Studio from "./studio.model";

type CountryStudiosListing = {
  count: number | null | undefined;
  list?: Studio[];
};

class Country {
  name: string | null | undefined;
  iso_code: string | null | undefined;
  studios?: CountryStudiosListing;

  constructor(
    name: string | null | undefined,
    iso_code: string | null | undefined,
    studios: CountryStudiosListing = { count: null, list: [] }
  ) {
    this.name = name;
    this.iso_code = iso_code;
    this.studios = studios;
  }
}

export default Country;
