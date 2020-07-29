import React, {useState} from 'react';
import XLSX from 'xlsx';
import {LangType, SheetType} from "../../types";
import getExcelSheetArray from "./getExcelSheetArray";
import {Button, Divider, List, message, Space, Upload} from 'antd';
import {DownloadOutlined, InboxOutlined} from '@ant-design/icons';
import {RcFile} from "antd/es/upload";
import styles from './Editor.module.scss';
import {downloadZip, FileType} from "./downloadZip";
import sheetList2LangList from "./sheetList2LangList";

const {Dragger} = Upload;

const Editor: React.FC = () => {
  const [sheetList, setSheetList] = useState<SheetType[]>([]);
  const [langList, setLangList] = useState<LangType[]>([]);

  const dropProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx',
    beforeUpload: (file: RcFile) => {
      fileChangeHandler(file);
      return false;
    },
    showUploadList: false,
  }

  const fileChangeHandler = (file: RcFile) => {
    if (!file) {
      return;
    }
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || !e.target.result) {
        message.warning('失败：FileReader 未读取到文件数据');
        throw new Error('FileReader error:no e.target');
      }
      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, {type: 'array'});
      const sheets = getExcelSheetArray(workbook);
      setSheetList(sheets);
      console.log(sheetList2LangList(sheets));
      setLangList(sheetList2LangList(sheets));
      message.success('转换成功');
    };
    reader.onerror = (e) => {
      message.warning('失败：FileReader Error');
      throw new Error('FileReader Error');
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Dragger {...dropProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">点击选择或将 Excel 拖拽到此处</p>
          <p className="ant-upload-hint">使用符合模版格式的 .xlsx 文件，第一列为字段名，第二列为备注，第三列起为翻译文案</p>
        </Dragger>
      </div>
      <div className={styles.right}>
        <div className={styles.result}>
          <List
            size="large"
            className={styles.resultList}
            bordered
            dataSource={sheetList}
            renderItem={sheet => (
              <div key={sheet.name}>
                <Divider orientation="left">{sheet.name}</Divider>
                {
                  sheet.jsonObjects.map((jsonObj, index) => {
                    const name = `${jsonObj.lang}.json`;
                    return (
                      <div key={name}>
                        <a href={jsonObj.dataUrl} download={name}>{name}</a>
                        {
                          index !== sheet.jsonObjects.length - 1 &&
                          (
                            <Divider orientation="left"/>
                          )
                        }
                      </div>
                    )
                  })
                }
              </div>
            )}
          />
        </div>
        <div className={styles.operate}>
          <Space>
            <a href="/template.xlsx">
              <Button
                type="primary"
                shape="round"
                icon={<DownloadOutlined/>}
                size="large"
              >
                下载模版
              </Button>
            </a>
            <Button
              type="primary"
              size="large"
              shape="round"
              disabled={langList.length === 0}
              onClick={() => downloadZip(langList, FileType.json)}
            >
              下载前端语言包
            </Button>
            <Button
              type="primary"
              size="large"
              shape="round"
              disabled={langList.length === 0}
              onClick={() => downloadZip(langList, FileType.ios)}
            >
              下载 IOS 语言包
            </Button>
            <Button
              type="primary"
              size="large"
              shape="round"
              disabled={langList.length === 0}
              onClick={() => downloadZip(langList, FileType.android)}
            >
              下载安卓语言包
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Editor;
