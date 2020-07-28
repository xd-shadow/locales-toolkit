import {KeyValueObject} from "../types";

export const formatArrayBuffer2Array: (buffer: ArrayBuffer) => any[] = (buffer) => {
  return Array.prototype.slice.call(new Uint8Array(buffer));
};

export const formatJson2DataUrl: (json: KeyValueObject) => string = (json) => {
  const dataStr = JSON.stringify(json);
  return `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
};
