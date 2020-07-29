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

/**
 * {
 *   name: 'en',
 *   modules: [
 *     {
 *       name: 'module1',
 *       jsonObject: {
 *         lang: 'en',
 *         obj: {
 *           'hello': 'hello'
 *         },
 *         dataUrl: ''
 *       }
 *     }
 *   ]
 * }
 */
export type LangType = {
  name: string;
  modules: ModuleType[];
}

export type ModuleType = {
  name: string;
  jsonObject: JsonObjectType;
}
