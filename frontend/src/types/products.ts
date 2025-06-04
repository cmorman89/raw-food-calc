export type ItemComposition = {
  meat: number;
  bone: number;
  organ: number;
};

export type ItemData = {
  weight: number;
  composition: ItemComposition;
};

export type Item = {
  [key: string]: ItemData;
};

export type Product = {
  [key: string]: Item;
};
