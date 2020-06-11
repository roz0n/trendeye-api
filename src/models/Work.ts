export type WorkImageLinks = {
  sm?: string;
  lg?: string;
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