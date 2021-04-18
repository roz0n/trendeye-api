import _ from "lodash";
import request from "request";
import { ResourceTypes, ResponseData } from "./scraper.types";
import jsdom from "jsdom";

export default class ScraperService {
  JSDOM = jsdom.JSDOM;

  resources: ResourceTypes = {
    latest: "",
    studios: "studios",
    trends: "trends",
    countries: "country",
  };

  url = (resource: string, endpoint?: string): string | null => {
    if (!resource) {
      return "https://www.trendlist.org/";
    } else {
      return endpoint
        ? `https://www.trendlist.org/${resource}/${endpoint}`
        : `https://www.trendlist.org/${resource}`;
    }
  };
}