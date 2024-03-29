import axios from "axios";
import ScraperService from "../services/scraper/scraper.service";
import { LatestPostsAPIResponse } from "../services/scraper/scraper.types";

export default class LatestPostsController extends ScraperService {
  async getLatestPosts() {
    try {
      const response = await axios.get(this.url(this.resources.home)!);
      const dom = new this.JSDOM(response.data);

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
      throw new Error(error.message || error.response.body);
    }
  }
}
