import got from "got";
import ScraperService from "../services/scraper/scraper.service";
import Category from "../models/category.model";
import { Project, ProjectImageLinks } from "../models/project.model";

export default class CategoriesController extends ScraperService {
  async getCategoriesList() {
    // Match all chars between parens including parens
    const parensRegex = /\(([^)]+)\)/g;
    // Match all numertical chars
    const countRegex = /[0-9]+/g;

    try {
      const request = await got(this.url()!);
      const dom = new this.JSDOM(request.body);
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
        let categoryCount = categoryEl.textContent?.match(countRegex);
        const categoryData = new Category(categoryName, +categoryCount![0]);

        responseData.push(categoryData);
      }

      return responseData;
    } catch (error) {
      throw new Error(error.message || error.response.body);
    }
  }

  async getCategoryDescription() {}

  async getCategoryByName(name: string, limit?: number | undefined) {
    try {
      const request = await got(this.url(this.resources.trends, name)!);
      const dom = new this.JSDOM(request.body);
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
