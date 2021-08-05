import axios from "axios";
import jsdom from "jsdom";

class ImageRipper {
  JSDOM = jsdom.JSDOM;
  endpoint = "https://www.trendlist.org/";

  async getCategoryUrls() {
    try {
      // make req to home page
      // return array of links to category pages
      const request = await axios.get(this.endpoint);
      const dom = new this.JSDOM(request.data);
      const { document } = dom.window;
      const linkElList = document
        .querySelector("#rightmenu")
        ?.querySelectorAll(".navigation")[2]
        .querySelectorAll("a");
      const urls = [];

      for (let i = 0; i < linkElList!.length; i++) {
        let url = linkElList![i].getAttribute("href");
        urls.push(url);
      }

      return urls;
    } catch (error) {
      console.log("Error fetching category urls list:", error);
      return;
    }
  }

  async getImageUrls(category: string) {
    try {
      // from list of category urls, make req to each url
      // get list of every image url on that page
      // replace small for big
      // download the image
      const request = await axios.get(
        `https://www.trendlist.org/trends/${category}`
      );
      const dom = new this.JSDOM(request.data);
      const { document } = dom.window;

      const imageElList = document
        .querySelector("#trendsleft")
        ?.querySelectorAll("img");
      const imageUrls: Array<{ url: string; name: string }> = [];

      for (let i = 0; i < imageElList!.length; i++) {
        const url = imageElList![i]
          .getAttribute("src")
          ?.replace("small", "big");
        const name = imageElList![i]
          .getAttribute("alt")
          ?.trim()
          .replace(/[^a-zA-Z0-9]/g, "_");
        imageUrls.push({ url: url!, name: name! });
      }

      return imageUrls;
    } catch (error) {
      console.log("Error fetching images url list:", error);
      return;
    }
  }
}

export default new ImageRipper();
