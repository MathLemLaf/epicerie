export type ItemId = string;

export interface Item {
  readonly id: ItemId;
  readonly name: string;
  readonly checked: boolean;
}
