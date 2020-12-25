import Country from "../../models/country.model";

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
  info: StudioInfo;
  works: any[];
}

export type StudioInfo = {
  name: string;
  desc?: string | null;
  url?: string;
  country: Country;
};

export type LatestPostsAPIResponse = {
  id: number;
  url?: string | null | undefined;
  title?: string | null | undefined;
  date?: string | null | undefined;
  studio?: string | null | undefined;
  error?: string | null | undefined;
};