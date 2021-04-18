class Category {
  name: string | undefined;
  count: number | undefined;

  constructor(name: string | undefined, count: number | undefined) {
    this.name = name;
    this.count = count;
  }
}

export class CategoryDescription {
  name: string | undefined;
  description: string | undefined;

  constructor(name: string | undefined, description: string | undefined) {
    this.name = name;
    this.description = description;
  }
}

export default Category;
