class Studio {
  id: number;
  strId: string;
  name: string;
  quantity: number | null;
  endpoint: string | null;

  constructor(
    id: number,
    strId: string,
    name: string,
    quantity: number | null,
    endpoint: string | null
  ) {
    this.id = id;
    this.strId = strId;
    this.name = name;
    this.quantity = quantity;
    this.endpoint = endpoint;
  }
}

export default Studio;