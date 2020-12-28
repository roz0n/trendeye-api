import _ from "lodash";
import request from "request";
import got from "got";
import Country from "../../models/country.model";
import Work, { WorkImageLinks } from "../../models/work.model";
import Studio from "../../models/studio.model";
import { CountryCode, countryCodes } from "../../utils/countryCodes.utils";
import { ResourceTypes, ResponseData } from "./scraper.types";
import jsdom from "jsdom";

class ScraperResponse {
  info: ResponseData;
  works: any[];

  constructor(info: ResponseData, works: any[] = []) {
    this.info = info;
    this.works = works;
  }
}
export default class ScraperService {
  JSDOM = jsdom.JSDOM;

  resources: ResourceTypes = {
    latest: "",
    studios: "studios",
    trends: "trends/frame",
    countries: "country",
  };

  // TODO: This is too complicated bro
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

export class TrendScraper extends ScraperService {
  getTrendByName(name: string) {
    return new Promise((reject, resolve) => {
      request(
        this.url(this.resources.trends, name)!,
        (error: Error, response: request.Response, html: string) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            console.log("Response:", html);
            resolve({ dummy: "Dummy data" });
          }
        }
      );
    });
  }

  getAllTrends() {
    return new Promise((reject, resolve) => {
      request(
        this.url(this.resources.trends)!,
        (error: Error, response: request.Response, html: string) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            console.log("Response:", html);
            resolve({ dummy: "Dummy data" });
          } else {
            reject(new Error("Error scraping data"));
          }
        }
      );
    });
  }
}
