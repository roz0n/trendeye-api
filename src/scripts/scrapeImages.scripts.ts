import fs from "fs";
import got from "got";
import ImageRipper from "../services/scraper/imageRipper.service";
import { pipeline } from "stream";

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function scrapeImages(categoryNames: string[]) {
  console.log("Beginning image scraping...");
  sleep(2000);

  let errors: Array<{ category: string; index: number; name: string; url: string }> = [];

  for (let i = 0; i < categoryNames.length; i++) {
    let category = categoryNames[i];

    console.log(`Obtaining image urls for category: ${category}`);

    let images = await ImageRipper.getImageUrls(category);
    sleep(2000);
    
    console.log("Complete!");
    console.log(`Images for: ${category}:`, images);
    console.log(`Last step, scraping images for ${category}...`);

    for (let i = 0; i < images!.length; i++) {
      sleep(2000); // limit requests to one a second, otherwise it's too fast and some don't finish
      await pipeline(
        got.stream(images![i]!.url),
        fs.createWriteStream(`./data/${category}/${images![i]!.name}.png`),
        function (error) {
          if (error) {
            console.log("Error saving image:", error);
            console.log("Logging error...");
            errors.push({ category: category, index: i, name: images![i]!.name, url: images![i]!.url });
            sleep(2000);
          }
          console.log(`Saved image ${i}/${images!.length}`);
        }
      );
    }

    sleep(2000);
  }

  console.log("Done scraping all images!");
  console.log("Errors:", errors);

  fs.writeFile("./data/errors.json", JSON.stringify(errors), function (error) {
    if (error) console.log("Error saving error log:", error);
    console.log("Created error log successfully");
  });
}
