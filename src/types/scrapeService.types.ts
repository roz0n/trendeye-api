import Country from "../models/Country";

export interface Scraper {
  resources: ResourceTypes;
  url: (resource: string, endpoint: string) => string | null;
}

export interface ResourceTypes {
  latest: string;
  studios: string;
  trends: string;
  countries: string;
}

export interface ResponseData {
  info: StudioInfo,
  works: any[]
}

export type StudioInfo = {
  name: string;
  desc?: string | null;
  url?: string;
  country: Country;
}