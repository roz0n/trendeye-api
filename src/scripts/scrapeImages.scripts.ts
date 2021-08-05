import fs from "fs";
import got from "got";
import ImageRipper from "../services/scraper/imageRipper.service";
import { pipeline } from "stream";

const SLEEP_DURATION = 3000;

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function scrapeImages(categoryNames: string[]) {
  console.log("Beginning image scraping...");
  sleep(SLEEP_DURATION);

  let errors: Array<{
    category: string;
    index: number;
    name: string;
    url: string;
  }> = [];

  for (let i = 0; i < categoryNames.length; i++) {
    let category = categoryNames[i];

    console.log(`Obtaining image urls for category: ${category}`);

    let images = await ImageRipper.getImageUrls(category);
    sleep(SLEEP_DURATION);

    console.log("Complete!");
    console.log(`Images for: ${category}:`, images);
    console.log(`Last step, scraping images for ${category}...`);

    for (let i = 0; i < images!.length; i++) {
      const filePath = `./data/${
        i % 2 === 0 ? "training" : "test"
      }/${category}/${images![i]!.name}.png`;
      const url = images![i]!.url;

      sleep(SLEEP_DURATION); // limit requests so we don't overwhelm the server and risk rate-limiting or something else, the site seems brittle

      await pipeline(
        got.stream(url),
        fs.createWriteStream(filePath),
        function (error) {
          if (error) {
            console.log("Error saving image:", error);
            console.log("Logging error...");
            errors.push({
              category: category,
              index: i,
              name: images![i]!.name,
              url: images![i]!.url,
            });
            sleep(SLEEP_DURATION);
          }
          console.log(`Saved image ${i}/${images!.length}`);
        }
      );

      // TODO: As soon as we can test this again, implement the above with axios
      //   await axios({ method: "get", url, responseType: "stream" }).then(
      //     (response) => {
      //       if (response.status !== 200) {
      //         console.log("Error saving image...");
      //         console.log("Logging error...");

      //         errors.push({
      //           category: category,
      //           index: i,
      //           name: images![i]!.name,
      //           url: images![i]!.url,
      //         });

      //         sleep(SLEEP_DURATION);
      //       } else {
      //         fs.createWriteStream(filePath);
      //       }
      //     }
      //   );
      // }

      sleep(3000);
    }

    console.log("Done scraping all images!");
    console.log("Errors:", JSON.stringify(errors));

    fs.writeFile(
      "./data/errors.json",
      JSON.stringify(errors),
      function (error) {
        if (error) console.log("Error saving error log:", error);
        console.log("Created error log successfully");
      }
    );
  }
}
