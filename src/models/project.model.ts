export type ProjectImageLinks = {
  small?: string;
  large?: string;
};

export class Project {
  title?: string;
  url?: string  | null | undefined;
  images?: ProjectImageLinks;

  constructor(title?: string, url?: string | null | undefined, images?: ProjectImageLinks) {
    this.title = title;
    this.url = url;
    this.images = images;
  }
}
