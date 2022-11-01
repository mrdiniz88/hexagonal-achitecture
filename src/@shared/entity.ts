import { v4 as uuidv4 } from "uuid";

export interface IEntity {
  get id(): string
}

export class Entity {
  private _id: string;

  constructor(id?: string) {
    this._id = id ?? uuidv4();
  }

  get id(): string {
    return this._id;
  }
}
