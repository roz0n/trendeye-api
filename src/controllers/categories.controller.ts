import got from "got";
import ScraperService from "../services/scraper/scraper.service";
import { Project, ProjectImageLinks } from "../models/project.model";

export default class CategoriesController extends ScraperService {
  async getAllCategories() {}

  async getCategoryByName(name: string, limit?: number | undefined) {
    try {
      const request = await got(this.url(this.resources.trends, name)!);
      const dom = new this.JSDOM(request.body);
      const { document } = dom.window;

      const imageList = document.querySelectorAll("#trendsleft > ul.trends > li > a > img");
      const responseData: Project[] = [];

      for (let i = 0; i < imageList.length; i++) {
          const project = imageList[i];
          const projectTitle = project.getAttribute("alt")?.trim();
          const projectUrl = project.getAttribute("src");
          const projectImages: ProjectImageLinks = {
              "small": projectUrl!,
              "large": projectUrl?.replace("small", "big")
          };
          const projectData = new Project(projectTitle, projectUrl, projectImages!);
          responseData.push(projectData);
      }

      if (limit && typeof limit == "number") {
          return responseData.slice(0,limit);
      }

      return responseData;
    } catch (error) {
      throw new Error(error.message || error.response.body);
    }
  }
}
