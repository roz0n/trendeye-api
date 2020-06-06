const cheerio = require("cheerio");
const request = require("request");
const _ = require("lodash");

const CountryCodes = require("../data/countryCodes");
const Country = require("../models/Country");
const Studio = require("../models/Studio");
const Work = require("../models/Work");

class Scraper {
  resources = {
    studios: "studios",
    trends: "trends",
    countries: "country",
  };

  url = (resource, endpoint) => {
    if (!resource) {
      return null;
    } else {
      return endpoint
        ? `https://www.trendlist.org/${resource}/${endpoint}`
        : `https://www.trendlist.org/${resource}`;
    }
  };
}

class StudioScraper extends Scraper {
  getStudioByName(name) {
    return new Promise((resolve, reject) => {
      request(
        this.url(this.resources.studios, name),
        (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const studioInfo = $("#trendsright > .trendsinfo");
            const studioWorks = $("#trendsleft > .trends");
            const responseData = { info: {}, works: [] };

            // Get studio info
            const studioName = studioInfo.find("h1").text();
            // TODO: This is an wrapped text node at the end of the tree
            const studioDesc = null;
            const studioUrl = studioInfo.find("a").first().text();
            const studioCountryName = studioInfo.find("a").last().text();
            const studioCountryCode = CountryCodes.find(
              (country) =>
                studioCountryName.toLowerCase() === country.name.toLowerCase()
            );
            const studioCountryData = new Country(
              null,
              studioCountryName,
              studioCountryCode && studioCountryCode.iso,
              null
            );

            responseData.info.name = studioName;
            responseData.info.desc = studioDesc;
            responseData.info.url = studioUrl;
            responseData.info.country = _.omitBy(studioCountryData, _.isNil);

            // Get studio works
            const allStudioWorks = studioWorks.find("li");

            allStudioWorks.map((i, el) => {
              const workTitle = $(el).find("a").find("img").attr("alt").trim();
              const workUrl = $(el).find("a").attr("href");
              const workImage = $(el).find("a").find("img").attr("src");
              const workImages = {
                sm: workImage,
                lg: workImage.replace("small", "big"),
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

  getAllStudiosByCountry() {
    return new Promise((resolve, reject) => {
      request(this.url(this.resources.studios), (error, response, html) => {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          const trendlistCountries = $("#trendsleft > .columns > h2");
          let responseData = [];

          trendlistCountries.each((i, el) => {
            const countryName = $(el).text().toLowerCase().trim();
            const countryCode = CountryCodes.find(
              (country) => countryName === country.name.toLowerCase()
            );
            const countryData = new Country(
              i,
              countryName,
              countryCode && countryCode.iso
            );
            const countryStudios = $(el).next().find("li");

            countryData.studios["count"] = countryStudios.length;
            countryData.studios.list = [];

            countryStudios.each((i, el) => {
              const studioId = `${
                (countryCode && countryCode.iso) || countryName
              }${i}`;
              const studioName = $(el).text().trim();
              const studioQty = +studioName.match(/\((.*?)\)/)[1] || null;
              const studioUrl = $(el).find("a").attr("href");
              const studioEndpoint =
                studioUrl && studioUrl.substr(studioUrl.lastIndexOf("/") + 1);
              let sanitizedName = studioName
                .replace(studioName.match(/\((.*?)\)/)[0], "")
                .trim();

              if (sanitizedName.includes("(")) {
                const leftovers = sanitizedName.match(/\((.*?)\)/)[0] || "";
                sanitizedName = sanitizedName.replace(leftovers, "").trim();
              }

              const studioData = new Studio(
                i,
                studioId,
                sanitizedName || studioName,
                studioQty,
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
      });
    });
  }
}

class TrendScraper extends Scraper {}

module.exports = {
  StudioScraper,
};
