/**
 *
 * 编辑公式弹窗
 * @params
 * @return
 */
import React, { useEffect, useRef, useState } from 'react';
import type { TabsProps } from 'antd';
import { Spin, Tabs, Button } from 'antd';
import { ProCard, PageContainer } from '@ant-design/pro-components';
import Field from '@/pages/FormulaEditor/components/Field';
import Constant from '@/pages/FormulaEditor/components/Constant';
import FunctionSetting from '@/pages/FormulaEditor/components/FunctionSetting';
import Editor from '@/pages/FormulaEditor/components/Editor';
import TinymceEditor from '@/pages/FormulaEditor/components/TinymceEditor';
import {FormulaSymbol, FormulaConstant, FormulaField, FormulaFunc} from '@/pages/FormulaEditor/DataSource';
import './index.less';
type DataItem = {
    [key in string]: string;
};
const EditModal = () => {
    const editorRef = useRef<any>();
    const formulaDataList: API.FormulaValueType[] = []
    const [loading, setLoading] = useState<boolean>(false);
    const [tabKey, setTabKey] = useState<string>('1');
    // 公式数据
    const [formulaList, setFormulaList] = useState<API.FormulaValueType[]>([]);
    // 公式翻译数据
    const [translateStr, setTranslateStr] = useState<string>('');
    // 字段、函数、常量以及运算符等全部可选择的数据
    const [dataList, setDataList] = useState<DataItem>({});
    const getFieldDataList = (data: API.FormulaConstantItem[], fatherCode?: string) => {
        // 处理字段数据
        if (data?.length) {
            const item: DataItem = {};
            data.forEach((v) => {
                if (v?.children?.length) {
                    getFieldDataList(v.children, v?.code);
                } else {
                    const key = fatherCode ? `${fatherCode}.${v.code}` : v.code;
                    item[key] = v.title;
                }
            });
            setDataList((oldData) => ({ ...item, ...oldData }));
        }
    };
    const getDataList = async () => {
        setLoading(true);
        if (FormulaSymbol?.length) {
            // 处理符号数据
            const item: DataItem = {};
            FormulaSymbol.forEach((v) => {
                item[v?.code] = v?.title;
            });
            setDataList((oldData) => ({ ...item, ...oldData }));
        }
        if (FormulaField?.length) {
            // 获取字段数据
            getFieldDataList(FormulaField);
        }
        if (FormulaConstant?.length) {
            // 获取常量数据
            const item: DataItem = {};
            FormulaConstant.forEach((v) => {
                item[v?.code] = v?.title;
            });
            setDataList((oldData) => ({ ...item, ...oldData }));
        }
        if (FormulaFunc?.length) {
            // 获取函数数据
            getFieldDataList(FormulaFunc);
        }
        setLoading(false);
    };
    useEffect(() => {
        getDataList();
    }, []);
    const onTabsChange = (key: string) => {
        setTabKey(key);
    };

    /**
     * @description: 插入文本时改变光标位置
     * @param {String} content
     * @return {*}
     */
    const selectionSetRng = (content: string) => {
        if (editorRef.current) {
            const editor = editorRef.current;
            const selection = editor.selection;

            // 插入内容，并使用唯一ID标记插入位置
            const uniqueId = `inserted-content-${Date.now()}`;
            const contentWithId = content.replace('INSERT_ID_HERE', uniqueId);

            editor.insertContent(contentWithId);

            // 查找插入的内容
            const insertedElement = editor.dom.select(`#${uniqueId}`)[0];
            if (insertedElement) {
                // 找到第一个参数的位置
                const mentionOperatorSpan = insertedElement.nextSibling;
                if (mentionOperatorSpan && mentionOperatorSpan.nextSibling) {
                    const textNode = mentionOperatorSpan.nextSibling;

                    // 创建新的 Range 对象并设置光标位置
                    const range = editor.dom.createRng();
                    range.setStart(textNode, 0);
                    range.setEnd(textNode, 0);
                    // 设置选区并聚焦
                    selection.setRng(range);
                    editor.focus();
                }
            }
        }
    };

    const addField = (values: API.FormulaFieldItem[], offset?: boolean) => {
        if (editorRef.current) {
            // 增加字段到右侧编辑器
            const editor = editorRef.current;
            let content = '';
            if (values?.length) {
                values.forEach((item) => {
                    // type: field:字段，operator：操作符，func：函数，constant：常量，text：普通文本
                    if (['field', 'constant', 'operator'].includes(item?.type as string)) {
                        content += `<span class="mention-${item?.type}" contenteditable="false" data-key="${item?.value}">${item?.title}</span>`;
                        if (item?.offset) {
                            // 添加一个空标签以便于光标停留在第一个函数参数的位置
                            content += `<span id="cursor-position-${Date.now()}"/>`;
                        }
                    } else if (item?.type === 'func') {
                        //   添加函数名
                        content += `<span class="mention-${item?.type}" id="INSERT_ID_HERE" contenteditable="false" data-key="${item?.value}">${item?.title}</span>`;
                    } else {
                        // 只插入内容
                        content += item?.title;
                    }
                });
                if (offset) {
                    selectionSetRng(content);
                } else {
                    editor.insertContent(content);
                }
            }
            // 显示光标
            editor.focus();
        }
    };
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '字段',
            children: <Field setLoading={setLoading} addField={addField} />,
        },
        {
            key: '2',
            label: '常量',
            children: <Constant setLoading={setLoading} addField={addField} />,
        },
        {
            key: '3',
            label: '函数',
            children: (
                <FunctionSetting setLoading={setLoading} addField={addField} />
            ),
        },
    ];

    const handleSubmit = () => {
        // 这可添加提交，语法检查等逻辑
        console.log(formulaList, translateStr, '---translateStr---');
    }

    return (
        <PageContainer
            footer={[
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    提交
                </Button>,
            ]}
        >
            <Spin spinning={loading}>
                <div className="com-formula-editor">
                    <ProCard
                        bordered
                        split={'vertical'}
                        className={'com-formula-editor-card'}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <ProCard className={'com-formula-editor-card-leftCard'} colSpan="20%">
                            <ProCard split="vertical">
                                <ProCard>
                                    <Tabs activeKey={tabKey} items={items} onChange={onTabsChange} />
                                </ProCard>
                            </ProCard>
                        </ProCard>
                        <ProCard className={'com-formula-editor-card-rightCard'} split="horizontal">
                            <ProCard
                                title={'编辑公式'}
                                className={'com-formula-editor-card-rightCard-top'}
                            >
                                <Editor addField={addField} />
                            </ProCard>
                            <ProCard className={'com-formula-editor-card-rightCard-bottom'}>
                                <TinymceEditor
                                    fieldColor={'#0000CD'}
                                    constantColor={'#FF0000'}
                                    funcColor={'#1C88E5'}
                                    operatorColor={'#22A666'}
                                    editorRef={editorRef}
                                    formulaDataList={formulaDataList}
                                    dataList={dataList}
                                    translateStr={translateStr}
                                    formulaList={formulaList}
                                    setTranslateStr={setTranslateStr}
                                    setFormulaList={setFormulaList}
                                />
                            </ProCard>
                        </ProCard>
                    </ProCard>
                </div>
            </Spin>
        </PageContainer>
    );
};

export default EditModal;
