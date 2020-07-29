import JSZip from "jszip";
import {saveAs} from "file-saver";
import {KeyValueObject, LangType} from "../../types";

const FILE_NAME = 'locales.zip';

export enum FileType {
  json,
  ios,
  android
}

/**
 * 触发下载
 * @param zip
 */
const download = (zip: JSZip) => {
  zip.generateAsync({type: 'blob'}).then((res) => {
    saveAs(res, FILE_NAME);
  });
};

/**
 * 下载用于前端的json语言包
 * @param langList
 * @param type
 */
export const downloadZip = (langList: LangType[], type: FileType) => {
  if (langList.length === 0) {
    return;
  }
  const zip = new JSZip();
  const isSingleModule = langList[0].modules.length === 1;
  if (isSingleModule) {
    langList.forEach((lang) => {
      zip.file(`${lang.name}.${getFileExtend(type)}`, getFileOutput(lang.modules[0].jsonObject.obj, type));
    });
  } else {
    langList.forEach((lang) => {
      zip.folder(lang.name);
      lang.modules.forEach((module) => {
        zip.file(`/${lang.name}/${module.name}.${getFileExtend(type)}`, getFileOutput(module.jsonObject.obj, type));
      });
    });
  }
  download(zip);
};

export const getFileExtend: (type: FileType) => string = (type) => {
  if (type === FileType.json) {
    return 'json';
  }
  return 'txt';
}

export const getFileOutput: (obj: KeyValueObject, type: FileType) => string = (obj, type) => {
  switch (type) {
    case FileType.json: {
      return JSON.stringify(obj);
    }
    case FileType.ios: {
      return getIosOutput(obj);
    }
    case FileType.android: {
      return getAndroidOutput(obj);
    }
    default:
      return '';
  }
}

export const getIosOutput: (obj: KeyValueObject) => string = (obj) => {
  let result = '';
  Object.keys(obj).forEach((key) => {
    result += `"${key}"="${obj[key]}"\n`;
  });
  return result;
}

export const getAndroidOutput: (obj: KeyValueObject) => string = (obj) => {
  let result = '<resources>\n';
  Object.keys(obj).forEach((key) => {
    result += `  <string name="${key}">${obj[key]}</string>\n`
  });
  result += '</resources>'
  return result;
}
