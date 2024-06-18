/**
 *
 * 字段
 */
import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import type { DataNode } from 'antd/es/tree';
import TreeList from '@/pages/FormulaEditor/components/TreeList';
import {FormulaField} from "@/pages/FormulaEditor/DataSource";
import '../index.less';

const { Search } = Input;

type FieldProps = {
  setLoading: (value: boolean) => void;
  addField: (values: API.FormulaFieldItem[]) => void;
};

type DataItem = {
  title: string;
  key: string;
  children?: DataItem[] | null;
};

const Field: React.FC<FieldProps> = (props) => {
  const { setLoading, addField } = props;
  const [searchValue, setSearchValue] = useState('');
  const [treeDatasource, setTreeDatasource] = useState<DataNode[]>([]);
  const generateData = (data: API.FormulaConstantItem[], fatherCode?: string) => {
    const newData: DataItem[] = [];
    if (!data || data.length <= 0) {
      return null;
    }
    data.forEach((v, index) => {
      const item: DataItem = {
        title: v.title,
        key: fatherCode ? `${fatherCode}.${v.code}` : v.code,
      };
      if (v?.children?.length) {
        item.key = fatherCode ? `${fatherCode}.${v.code}${index}` : `${v.code}`;
        item.children = generateData(v.children, v?.code);
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
    let treeData: DataItem[] = generateData(FormulaField) as DataItem[];
    setTreeDatasource(treeData as DataNode[]);
    setLoading(false);
  }, []);
  const getDataItem = (
    key: string,
    datasource: API.FormulaConstantItem[],
    parentCode?: string,
  ) => {
    //通过key查找对应的节点信息
    let obj: API.FormulaFieldItem = {};
    if (datasource?.length) {
      datasource.some((item: API.FormulaConstantItem) => {
        let _children = item.children;
        if (_children?.length) {
          const newObj = getDataItem(key, _children, item?.code);
          if (Object.keys(newObj)?.length) {
            obj = { ...newObj };
            return true;
          }
        } else if (parentCode) {
          const code = `${parentCode}.${item?.code}`;
          if (code === key) {
            // type: field:字段，operator：操作符，func：函数，constant：常量，text：普通文本
            obj = {
              type: 'field',
              value: code,
              title: item.title,
            };
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
      let newData: API.FormulaFieldItem = getDataItem(values[0], FormulaField);
      addField([{ ...newData }]);
    }
  };
  return (
    <div className={'formula-left-field'}>
      <Search
        style={{ marginBottom: 8 }}
        placeholder={'可以根据表和字段搜索'}
        onSearch={onSearch}
        allowClear={true}
        onMouseDown={(e) => e.preventDefault()}
      />
      <div className={'formula-left-field-tree'}>
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

export default Field;
