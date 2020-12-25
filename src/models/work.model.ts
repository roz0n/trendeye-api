export type WorkImageLinks = {
  small?: string;
  large?: string;
};

class Work {
  title: string;
  url: string;
  images: WorkImageLinks;
  source?: string;

  constructor(title: string, url: string, images: WorkImageLinks, source?: string) {
    this.title = title;
    this.url = url;
    this.images = images;
    this.source = source;
  }
}

export default Work;