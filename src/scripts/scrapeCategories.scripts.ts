import ImageRipper from "../services/scraper/imageRipper.service";
import fs from "fs";

// Gets categories and creates folders
export async function scrapeCategories() {
  console.log("Scraping categories...");

  let categoryUrls = (await ImageRipper.getCategoryUrls()) || [""];
  let categoryNames = [];

  console.log("Compiled category urls!");
  console.log(categoryUrls);

  for (let i = 0; i < categoryUrls.length; i++) {
    const categoryUrl = categoryUrls[i];
    const splitUrl = categoryUrl!.split("/");
    const name = splitUrl![splitUrl!.length - 1];
    categoryNames.push(name);
  }

  console.log("Assembled category names, preparing txt file...");
  console.log(categoryNames);

  fs.writeFile(
    "./data/categories.txt",
    categoryNames.join("\n"),
    function (error) {
      if (error) {
        console.log("Error saving categories:", error);
      }
      console.log("Created categories.txt successfully");
    }
  );

  return categoryNames;
}

(async () => scrapeCategories())();
