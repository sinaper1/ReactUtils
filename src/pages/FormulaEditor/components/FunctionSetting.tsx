/**
 *
 * 函数
 */
import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import type { DataNode } from 'antd/es/tree';
import TreeList from '@/pages/FormulaEditor/components/TreeList';
import '../index.less';
import {FormulaFunc} from "@/pages/FormulaEditor/DataSource";

const { Search } = Input;

type FunctionSettingProps = {
  setLoading: (value: boolean) => void;
  addField: (values: API.FormulaFieldItem[], offset: boolean) => void;
};

type DataItem = {
  title: string;
  key: string;
  children?: DataItem[] | null;
  tips?: string;
  parameters?: API.FormulaConstantItem[];
};

const FunctionSetting: React.FC<FunctionSettingProps> = (props) => {
  const { setLoading, addField } = props;
  const [searchValue, setSearchValue] = useState('');
  const [treeDatasource, setTreeDatasource] = useState<DataNode[]>([]);
  const [data, setData] = useState<DataItem[]>([]);
  const getParametersData = (data: API.FormulaConstantItem[], type: string) => {
    let title: string = '(';
    data?.forEach((v, index) => {
      if (index !== data?.length - 1) {
        // 非最后一个元素，需要加,
        title += type === 'tips' ? `${v.title}，` : `${v.code}，`;
      } else {
        title += type === 'tips' ? `${v.title}` : `${v.code}`;
      }
    });
    title += ')';
    return title;
  };
  const getFunctionsData = (data: API.FormulaConstantItem[], fatherCode: string) => {
    const newData: DataItem[] = [];
    if (!data || data.length <= 0) {
      return null;
    }
    data.forEach((v) => {
      const item: DataItem = {
        title: v.title,
        key: `${fatherCode}.${v.code}`,
      };
      if (v?.parameters?.length) {
        let title = v.code;
        let tips = '';
        title += getParametersData(v.parameters, 'title');
        tips += getParametersData(v.parameters, 'tips');
        if (tips) {
          tips = `${v.title}：${v.code}${tips}`;
        }
        item.title = title;
        item.parameters = v.parameters;
        item.tips = tips;
      }
      newData.push(item);
    });
    return newData;
  };
  const resetDataSource = (data: API.FormulaConstantItem[]) => {
    const newData: DataItem[] = [];
    if (!data || data.length <= 0) {
      return null;
    }
    data.forEach((v) => {
      const item: DataItem = {
        title: `${v.title}(${v.code})`,
        key: v.code,
      };
      if (v?.children?.length) {
        item.children = getFunctionsData(v.children, v.code);
      }
      newData.push(item);
    });
    return newData;
  };
  const onSearch = (value: string) => {
    setSearchValue(value);
  };
  useEffect(() => {
    setLoading(true);
    const newData: API.FormulaConstantItem[] = [...FormulaFunc];
    let treeData: DataItem[] = resetDataSource(newData) as DataItem[];
    setData(treeData);
    setTreeDatasource(treeData as DataNode[]);
    setLoading(false);
  }, []);
  const getDataItem = (key: string, datasource: DataItem[]) => {
    //通过key查找对应的节点信息
    let obj: API.FormulaFieldItem = {};
    if (datasource?.length) {
      datasource.some((item: DataItem) => {
        if (item?.key === key) {
          // type: field:字段，operator：操作符，func：函数，constant：常量，text：普通文本
          let arr: API.FormulaFieldItem[] = [
            {
              type: 'func',
              value: item.key,
              title: item.title?.split('(')[0],
            },
          ];
          obj = {
            type: 'func',
            value: item.key,
            title: item.title?.split('(')[0],
          };
          if (item?.parameters?.length) {
            // 左括号
            arr.push({ type: 'operator', value: '(', title: '(', offset: true });
            let title = '';
            for (let i = 0; i < item.parameters.length - 1; i++) {
              // 使用逗号分割参数
              title += ',';
            }
            if (title) {
              // 逗号是普通文本，使用text
              arr.push({ type: 'text', value: title, title: title });
            }
            // 右括号
            arr.push({ type: 'operator', value: ')', title: ')' });
          }
          addField(arr, true);
          return true;
        } else if (item?.children?.length) {
          const newObj = getDataItem(key, item?.children);
          if (Object.keys(newObj)?.length) {
            obj = { ...newObj };
            return true;
          }
        }
        return false;
      });
    }
    return obj;
  };
  const handleSelect = (values: string[]) => {
    if (values?.length) {
      getDataItem(values[0], data);
    }
  };
  return (
    <div className={'formula-left-function'}>
      <Search
        style={{ marginBottom: 8 }}
        placeholder={'可以根据函数名和描述搜索'}
        onSearch={onSearch}
        allowClear={true}
        onMouseDown={(e) => e.preventDefault()}
      />
      <div className={'formula-left-function-tree'}>
        {treeDatasource?.length > 0 && (
          <TreeList
            defaultExpandAll={true}
            treeDatasource={treeDatasource}
            searchValue={searchValue}
            handleSelect={handleSelect}
          />
        )}
      </div>
    </div>
  );
};

export default FunctionSetting;
