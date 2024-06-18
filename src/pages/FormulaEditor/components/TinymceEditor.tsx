import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect, useRef, useState } from 'react';
import { FormulaSymbol } from '@/pages/FormulaEditor/DataSource';
import { CloseCircleOutlined } from '@ant-design/icons';

type DataItem = {
  [key in string]: string;
};

interface TinymceProps {
  fieldColor: string;
  constantColor: string;
  funcColor: string;
  operatorColor: string;
  editorRef: any;
  formulaDataList: API.FormulaValueType[];
  dataList: DataItem;
  translateStr: string;
  formulaList: API.FormulaValueType[];
  setTranslateStr: (value: string) => void;
  setFormulaList: (value: API.FormulaValueType[]) => void;
}
const TinymceEditor: React.FC<TinymceProps> = (props) => {
  const {
    fieldColor,
    constantColor,
    funcColor,
    operatorColor,
    editorRef,
    formulaDataList,
    dataList,
    translateStr,
    formulaList,
    setTranslateStr,
    setFormulaList,
  } = props;
  const content = useRef<string>('');
  const selectableDivRef = useRef<HTMLDivElement>(null);
  const [modelValue, setModelValue] = useState<string>('');
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
    };

    const selectableDiv = selectableDivRef.current;
    if (selectableDiv) {
      selectableDiv.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (selectableDiv) {
        selectableDiv.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, []);
  /**
   * @description: 转换标签类型数据成为富文本数据
   * @param {Array} tags tag类型数组
   * @return {*}
   */
  const setTagsToElement = () => {
    return formulaDataList
      .map((item: API.FormulaValueType) => {
        // type: field:字段，operator：操作符，func：函数，constant：常量，text：普通文本
        if (['field', 'constant', 'func', 'operator'].includes(item?.type)) {
          const key = item?.value;
          return `<span class="mention-${item.type}" contenteditable="false" data-key="${key}">${item.title}</span>`;
        } else {
          return item.title;
        }
      })
      .join('');
  };

  /**
   * @description: 创建range
   * @param {Element} container
   * @param {Number} offset
   * @return {*}
   */
  const toRange = (container: Node, offset: number = 0) => {
    const range = document.createRange();
    range.setStart(container, offset);
    range.setEnd(container, offset);
    return range;
  };

  /**
   * @description: 富文本插入内容
   * @return {*}
   */
  const editorSetContent = async () => {
    const editor = editorRef.current;
    editor.setContent(content.current, { noSelection: true });
    requestAnimationFrame(() => {
      const selectionEnd = editor?.selection?.getEnd();
      editor?.selection?.setRng(toRange(selectionEnd, selectionEnd.childNodes.length)); // 有效保证光标在最后显示
      editor.focus(); // 显示光标
    });
  };

  /**
   * @description: 初始化富文本
   * @return {*}
   */
  const setInitValue = async () => {
    // 初始化
    content.current = setTagsToElement();
    if (editorRef.current) {
      await editorSetContent();
    }
  };
  useEffect(() => {
    if (formulaDataList?.length) {
      setInitValue();
    }
  }, [formulaDataList, editorRef.current]);

  const replaceSpance = (value: string): string => {
    // 多个空格则压缩
    return value.replace(/\s+/g, ' ');
  };

  /**
   * @description: 处理富文本数据节点
   * @return {*}
   */
  const traverseNodes = (childNode: any, operatorRegex: RegExp) => {
    let calcList: API.FormulaValueType[] = [];
    for (let i = 0; i < childNode.childNodes.length; i += 1) {
      const element = childNode.childNodes[i];
      if (element?.childNodes?.length > 1) {
        // 当子节点还有子节点时，需递归遍历子节点
        // 默认第一个元素为当前节点的类型，如：[text]，所以长度需要大于1
        const data = traverseNodes(element, operatorRegex);
        calcList.push(...data);
      } else {
        const classText =
          element.nodeType === 1 && element?.getAttribute ? element?.getAttribute('class') : '';
        const selectedClass = element?.getAttribute
          ? element?.getAttribute('data-mce-selected')
          : '';
        const value = element.textContent;
        const dataKey = element?.getAttribute ? element?.getAttribute('data-key') : '';
        if (selectedClass) continue; // 存在隐藏选中项，不获取
        if (value !== '') {
          if (classText && classText.indexOf('mention-operator') !== -1) {
            // 使用正则表达式进行分割
            let operatorSplits = ['&&', '||'].includes(dataKey)
              ? dataKey.split(operatorRegex)
              : value.split(operatorRegex);
            let title = value;
            operatorSplits.forEach((item: string) => {
              if (item !== '') {
                calcList.push({
                  type: operatorRegex.test(item) ? 'operator' : 'text',
                  value: dataKey ? dataKey : replaceSpance(item),
                  title: title,
                });
              }
            });
          } else if (classText && classText.indexOf('mention-field') !== -1) {
            // 字段
            if (dataKey !== '') {
              const title = dataList[dataKey];
              calcList.push({
                type: 'field',
                value: dataKey,
                title,
              });
            }
          } else if (classText && classText.indexOf('mention-func') !== -1) {
            // 函数
            if (dataKey !== '') {
              let title = value;
              if (dataList[dataKey] && typeof dataList[dataKey] === 'string') {
                title = dataList[dataKey];
              }
              calcList.push({
                type: 'func',
                value: dataKey,
                title,
              });
            }
          } else if (classText && classText.indexOf('mention-constant') !== -1) {
            // 常量
            if (dataKey !== '') {
              const title = dataList[dataKey];
              calcList.push({
                type: 'constant',
                value: dataKey,
                title,
              });
            }
          } else {
            const title = replaceSpance(value);
            calcList.push({
              type: 'text',
              value: replaceSpance(value), // 多个空格则压缩
              title, // 多个空格则压缩
            });
          }
        }
      }
    }
    return calcList;
  };

  /**
   * @description: 处理富文本内容，回调公式节点数组、文本
   * @return {*}
   */
  const contentChange = (type?: string) => {
    const editor = editorRef.current; // 富文本实例
    if (!editor) return;
    const tempContainer = editor.getBody(); // 富文本节点内容
    const text = tempContainer.textContent;
    if (modelValue === text) return; // 内容全等不回调
    const childNodes = tempContainer.childNodes;
    const calcList: API.FormulaValueType[] = [];
    let calcExpression: string = '';
    // 定义操作符数组
    const operatorList: string[] = FormulaSymbol.map((item) => item.code);
    // 生成正则表达式字符串，确保从长到短排序
    const regexString = operatorList
      .sort((a, b) => b.length - a.length) // 根据操作符长度从长到短排序
      .map((op) => op.replace(/([.*+?^=!:${}()|])/g, '\\$1')) // 转义特殊字符
      .join('|'); // 使用 | 拼接成正则表达式
    // 创建正则表达式
    const operatorRegex = new RegExp(`(${regexString})`);
    childNodes.forEach((p: any) => {
      const data = traverseNodes(p, operatorRegex);
      calcList.push(...data);
    });
    if (calcList?.length) {
      if (calcList.length > 1 && type === 'dragend') {
        //   拖拽添加的字段时，数组最后会多一个当前拖拽的字段，需做删除处理
        calcList.pop();
      }
      calcList.forEach((item) => (calcExpression += item?.value));
    }
    setTranslateStr(calcExpression);
    setFormulaList(calcList);
    setModelValue(text);
  };

  /**
   * @description: 清空公式输入框
   * @return {*}
   */
  const deleteAll = () => {
    // 删除当前所选的全部字段
    editorRef.current.setContent('');
    setFormulaList([]);
    setTranslateStr('');
  };

  return (
    <div className={'formula-editor'}>
      <div className={'formula-editor-top'}>
        <Editor
          onInit={(evt, editor) => (editorRef.current = editor)}
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          id={'tincyEditor'}
          init={{
            setup: (editor) => {
              editor.on('dragend', () => {
                contentChange('dragend');
              });
            },
            toolbar: false, //隐藏工具栏
            menubar: false, //隐藏菜单栏
            auto_focus: true, //自动获得焦点
            statusbar: false,
            // entities: false, // 正确处理不可见字符
            content_style: `p {font-size: 14px}
            .mention-field{
              color: ${fieldColor};
              outline: #FFFFFF solid 1px !important;
              margin:0 5px;
            }
            .mention-constant{
              color: ${constantColor};
              outline: #FFFFFF solid 1px !important;
              margin:0 5px;
            }
            .mention-func{
              color: ${funcColor};
              outline: #FFFFFF solid 1px !important;
              margin:0 5px;
            }
            .mention-operator{
              color: ${operatorColor};
              outline: #FFFFFF solid 1px !important;
              margin:0 5px;
            }`,
            // 重置部分样式，富文本使用iframe沙箱隔离
          }}
          onEditorChange={() => contentChange()}
        />
        {formulaList?.length > 0 && (
          <CloseCircleOutlined className="delete-all" onClick={() => deleteAll()} />
        )}
      </div>
      <div className={'formula-editor-title'}>
        公式解析
      </div>
      <div className={'formula-editor-bottom'}>
        <div ref={selectableDivRef} className={'formula-editor-bottom-translate'}>
          {translateStr}
        </div>
      </div>
    </div>
  );
};

export default TinymceEditor;
