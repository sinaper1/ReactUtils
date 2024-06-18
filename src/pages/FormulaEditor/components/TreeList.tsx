/**
 *
 * 可选择树
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Tree } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import '../index.less';

type DataNode = {
  key: React.Key;
  title?: React.ReactNode | ((data: DataNode) => React.ReactNode);
  tips?: boolean;
  children?: DataNode[];
  disabled?: boolean;
};

type PersonnelDataProps = {
  defaultExpandAll: boolean;
  treeDatasource: DataNode[];
  searchValue: string;
  handleSelect: (values: string[]) => void;
};

type list = {
  key: React.Key;
  title: string;
};

const TreeList: React.FC<PersonnelDataProps> = (props) => {
  const { defaultExpandAll, treeDatasource, searchValue, handleSelect } = props;
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [dataList, setDataList] = useState<list[]>([]);
  const generateList = (data: DataNode[]) => {
    const newDataList: list[] = [];
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      newDataList.push({ key, title: title as string });
      if (node.children) {
        generateList(node.children);
      }
    }
    setDataList((oldData) => [...oldData, ...newDataList]);
  };

  const getHighlightedText = (text: string) => {
    // 高亮显示搜索查询的部分
    if (!searchValue) return [<span key={text}>{text}</span>];
    const parts = text.split(new RegExp(`(${searchValue})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchValue.toLowerCase() ? (
        <span key={index} style={{ color: 'red' }}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
  };

  const getFormattedAndHighlightedText = (text: string) => {
    // 加粗显示括号前的部分并高亮
    const match = text.match(/^(.*?)(\()(.*)/);
    if (!match) return getHighlightedText(text);

    const beforeParen: string = match[1];
    const afterParen: string = match[2] + match[3]; // including the parenthesis

    return [
      <b key="before">{getHighlightedText(beforeParen)}</b>,
      ...getHighlightedText(afterParen),
    ];
  };

  const treeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        // tips通过文字提示的方式进行提示
        const title = item?.tips ? (
          <div className={'com-formula-editor-card-leftCard-title'}>
            {getFormattedAndHighlightedText(strTitle)}
          </div>
        ) : (
          <div className={'com-formula-editor-card-leftCard-title'}>
            {getHighlightedText(strTitle)}
          </div>
        );
        if (item.children) {
          // disabled设置为true，只有最后一层的子节点为false
          return { title, key: item.key, children: loop(item.children), selectable: false };
        }
        return {
          title,
          key: item.key,
        };
      });
    return loop(treeDatasource);
  }, [searchValue, treeDatasource]);
  const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey!;
  };
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  const onSearch = () => {
    // 处理人员数据源
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(searchValue) > -1) {
          return getParentKey(item.key, treeDatasource);
        }
        return null;
      })
      .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i));
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(true);
  };
  useEffect(() => {
    generateList(treeDatasource);
  }, [treeDatasource]);
  useEffect(() => {
    if (dataList?.length) {
      if (defaultExpandAll) {
        onSearch();
      }
    }
  }, [searchValue, dataList]);
  const onSelect: TreeProps['onSelect'] = (selectedKey) => {
    if (selectedKey?.length && handleSelect) {
      handleSelect(selectedKey as string[]);
    }
  };
  return (
    <div>
      <Tree
        onSelect={onSelect}
        treeData={treeData}
        defaultExpandAll
        autoExpandParent={autoExpandParent}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        selectedKeys={[]}
      />
    </div>
  );
};

export default TreeList;
