import { Project } from "./project.model";

class Studio {
  id?: number;
  name: string | null | undefined;
  quantity: number | null;
  endpoint: string | null;
  projects?: Project[];

  constructor(
    id: number,
    name: string | null | undefined,
    quantity: number | null,
    endpoint: string | null,
    projects?: Project[]
  ) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.endpoint = endpoint;
    this.projects = projects;
  }
}

export default Studio;
