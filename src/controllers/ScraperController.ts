import cheerio from "cheerio";
import _ from "lodash";
import request from "request";
import Country from "../models/Country";
import Work, { WorkImageLinks } from "../models/Work";
import Studio from "../models/Studio";
import { CountryCode, countryCodes } from "../data/countryCodes";
import { ResourceTypes, ResponseData } from "../types/scraperController.types";

class ScraperResponse {
  info: ResponseData;
  works: any[];

  constructor(info: ResponseData, works: any[] = []) {
    this.info = info;
    this.works = works;
  }
}

class ScraperController {
  resources: ResourceTypes = {
    studios: "studios",
    trends: "trends",
    countries: "country",
  };

  url = (resource: string, endpoint?: string): string | null => {
    if (!resource) {
      return null;
    } else {
      return endpoint
        ? `https://www.trendlist.org/${resource}/${endpoint}`
        : `https://www.trendlist.org/${resource}`;
    }
  };

  scrape(
    resource: string,
    endpoint: string,
    callback: ($: CheerioStatic) => any[] | {}
  ) {
    return new Promise((reject, resolve) => {
      request(
        this.url(resource, endpoint)!,
        (error: Error, response: request.Response, html: string) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const result = callback($);
            resolve(result);
          } else {
            reject(new Error("Scrape failed"));
          }
        }
      );
    });
  }
}

export class StudioScraper extends ScraperController {
  getStudioByName(name: string) {
    return new Promise((resolve, reject) => {
      request(
        this.url(this.resources.studios, name)!,
        (error: Error, response: request.Response, html: string) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const studioInfo = $("#trendsright > .trendsinfo");
            const studioWorks = $("#trendsleft > .trends");

            // Get studio info
            const studioName = studioInfo.find("h1").text();
            const studioDesc = null;
            const studioUrl = studioInfo.find("a").first().text();
            const studioCountryName = studioInfo.find("a").last().text();
            const studioCountryCode = countryCodes.find(
              (country: CountryCode) =>
                studioCountryName.toLowerCase() === country.name.toLowerCase()
            );
            const studioCountryData = new Country(
              studioCountryName,
              (studioCountryCode && studioCountryCode.iso)!
            );
            const responseData = new ScraperResponse({
              info: {
                name: studioName,
                desc: studioDesc,
                url: studioUrl,
                country: studioCountryData,
              },
              works: [],
            });

            // Get studio works
            const allStudioWorks = studioWorks.find("li");
            allStudioWorks.map((i, el) => {
              const workUrl = $(el).find("a").attr("href") || "";
              const workTitle =
                $(el).find("a").find("img").attr("alt")?.trim() || "";
              const workImageLink =
                $(el).find("a").find("img").attr("src") || "";
              const workImages: WorkImageLinks = {
                small: workImageLink,
                large: workImageLink.replace("smallall", "big"),
              };
              const formedWorkData = new Work(workTitle, workUrl, workImages);
              responseData.works.push(_.omitBy(formedWorkData, _.isNil));
            });

            resolve([responseData]);
          } else {
            reject(new Error("Error fetching studio"));
          }
        }
      );
    });
  }

  getAllStudios() {
    return new Promise((resolve, reject) => {
      request(
        this.url(this.resources.studios)!,
        (error: Error, response: request.Response, html: string) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const trendlistCountries = $("#trendsleft > .columns > h2");
            const responseData: Country[] = [];

            trendlistCountries.each((i, el) => {
              const countryName = $(el).text().toLowerCase().trim();
              const countryCode = countryCodes.find(
                (country) => countryName === country.name.toLowerCase()
              );
              const countryData = new Country(
                countryName,
                (countryCode && countryCode.iso)!
              );
              const countryStudios = $(el).next().find("li");

              countryData.studios["count"] = countryStudios.length;
              countryData.studios.list = [];
              countryStudios.each((i, el) => {
                // Some of the code here is brittle, lots of non-null assertions here for the sake of silencing the compiler
                const studioName = $(el).text().trim();
                const studioUrl = $(el).find("a").attr("href");
                const studioQuantity = +studioName?.match(/\((.*?)\)/)![1] || 0;
                const studioEndpoint =
                  studioUrl?.substr(studioUrl.lastIndexOf("/") + 1) || "";

                // This can be a util or a helper
                let sanitizedName =
                  studioName
                    ?.replace(studioName?.match(/\((.*?)\)/)![0], "")!
                    .trim() || "";
                if (sanitizedName && sanitizedName?.includes("(")) {
                  const leftovers = sanitizedName!.match(/\((.*?)\)/)![0] || "";
                  sanitizedName = sanitizedName!.replace(leftovers, "")!.trim();
                }

                const studioData = new Studio(
                  i,
                  sanitizedName || studioName,
                  studioQuantity,
                  studioEndpoint
                );

                countryData.studios.list.push(studioData);
              });

              responseData.push(countryData);
            });

            resolve(responseData);
          } else {
            reject(new Error("Error scraping data"));
          }
        }
      );
    });
  }
}

export class TrendScraper extends ScraperController {
  getTrendByName(name: string) {
    return new Promise((reject, resolve) => {
      request(
        this.url(this.resources.trends, name)!,
        (error: Error, response: request.Response, html: string) => {}
      );
    });
  }

  getAllTrends() {
    return new Promise((reject, resolve) => {
      request(
        this.url(this.resources.trends, name)!,
        (error: Error, response: request.Response, html: string) => {}
      );
    });
  }
}
