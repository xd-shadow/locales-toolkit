export type SheetType = {
  name: string;
  rows: any[];
  jsonObjects: JsonObjectType[]; // 所有语言
}

export type JsonObjectType = {
  lang: string; // zh
  obj: KeyValueObject; // 语言json对象
  dataUrl: string;
}

export type KeyValueObject = {
  [key: string]: string;
}
