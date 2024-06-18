/**
 *
 * 常量
 */
import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import {FormulaConstant} from "@/pages/FormulaEditor/DataSource";
import '../index.less';

const { Search } = Input;

type ConstantProps = {
  setLoading: (value: boolean) => void;
  addField: (values: API.FormulaFieldItem[]) => void;
};

const Constant: React.FC<ConstantProps> = (props) => {
  const { addField } = props;
  const [searchDataSource, setSearchDataSource] = useState<API.FormulaConstantItem[]>([]);

  const onSearch = (value: string) => {
    // 处理常量数据源
    const newDataList = FormulaConstant.filter(
      (item) => item?.title.includes(value),
    );
    setSearchDataSource(newDataList);
  };
  useEffect(() => {
    setSearchDataSource(FormulaConstant);
  }, []);
  return (
    <div className={'formula-left-constant'}>
      <Search
        style={{ marginBottom: 8 }}
        placeholder={'可以根据表字段编码和描述搜索'}
        onSearch={onSearch}
        allowClear={true}
        onMouseDown={(e) => e.preventDefault()}
      />
      <div className={'formula-left-constant-tag'}>
        {searchDataSource?.map((item) => (
          <a
            key={item.code}
            className={'formula-left-constant-tag-item'}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              addField([
                {
                  type: 'constant',
                  value: item.code,
                  title: item.title,
                },
              ])
            }
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Constant;
