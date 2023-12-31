import XLSX from 'xlsx';
import {JsonObjectType, KeyValueObject, SheetType} from "../../types";
import {formatJson2DataUrl} from "../../utils/format";

/**
 * 获取以模块分类的数组
 * @param workbook
 */
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

/**
 * 获取某模块的语言数组
 * @param rows
 * @param titles
 */
const getJsonObjects: (rows: any[], titles: string[]) => JsonObjectType[] = (rows, titles) => {
  const langList = titles.slice(2);
  const availableRow = rows.filter((item) => item && item[0] && item[0].length > 0);
  const result: JsonObjectType[] = [];
  langList.forEach((lang, index) => {
    const obj = getLangObject(availableRow, index + 2);
    result.push({
      lang,
      obj,
      dataUrl: formatJson2DataUrl(obj),
    });
  });
  return result;
};

/**
 * 获取某个语言json
 * @param rows
 * @param langColIndex
 */
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
