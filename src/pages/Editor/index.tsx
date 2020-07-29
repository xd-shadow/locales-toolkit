import React, {useState} from 'react';
import XLSX from 'xlsx';
import {LangType, SheetType} from "../../types";
import getExcelSheetArray from "./getExcelSheetArray";
import {Button, Divider, List, message, Space, Upload, Steps} from 'antd';
import {DownloadOutlined, InboxOutlined} from '@ant-design/icons';
import {RcFile} from "antd/es/upload";
import styles from './Editor.module.scss';
import {downloadZip, FileType} from "./downloadZip";
import sheetList2LangList from "./sheetList2LangList";

const {Dragger} = Upload;
const {Step} = Steps;

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
          <p className="ant-upload-hint">需使用符合模版格式的 .xlsx 文件</p>
          <div className={styles.tip}>
            <p>新的文案工作流程如下：</p>
            <Steps current={5} direction="vertical" progressDot>
              <Step description="开发制定好excel 规范，放到工具（web）上供下载"/>
              <Step description="产品下载excel规范文件，填写文案的key和中文文案"/>
              <Step description="产品将excel文件发给市场，翻译，完善其它所需语言的文案"/>
              <Step description="产品将最终的excel文件发给开发。开发上传excel到工具（web），导出所需的文案格式文件（json、txt…）" />
            </Steps>
          </div>
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
