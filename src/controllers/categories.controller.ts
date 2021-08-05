import axios from "axios";
import ScraperService from "../services/scraper/scraper.service";
import Category from "../models/category.model";
import { Project, ProjectImageLinks } from "../models/project.model";
import { CategoryDescription } from "./../models/category.model";
import { parensRegex, numsRegex, newLineRegex } from "../utils/regex.util";
import categoryIdentifiers from "../utils/categoryIdentifiers.util";

export default class CategoriesController extends ScraperService {
  async getCategoriesList() {
    try {
      const request = await axios.get(this.url(this.resources.home));
      const dom = new this.JSDOM(request.data);
      const { document } = dom.window;

      const categoriesList = document.querySelectorAll(
        "#rightmenu > ul:nth-child(8) > li"
      );
      const responseData: Category[] = [];

      for (let i = 0; i < categoriesList.length; i++) {
        const categoryEl = categoriesList[i];
        const categoryName = categoryEl.textContent
          ?.replace(parensRegex, "")
          .trim();
        let categoryCount = categoryEl.textContent?.match(numsRegex);
        responseData.push(new Category(categoryName, +categoryCount![0]));
      }

      return responseData;
    } catch (error) {
      throw new Error(error.message || error.response.body);
    }
  }

  async getCategoryDescription(name: string) {
    try {
      const request = await axios.get(this.url(this.resources.trends, name));
      const dom = new this.JSDOM(request.data);
      const { document } = dom.window;

      const categoryName = categoryIdentifiers[name];
      const categoryDescriptionRaw =
        document.querySelector(".trendsinfo")?.textContent;

      /**
       * The description is a text node and not enclosed in an element which is not ideal.
       * To circumvent this, scrape all the text in the parent element's textContent and parse out
       * the description via regex and replace methods.
       */

      // Remove new line chars
      let categoryDescriptionFormatted = categoryDescriptionRaw?.replace(
        newLineRegex,
        ""
      );
      // Remove trend name
      categoryDescriptionFormatted = categoryDescriptionFormatted?.replace(
        categoryName,
        ""
      );
      // Remove year nums
      categoryDescriptionFormatted = categoryDescriptionFormatted?.replace(
        numsRegex,
        ""
      );
      // Remove weird "N/A" text
      categoryDescriptionFormatted = categoryDescriptionFormatted
        ?.replace("N/A", "")
        .trim();

      return new CategoryDescription(
        categoryName,
        categoryDescriptionFormatted
      );
    } catch (error) {
      throw new Error(error.message || error.response.body);
    }
  }

  async getCategoryByName(name: string, limit?: number | undefined) {
    try {
      const request = await axios.get(this.url(this.resources.trends, name)!);
      const dom = new this.JSDOM(request.data);
      const { document } = dom.window;

      const imageList = document.querySelectorAll(
        "#trendsleft > ul.trends > li > a > img"
      );
      const responseData: Project[] = [];

      for (let i = 0; i < imageList.length; i++) {
        const project = imageList[i];
        const projectTitle = project.getAttribute("alt")?.trim();
        const projectUrl = project.getAttribute("src");
        const projectImages: ProjectImageLinks = {
          small: projectUrl!,
          large: projectUrl?.replace("small", "big"),
        };
        const projectData = new Project(
          projectTitle,
          projectUrl,
          projectImages!
        );
        responseData.push(projectData);
      }

      if (limit && typeof limit == "number") {
        return responseData.slice(0, limit);
      }

      return responseData;
    } catch (error) {
      throw new Error(error.message || error.response.body);
    }
  }
}
