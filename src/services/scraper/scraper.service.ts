import _ from "lodash";
import request from "request";
import { ResourceTypes, ResponseData } from "./scraper.types";
import jsdom from "jsdom";

export default class ScraperService {
  JSDOM = jsdom.JSDOM;

  resources: ResourceTypes = {
    home: "",
    studios: "studios",
    trends: "trends",
    countries: "country",
  };

  url = (resource: string | null, endpoint?: string): string => {
    if (!resource) {
      return "https://www.trendlist.org/";
    } else {
      return endpoint
        ? `https://www.trendlist.org/${resource}/${endpoint}`
        : `https://www.trendlist.org/${resource}`;
    }
  };
}