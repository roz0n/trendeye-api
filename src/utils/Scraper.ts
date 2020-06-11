import cheerio from "cheerio";
import _ from "lodash";
import request from "request";
import Country from "../models/Country";
import Work from "../models/Work";
import { countryCodes } from "../data/countryCodes";
import { ResourceTypes, ResponseData } from "../types/scraper";

class ScraperResponse {
  info: ResponseData;
  works: any[];

  constructor(info: ResponseData, works: any[] = []) {
    this.info = info;
    this.works = works;
  }
}

class Scraper {
  resources: ResourceTypes = {
    studios: "studios",
    trends: "trends",
    countries: "country",
  };

  url = (resource: string, endpoint: string): string | null => {
    if (!resource) {
      return null;
    } else {
      return endpoint
        ? `https://www.trendlist.org/${resource}/${endpoint}`
        : `https://www.trendlist.org/${resource}`;
    }
  };
}

export class StudioScraper extends Scraper {
  getStudioByName(name: string) {
    if (name) {
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
              // TODO: This is an wrapped text node at the end of the tree
              const studioDesc = null;
              const studioUrl = studioInfo.find("a").first().text();
              const studioCountryName = studioInfo.find("a").last().text();
              const studioCountryCode = countryCodes.find(
                // TODO: update
                (country: any) =>
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

              allStudioWorks.map((i, el: CheerioElement) => {
                const workUrl = $(el).find("a").attr("href") || "";
                let workTitle = $(el).find("a").find("img").attr("alt") || "";
                let workImage = $(el).find("a").find("img").attr("src") || "";

                const workImages = {
                  sm: workImage && workImage,
                  lg: workImage && workImage.replace("small", "big"),
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
  }

  // getAllStudiosByCountry() {
  //   return new Promise((resolve, reject) => {
  //     request(this.url(this.resources.studios), (error, response, html) => {
  //       if (!error && response.statusCode == 200) {
  //         const $ = cheerio.load(html);
  //         const trendlistCountries = $("#trendsleft > .columns > h2");
  //         let responseData = [];

  //         trendlistCountries.each((i, el) => {
  //           const countryName = $(el).text().toLowerCase().trim();
  //           const countryCode = countryCodes.find(
  //             (country) => countryName === country.name.toLowerCase()
  //           );
  //           const countryData = new Country(
  //             i,
  //             countryName,
  //             countryCode && countryCode.iso
  //           );
  //           const countryStudios = $(el).next().find("li");

  //           countryData.studios["count"] = countryStudios.length;
  //           countryData.studios.list = [];

  //           countryStudios.each((i, el) => {
  //             const studioId = `${
  //               (countryCode && countryCode.iso) || countryName
  //             }${i}`;
  //             const studioName = $(el).text().trim();
  //             const studioQty = +studioName.match(/\((.*?)\)/)[1] || null;
  //             const studioUrl = $(el).find("a").attr("href");
  //             const studioEndpoint =
  //               studioUrl && studioUrl.substr(studioUrl.lastIndexOf("/") + 1);
  //             let sanitizedName = studioName
  //               .replace(studioName.match(/\((.*?)\)/)[0], "")
  //               .trim();

  //             if (sanitizedName.includes("(")) {
  //               const leftovers = sanitizedName.match(/\((.*?)\)/)[0] || "";
  //               sanitizedName = sanitizedName.replace(leftovers, "").trim();
  //             }

  //             const studioData = new Studio(
  //               i,
  //               studioId,
  //               sanitizedName || studioName,
  //               studioQty,
  //               studioEndpoint
  //             );

  //             countryData.studios.list.push(studioData);
  //           });

  //           responseData.push(countryData);
  //         });

  //         resolve(responseData);
  //       } else {
  //         reject(new Error("Error scraping data"));
  //       }
  //     });
  //   });
  // }
}

class TrendScraper extends Scraper {}
