class Studio {
  id: number;
  name: string | null | undefined;
  quantity: number | null;
  endpoint: string | null;

  constructor(
    id: number,
    name: string | null | undefined,
    quantity: number | null,
    endpoint: string | null
  ) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.endpoint = endpoint;
  }
}

export default Studio;