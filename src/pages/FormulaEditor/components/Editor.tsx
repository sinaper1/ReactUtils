/**
 *
 * 编辑公式
 */
import React from 'react';
import { Tag } from 'antd';
import { FormulaSymbol } from '@/pages/FormulaEditor/DataSource';
import '../index.less';

type EditorProps = {
  // 增加右侧编辑器字段
  addField: (values: API.FormulaFieldItem[]) => void;
};

const Editor: React.FC<EditorProps> = (props) => {
  const { addField } = props;
  return (
    <div className={'formula-right-editor'}>
      <div className={'formula-right-editor-left'}>
        {FormulaSymbol?.map((item) => (
          <Tag
            className={'formula-right-editor-left-tag'}
            key={item.code}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              addField([
                {
                  title: item?.title,
                  value: item.code,
                  type: 'operator',
                },
              ])
            }
          >
            {item?.title}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default Editor;
