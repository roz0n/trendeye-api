const cheerio = require("cheerio");
const request = require("request")

const Country = require("../models/Country");
const Studio = require("../models/Studio");
const CountryCodes = require("../data/countryCodes");

class Scraper {
  static get studios() {
    const url = `https://www.trendlist.org/studios`;

    return new Promise((resolve, reject) => {
      request(url, function (error, response, html) {
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
                studioQty
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

module.exports = Scraper;
