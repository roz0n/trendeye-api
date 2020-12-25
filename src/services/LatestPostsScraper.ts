import got from "got";
import jsdom from "jsdom";
import ScraperService from "./ScraperService";
import { LatestPostsAPIResponse } from "../types/scrapeService.types";

export class LatestPostsScraper extends ScraperService {
  JSDOM = jsdom.JSDOM;

  async getLatestPosts() {
    try {
      const request = await got(this.url(this.resources.latest)!);
      const dom = new this.JSDOM(request.body);

      const { document } = dom.window;
      const imageList = document.querySelector(".index");
      const images = imageList?.getElementsByClassName("big");
      const timestamps = imageList?.getElementsByClassName("image-time");
      const postListItems = imageList?.children; // Obtaining author information is a bit cumbersome, this is list of <li>
      const responseData: LatestPostsAPIResponse[] = [];

      if (!images?.length) {
        throw new Error("No posts images found");
      }

      for (let i = 0; i < images.length; i++) {
        const image = images[i].firstElementChild?.firstElementChild;
        const url = image?.getAttribute("src");
        const title = image?.getAttribute("alt");
        let date = null;
        let studio = null;

        if (timestamps && timestamps[i]) {
          date = timestamps[i].textContent;
        }

        if (
          postListItems &&
          postListItems[i] &&
          postListItems[i].children.length > 2
        ) {
          studio = postListItems[i].children[3].textContent; // <a> containing author name is the third item in this array
        }

        responseData.push({
          id: responseData.length,
          url,
          title,
          date: date,
          studio,
        });
      }

      return responseData;
    } catch (error) {
      throw new Error(error.message || error.response.body)
    }
  }
}
