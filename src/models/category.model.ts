class Category {
  name: string | undefined;
  count: number | undefined;

  constructor(name: string | undefined, count: number | undefined) {
    this.name = name;
    this.count = count;
  }
}

export default Category;