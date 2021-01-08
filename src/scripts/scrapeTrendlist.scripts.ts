import { scrapeCategories } from "./scrapeCategories.scripts";
import { scrapeImages } from "./scrapeImages.scripts";

(async () => {
  const categories = await scrapeCategories();
  await scrapeImages(categories);
})();