import XLSX from 'xlsx';
import {JsonObjectType, KeyValueObject, SheetType} from "../../types";
import {formatJson2DataUrl} from "../../utils/format";

const getExcelSheetArray: (workbook: XLSX.WorkBook) => SheetType[] = (workbook) => {
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    return [];
  }
  return workbook.SheetNames.map((sheetName) => {
    const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
    return {
      name: sheetName,
      rows: roa || [], // 包含第一行标题栏
      jsonObjects: getJsonObjects(roa.slice(1), roa[0] as string[]),
    };
  })
};

const getJsonObjects: (rows: any[], titles: string[]) => JsonObjectType[] = (rows, titles) => {
  const langList = titles.slice(2);
  const result: JsonObjectType[] = [];
  langList.forEach((lang, index) => {
    const obj = getLangObject(rows, index + 2);
    result.push({
      lang,
      obj,
      dataUrl: formatJson2DataUrl(obj),
    });
  });
  return result;
};

// 获取某个语言的json
const getLangObject: (rows: string[][], langColIndex: number) => KeyValueObject = (rows, langColIndex) => {
  const obj: KeyValueObject = {};
  rows.forEach((row) => {
    const key = row[0];
    const locale = row[langColIndex];
    Object.defineProperty(obj, key, {
      value: locale || '',
      enumerable: true,
    });
  });
  return obj;
}

export default getExcelSheetArray;
