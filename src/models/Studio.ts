class Studio {
  id: number;
  strId: string;
  name: string;
  quantity: number;
  endpoint: string;

  constructor(
    id: number,
    strId: string,
    name: string,
    quantity: number,
    endpoint: string
  ) {
    this.id = id;
    this.strId = strId;
    this.name = name;
    this.quantity = quantity;
    this.endpoint = endpoint;
  }
}

export default Studio;