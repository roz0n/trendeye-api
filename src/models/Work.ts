class Work {
  title: string;
  url: string;
  images: {};
  source?: string;

  constructor(title: string, url: string, images: {}, source?: string) {
    this.title = title;
    this.url = url;
    this.images = images;
    this.source = source;
  }
}

export default Work;