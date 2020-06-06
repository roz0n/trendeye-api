const cheerio = require("cheerio");
const request = require("request");

const Country = require("../models/Country");
const Studio = require("../models/Studio");
const CountryCodes = require("../data/countryCodes");

const resources = {
  studios: "studios",
  trends: "trends",
  countries: "country",
};

class Scraper {
  static url = (resource, endpoint) => {
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
  static byName(name) {
		console.log("Obtaining studio", name);
    return new Promise((resolve, reject) => {
			request(Scraper.url(resources.studios, name), function (error, response, html) {
				if (!error && response.statusCode == 200) {
					const $ = cheerio.load(html);
					let responseData = [];

					console.log(html);
				}
			});
    });
  }

  static all() {
    return new Promise((resolve, reject) => {
      request(Scraper.url(resources.studios), function (error, response, html) {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          const trendlistCountries = $("#trendsleft > .columns > h2");
          let responseData = [];

          trendlistCountries.each((i, el) => {
            const countryName = $(el).text().toLowerCase().trim();
            const countryCode = CountryCodes.find(
              (country) => countryName == country.name.toLowerCase()
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
