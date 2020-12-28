import { ResponseData } from "./../services/scraper/scraper.types";
import got from "got";
import ScraperService from "../services/scraper/scraper.service";
import Country from "../models/country.model";
import Studio from "../models/studio.model";
import { countryCodes as codes } from "../utils/countryCodes.utils";

export default class StudiosController extends ScraperService {
  //   getStudioByName(name: string) {
  //     return new Promise((resolve, reject) => {
  //       request(
  //         this.url(this.resources.studios, name)!,
  //         (error: Error, response: request.Response, html: string) => {
  //           if (!error && response.statusCode == 200) {
  //             const $ = cheerio.load(html);
  //             const studioInfo = $("#trendsright > .trendsinfo");
  //             const studioWorks = $("#trendsleft > .trends");

  //             // Get studio info
  //             const studioName = studioInfo.find("h1").text();
  //             const studioDesc = null;
  //             const studioUrl = studioInfo.find("a").first().text();
  //             const studioCountryName = studioInfo.find("a").last().text();
  //             const studioCountryCode = countryCodes.find(
  //               (country: CountryCode) =>
  //                 studioCountryName.toLowerCase() === country.name.toLowerCase()
  //             );
  //             const studioCountryData = new Country(
  //               studioCountryName,
  //               (studioCountryCode && studioCountryCode.iso)!
  //             );
  //             const responseData = new ScraperResponse({
  //               info: {
  //                 name: studioName,
  //                 desc: studioDesc,
  //                 url: studioUrl,
  //                 country: studioCountryData,
  //               },
  //               works: [],
  //             });

  //             // Get studio works
  //             const allStudioWorks = studioWorks.find("li");
  //             allStudioWorks.map((i, el) => {
  //               const workUrl = $(el).find("a").attr("href") || "";
  //               const workTitle =
  //                 $(el).find("a").find("img").attr("alt")?.trim() || "";
  //               const workImageLink =
  //                 $(el).find("a").find("img").attr("src") || "";
  //               const workImages: WorkImageLinks = {
  //                 small: workImageLink,
  //                 large: workImageLink.replace("smallall", "big"),
  //               };
  //               const formedWorkData = new Work(workTitle, workUrl, workImages);
  //               responseData.works.push(_.omitBy(formedWorkData, _.isNil));
  //             });

  //             resolve([responseData]);
  //           } else {
  //             reject(new Error("Error fetching studio"));
  //           }
  //         }
  //       );
  //     });
  //   }

  async getStudioCountries() {
    try {
      const request = await got(this.url(this.resources.studios)!);
      const dom = new this.JSDOM(request.body);

      const { document } = dom.window;
      const countriesList = document.querySelectorAll(
        "#trendsleft > .columns > h2"
      );
      const responseData: Country[] = [];

      for (let i = 0; i < countriesList.length; i++) {
        const country = countriesList[i];
        const countryName = country.textContent?.toLowerCase();
        const countryCode = codes.find(
          (country) => countryName === country.name.toLowerCase()
        );
        const countryData = new Country(
          countryName,
          countryCode && countryCode.iso
        );
        const countryStudiosList = country.nextElementSibling?.querySelectorAll(
          "li"
        );

        // Get the studios count and delete studios list prop as this route doesn't really need it
        countryData.studios!.count = countryStudiosList?.length || null;
        delete countryData.studios?.list;

        responseData.push(countryData);
      }

      return responseData;
    } catch (error) {
      throw new Error(error.message || error.response.body);
    }
  }

  // TODO: This method route needs a country paramater so all it does is get studios for a single country
  async getAllStudios() {
    try {
      const request = await got(this.url(this.resources.studios)!);
      const dom = new this.JSDOM(request.body);

      const { document } = dom.window;
      const countriesList = document.querySelectorAll(
        "#trendsleft > .columns > h2"
      );
      const responseData: Country[] = [];

      for (let i = 0; i < countriesList.length; i++) {
        const country = countriesList[i];
        const countryName = country.textContent?.toLowerCase();
        const countryCode = codes.find(
          (country) => countryName === country.name.toLowerCase()
        );
        const countryData = new Country(
          countryName,
          countryCode && countryCode.iso
        );
        const countryStudiosList = country.nextElementSibling?.querySelectorAll(
          "li"
        );

        if (countryStudiosList && countryStudiosList.length > 0) {
          const studiosCount = countryStudiosList?.length;
          const studiosList = [];

          // TODO: MOVE TO UTIL
          for (let i = 0; i < studiosCount; i++) {
            // Warning: Brittle scraping code ahead
            const studioEl = countryStudiosList[i];
            const studioName = studioEl.textContent?.trim();
            const studioUrl = studioEl.querySelector("a")?.getAttribute("href");
            const studioQuantity =
              (studioName && +studioName?.match(/\((.*?)\)/)![1]) || 0;
            const studioEndpoint =
              studioUrl?.substr(studioUrl.lastIndexOf("/") + 1) || "";

            // TODO: Move this to utils or something
            let sanitizedName =
              studioName
                ?.replace(studioName?.match(/\((.*?)\)/)![0], "")!
                .trim() || "";

            if (sanitizedName && sanitizedName?.includes("(")) {
              const leftovers = sanitizedName!.match(/\((.*?)\)/)![0] || "";
              sanitizedName = sanitizedName!.replace(leftovers, "")!.trim();
            }

            // Form studio object
            const completeStudioData = new Studio(
              i,
              sanitizedName || studioName,
              studioQuantity,
              studioEndpoint
            );
            // Added to country's studios list
            studiosList.push(completeStudioData);
          }
          //

          // Add country to response data
          countryData.studios!.count = studiosList.length;
          countryData.studios!.list = studiosList;
          responseData.push(countryData);
        }
      }

      return responseData;
    } catch (error) {
      throw new Error(error.message || error.response.body);
    }
  }

  // TODO: A lot of this is repetiive code from get all studios... can we dry this out a bit?
  async getStudiosByCountry(desiredCountry: string) {
    try {
      const request = await got(this.url(this.resources.studios)!);
      const dom = new this.JSDOM(request.body);

      const { document } = dom.window;
      const countriesList = document.querySelectorAll("#trendsleft > .columns > h2");

      for (let i = 0; i < countriesList.length; i++) {
        const countryEl = countriesList[i];
        const countryName = countryEl.textContent?.toLowerCase();
        const countryCode = codes.find((country) => countryName === country.name.toLowerCase());
        
        if (countryName === desiredCountry) {
          const countryData = new Country(countryName, countryCode && countryCode.iso);
          const countryStudiosList = countryEl.nextElementSibling?.querySelectorAll("li");

          if (countryStudiosList && countryStudiosList.length > 0) {
            const studiosCount = countryStudiosList?.length;
            const studiosList = [];
            
            // TODO: MOVE TO UTIL
            for (let i = 0; i < studiosCount; i++) {
              // Warning: Brittle scraping code ahead
              const studioEl = countryStudiosList[i];
              const studioName = studioEl.textContent?.trim();
              const studioUrl = studioEl.querySelector("a")?.getAttribute("href");
              const studioQuantity =
                (studioName && +studioName?.match(/\((.*?)\)/)![1]) || 0;
              const studioEndpoint =
                studioUrl?.substr(studioUrl.lastIndexOf("/") + 1) || "";
  
              // TODO: Move this to utils or something
              let sanitizedName =
                studioName
                  ?.replace(studioName?.match(/\((.*?)\)/)![0], "")!
                  .trim() || "";
  
              if (sanitizedName && sanitizedName?.includes("(")) {
                const leftovers = sanitizedName!.match(/\((.*?)\)/)![0] || "";
                sanitizedName = sanitizedName!.replace(leftovers, "")!.trim();
              }
  
              // Form studio object
              const completeStudioData = new Studio(
                i,
                sanitizedName || studioName,
                studioQuantity,
                studioEndpoint
              );
              // Added to country's studios list
              studiosList.push(completeStudioData);
            }

            countryData.studios!.count = studiosList.length;
            countryData.studios!.list = studiosList;
          //

          }
          return countryData;
        }
      }

      throw new Error("Invalid country name provided");
    } catch (error) {
      throw new Error(error.message || error.response.body);
    }
  }
}
