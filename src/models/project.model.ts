export type ProjectImageLinks = {
  small?: string;
  large?: string;
};

export class Project {
  title?: string;
  url?: string;
  images?: ProjectImageLinks;

  constructor(title?: string, url?: string, images?: ProjectImageLinks) {
    this.title = title;
    this.url = url;
    this.images = images;
  }
}
