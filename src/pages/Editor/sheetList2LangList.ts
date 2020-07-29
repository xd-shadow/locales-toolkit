import {LangType, ModuleType, SheetType} from "../../types";

const sheetList2LangList: (sheetList: SheetType[]) => LangType[] = (sheetList) => {
  if (sheetList.length === 0 || sheetList[0].jsonObjects.length === 0) { // 预期每个模块标题相同
    return [];
  }
  const langStrList: string[] = sheetList[0].jsonObjects.map(jsonObject => jsonObject.lang);
  return langStrList.map((lang, index) => ({
    name: lang,
    modules: getModules(sheetList, index),
  }));
};

const getModules: (sheetList: SheetType[], index: number) => ModuleType[] = (sheetList, index) => {
  return sheetList.map((sheet) => ({
    name: sheet.name,
    jsonObject: sheet.jsonObjects[index],
  }));
};

export default sheetList2LangList;
