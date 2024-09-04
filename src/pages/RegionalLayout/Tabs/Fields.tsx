import React, { useEffect, useState, useMemo } from 'react';
import { FooterToolbar, ProCard } from '@ant-design/pro-components';
import { Button, Spin, Tree, Space, Input, Radio, Checkbox, message } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import type { RadioChangeEvent } from 'antd';
import { UpOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons';
import {FieldsData, getOptions, TreeData} from '../DataSource';
import '../index.less';

type areaItem = {
    id?: number;
    title: React.ReactNode;
    name: string;
    areaSpan: number;
    areaId: number;
    children: fieldItem[];
};

type fieldItem = {
    tableName?: string;
    tableDesc?: string;
    fieldDesc?: string;
    fieldName?: string;
    isChoose?: boolean;
    name?: string;
};

type DataItem = {
    title: string;
    key: string;
    disabled: boolean;
    children?: DataItem[] | null;
    fieldsName: string;
    fieldDesc: string;
};

type list = {
    key: React.Key;
    title: string;
};

type FieldsProps = {
    dataSource: API.FormAreasItem[],
}

const { Search } = Input;

const Fields: React.FC<FieldsProps> = (props) => {
    /*
     * 页面逻辑：
     * 左侧区域：树只能选择叶节点，已选择的节点需要disabled，不能再点击选择
     * 右侧区域：radio默认选中第一个区域，若删除则右侧区域解除disabled，上下移动可以跨区域进行移动，
     * 需要判断移动的节点是否在头部或者尾部，是否需要移动到其他区域，
     * 往下移动时，已被选中的字段顺序需从选中的最后的元素开始一个个地往下移动，然后areaId则取移动前下一个数组元素的areaId，
     * 若是最后一个元素，则需判断areaId后面是否还有其他区域，若有则把areaId设置为下一个区域；
     * 往上移动时，已被选中的字段顺序需从选中的第一个元素开始一个个地往上移动；然后areaId则取移动前前一个数组元素的areaId,
     * 若是第一个元素，则需判断areaId前面是否还有其他区域，若有则把areaId设置为上一个区域；
     * 布局区域被合并则之前被选中的字段默认放到最后的区域
     * */
    const {dataSource} = props;
    const [loading, setLoading] = useState(false);
    // 右侧表格源数据
    const [areaArr, setAreaArr] = useState<areaItem[]>([]);
    // 左侧树源数据
    const [treeDatasource, setTreeDatasource] = useState<DataNode[]>([]);
    // 左侧树的搜索框的值
    const [searchValue, setSearchValue] = useState('');
    // 左侧树原数据
    const [dataList, setDataList] = useState<list[]>([]);
    // 树需展开的节点
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>();
    // 树的父节点是否自动展开
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    // 右侧选择区域
    const [radioValue, setRadioValue] = useState<number>(1);
    const [checkedValue, setCheckedValue] = useState<string[]>([]);

    const generateData = (data: API.LayoutTableItem[], parentKey: string = '') => {
        const newData: DataItem[] = [];
        if (!data || data.length <= 0) {
            return null;
        }
        data.forEach((v) => {
            let title: string = '';
            let key = '';
            let fieldsName = '';
            let fieldDesc = '';
            if (v.fieldName) {
                title = `${v?.fieldDesc ? v.fieldDesc : ''}(${v?.fieldName})`;
                key = `${parentKey}~${v.fieldName}`;
                fieldsName = v?.fieldName || '';
                fieldDesc = v?.fieldDesc || '';
            } else if (v.tableName) {
                title = `${v?.tableDesc ? v.tableDesc : ''}(${v.tableName})`;
                key = v.tableName;
                fieldsName = v?.tableName || '';
                fieldDesc = v?.tableDesc || '';
            }
            const item: DataItem = {
                title: title,
                key: key,
                disabled: !!v.tableName,
                fieldsName,
                fieldDesc,
            };
            if (v.fields) {
                item.children = generateData(v.fields, v.tableName || '');
            }
            newData.push(item);
        });
        return newData;
    };
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

    const getDataList = async () => {
        setLoading(true);
        // 设置左侧树数据源
        let treeData: DataItem[] = generateData(TreeData) as DataItem[];
        // 获取已设置的区域
        const sectionOption = getOptions();
        if (dataSource && dataSource?.length) {
            const newAreaArr: areaItem[] = [];
            let otherChildren: fieldItem[] = [];
            for (let i = 1; i < 7; i++) {
                const dataItem = dataSource?.find(
                    (item: API.LayoutFormAreas) => item.areaId === i,
                );
                const children: fieldItem[] = [];
                FieldsData.forEach((item: API.LayoutFieldsItem) => {
                    if (treeData?.length) {
                        // 设置左侧树数据源
                        treeData.forEach((v) => {
                            if (v.fieldsName === item.tableCode && v?.children?.length) {
                                v.children.forEach((v2) => {
                                    if (v2.fieldsName === item.fieldCode) {
                                        // 已被选中，设置不能再次选择
                                        v2.disabled = true;
                                    }
                                });
                            }
                        });
                    }
                    // 对返回的字段数据根据区域id值进行分类
                    if (item.areaId === i) {
                        let newField: fieldItem = {};
                        TreeData.some((item2: API.LayoutTableItem) => {
                            // 对字段code进行转换
                            if (item2.tableName === item.tableCode) {
                                newField = {
                                    tableName: item2.tableName,
                                    tableDesc: item2.tableDesc,
                                    isChoose: false,
                                    name: item.name,
                                };
                                if (item2.fields && item2.fields.length) {
                                    item2.fields.some((item3: API.LayoutTableItem) => {
                                        if (item3.fieldName === item.fieldCode) {
                                            newField = {
                                                ...newField,
                                                fieldName: item3.fieldName,
                                                fieldDesc: item3?.fieldDesc,
                                            };
                                            return true;
                                        }
                                        return false;
                                    });
                                }
                                return true;
                            }
                            return false;
                        });
                        if (Object.keys(newField).length) {
                            // 把分类好的字段值push到区域的children属性
                            children.push({ ...newField });
                        }
                    }
                });
                if (dataItem) {
                    // 找到区域值
                    // areaIdArr.push(i);
                    let areaItems: areaItem = {
                        // ...sectionOption[i],
                        title: sectionOption[i].label,
                        ...dataItem,
                        children,
                    };
                    newAreaArr.push({
                        ...areaItems,
                    });
                } else {
                    // 这些字段原有的区域已被其他区域合并，则需要集中起来放到最后一个区域
                    otherChildren = otherChildren.concat(children);
                }
            }
            newAreaArr[newAreaArr.length - 1].children =
                newAreaArr[newAreaArr.length - 1].children.concat(otherChildren);
            setAreaArr(newAreaArr);
            if (newAreaArr?.length) {
                // 右侧设置默认选中第一个区域
                setRadioValue(newAreaArr[0]?.areaId as number);
            }
        }
        // 设置左侧树数据源
        setTreeDatasource(treeData as DataNode[]);
        generateList(treeData as DataNode[]);
        setLoading(false);
    };

    const onSearch = (value: string) => {
        // 处理人员数据源
        const newExpandedKeys = dataList
            .map((item) => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, treeDatasource);
                }
                return null;
            })
            .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i));
        setExpandedKeys(newExpandedKeys);
        setSearchValue(value);
        setAutoExpandParent(true);
    };

    useEffect(() => {
        getDataList();
    }, []);

    useEffect(() => {
        onSearch('');
    }, [dataList]);

    const onSave = async () => {
        const params: API.LayoutFieldsItem[] = [];
        areaArr.forEach((item) => {
            if (item?.children?.length) {
                item.children.forEach((item2) => {
                    const fields: API.LayoutFieldsItem = {
                        areaId: item?.areaId as number,
                        id: item?.id as number,
                        fieldCode: item2?.fieldName as string,
                        tableCode: item2?.tableName as string,
                        name: item2.name,
                    };
                    params.push(fields);
                });
            }
        });
        if (params?.length) {
            console.log(params, '----params----');
            message.success('布局设置成功');
        } else {
            message.warning('请选择字段');
        }
    };

    const onSelect: TreeProps['onSelect'] = (selectedKey) => {
        if (selectedKey?.length) {
            const keyArr: string[] = (selectedKey[0] as string).split('~');
            let children: fieldItem = {};
            const data: DataItem[] = [...treeDatasource] as DataItem[];
            if (data) {
                data.forEach((item) => {
                    if (item && item.key === keyArr[0] && item?.children?.length) {
                        item.children.forEach((item2) => {
                            if (item2 && item2.key === selectedKey[0]) {
                                children = {
                                    tableName: item.fieldsName,
                                    tableDesc: item.fieldDesc,
                                    fieldDesc: item2.fieldDesc,
                                    fieldName: item2.fieldsName,
                                    isChoose: false,
                                    name: item2.fieldDesc,
                                };
                                item2.disabled = true;
                            }
                        });
                    }
                });
                const newAreaArr = [...areaArr];
                if (newAreaArr?.length) {
                    newAreaArr.forEach((item) => {
                        if (item.areaId === radioValue) {
                            item.children = item.children.concat(children);
                        }
                    });
                    setAreaArr(newAreaArr);
                }
                setTreeDatasource(data as DataNode[]);
            }
        }
    };
    const treeData = useMemo(() => {
        const loop = (data: DataNode[]): DataNode[] =>
            data.map((item) => {
                const strTitle = (item.title as string) || '';
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
              {beforeStr}
                            <span className={'regionalFields-card-leftCard-searchSite'}>{searchValue}</span>
                            {afterStr}
            </span>
                    ) : (
                        <span>{strTitle}</span>
                    );
                if (item.children) {
                    // disabled设置为true，只有最后一层的子节点可以选择
                    return {
                        title: title,
                        key: item.key,
                        children: loop(item.children),
                        disabled: item.disabled,
                        // selectable: !item.disabled,
                    };
                }
                return {
                    title: title,
                    key: item.key,
                    disabled: item.disabled,
                    // selectable: !item.disabled,
                };
            });

        return loop(treeDatasource);
    }, [searchValue, treeDatasource]);
    const onExpand = (newExpandedKeys: React.Key[]) => {
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
    };
    const onRadioChange = (e: RadioChangeEvent) => {
        // 右侧区域选择
        setRadioValue(e.target.value);
    };
    const onCheckboxChange = (checkedValues: string[], areaId: number) => {
        // 右侧字段选择
        const newAreaArr = [...areaArr];
        const newCheckedValues: string[] = [];
        if (newAreaArr?.length) {
            newAreaArr.forEach((item) => {
                // 由于跨区域选择会导致之前已选择的区域的字段不会被选中
                if (item.areaId === areaId && item?.children?.length) {
                    // 区域id相等，则是选择了该区域的字段
                    item.children.forEach((item2) => {
                        const value = `${item2.tableName}~${item2.fieldName}`;
                        item2.isChoose = checkedValues.includes(value);
                        if (checkedValues.includes(value)) {
                            newCheckedValues.push(value);
                        }
                    });
                } else {
                    // 区域id不相等，获取该区域之前选择的字段
                    item.children.forEach((item2) => {
                        const value = `${item2.tableName}~${item2.fieldName}`;
                        if (item2.isChoose) {
                            newCheckedValues.push(value);
                        }
                    });
                }
            });
            setAreaArr(newAreaArr);
        }
        setCheckedValue([...newCheckedValues]);
    };
    const handleAllChose = () => {
        //   全选
        const keyArr: string[] = [];
        const newAreaArr = [...areaArr];
        if (newAreaArr?.length) {
            newAreaArr.forEach((item1) => {
                if (item1?.children?.length) {
                    item1.children.forEach((item2) => {
                        // 获取字段key值
                        const key = `${item2.tableName}~${item2.fieldName}`;
                        if (!item2.isChoose) {
                            keyArr.push(key);
                        }
                        item2.isChoose = !item2.isChoose;
                    });
                }
            });
            setAreaArr(newAreaArr);
        }
        setCheckedValue([...keyArr]);
    };
    const moveUpElements = (array2D: areaItem[], elementsToMove: string[]) => {
        // 点击上移的逻辑
        // 遍历每个子数组
        for (let i = 0; i < array2D.length; i++) {
            let subArray = array2D[i]?.children;
            // 遍历当前子数组中的元素
            for (let j = 0; j < subArray.length; j++) {
                // 除了第一项不用移动，其他选中的都需移动
                const currentElement = `${subArray[j]?.tableName}~${subArray[j]?.fieldName}`;
                const currentChildren = subArray[j];
                // 如果当前元素是需要移动的元素之一
                if (elementsToMove.includes(currentElement)) {
                    // 循环过的元素则直接把选中数组elementsToMove里面的值删除，避免导致死循环
                    const index = elementsToMove.indexOf(currentElement);
                    elementsToMove.splice(index, 1);
                    // 移动元素的位置为当前元素的索引减 1（往前移动一位），如果索引为 0 则移动到前一条数据的子数组末尾
                    subArray.splice(j, 1);
                    // 从当前位置删除元素
                    if (j !== 0) {
                        array2D[i].children.splice(j - 1, 0, currentChildren);
                        // 更新 j 的值，因为元素被移动了
                        j--;
                    } else if (i !== 0) {
                        // 第一个子数组
                        array2D[i - 1].children.push(currentChildren);
                        // 更新 j 的值，因为元素被移动了
                        j--;
                    } else {
                        array2D[0].children.unshift(currentChildren);
                    }
                }
            }
        }
        return array2D;
    };
    const moveDownElements = (array2D: areaItem[], elementsToMove: string[]) => {
        // 点击下移的逻辑
        // 遍历每个子数组
        for (let i = array2D.length - 1; i >= 0; i--) {
            let subArray = array2D[i]?.children;
            // 遍历当前子数组中的元素
            for (let j = subArray.length - 1; j >= 0; j--) {
                // 除了最后一项不用移动，其他选中的都需移动
                const currentElement = `${subArray[j]?.tableName}~${subArray[j]?.fieldName}`;
                const currentChildren = subArray[j];
                // 如果当前元素是需要移动的元素之一
                if (elementsToMove.includes(currentElement)) {
                    // 循环过的元素则直接把选中数组elementsToMove里面的值删除，避免导致死循环
                    const index = elementsToMove.indexOf(currentElement);
                    let length = subArray.length - 1;
                    elementsToMove.splice(index, 1);
                    // 移动元素的位置为当前元素的索引加 1（往后移动一位），如果索引为当前子集最后一条数据则移动到下一子集的子数组前面
                    subArray.splice(j, 1);
                    // 从当前位置删除元素
                    if (j !== length) {
                        array2D[i].children.splice(j + 1, 0, currentChildren);
                        // 更新 j 的值，因为元素被移动了
                        j++;
                    } else if (i !== array2D.length - 1) {
                        // 子数组最后一个元素
                        if (array2D[i + 1]?.children) {
                            array2D[i + 1].children.unshift(currentChildren);
                        } else {
                            array2D[i + 1].children = [currentChildren];
                        }
                        // 更新 j 的值，因为元素被移动了
                        j++;
                    } else {
                        // 子集最后一个元素
                        array2D[array2D.length - 1].children.push(currentChildren);
                    }
                }
            }
        }
        return array2D;
    };
    const handleUp = () => {
        //上移
        const newAreaArr = moveUpElements([...areaArr], [...checkedValue]);
        setAreaArr([...newAreaArr]);
    };
    const handleDown = () => {
        // 下移
        const newAreaArr = moveDownElements([...areaArr], [...checkedValue]);
        setAreaArr([...newAreaArr]);
    };
    const handleDelete = () => {
        //删除右侧的字段值
        if (treeDatasource?.length) {
            // 把左侧树disabled的节点解锁
            const treeData = [...treeDatasource];
            treeData.forEach((item1) => {
                if (item1?.children?.length) {
                    item1.children.forEach((item2) => {
                        if (checkedValue.includes(item2.key as string)) {
                            item2.disabled = false;
                        }
                    });
                }
            });
            setTreeDatasource(treeData as DataNode[]);
        }
        const newAreaArr = [...areaArr];
        if (newAreaArr?.length) {
            // 删除右侧的区域的字段值
            newAreaArr.forEach((item1) => {
                if (item1?.children?.length) {
                    const children: fieldItem[] = [];
                    item1.children.forEach((item2) => {
                        const key = `${item2.tableName}~${item2.fieldName}`;
                        if (!checkedValue.includes(key)) {
                            // 筛选出没被选中的节点
                            children.push(item2);
                        }
                    });
                    item1.children = children;
                }
            });
            setAreaArr(newAreaArr);
        }
    };
    return (
        <ProCard>
            <Spin spinning={loading}>
                <div className={'regionalFields'}>
                    <ProCard bordered className={'regionalFields-card'} split={'vertical'}>
                        <ProCard
                            title={'可选字段'}
                            className={'regionalFields-card-leftCard'}
                        >
                            <Search
                                style={{ marginBottom: 8 }}
                                placeholder={'请输入关键字'}
                                onSearch={onSearch}
                            />
                            <div style={{ height: '80%', overflowY: 'auto' }}>
                                {treeDatasource.length > 0 && (
                                    <Space>
                                        <Tree
                                            onExpand={onExpand}
                                            expandedKeys={expandedKeys}
                                            onSelect={onSelect}
                                            treeData={treeData}
                                            defaultExpandAll
                                            defaultExpandParent
                                            autoExpandParent={autoExpandParent}
                                        />
                                    </Space>
                                )}
                            </div>
                        </ProCard>
                        <ProCard className={'regionalFields-card-rightCard'}>
                            <div className={'regionalFields-card-rightCard-content'}>
                                <div className={'regionalFields-card-rightCard-content-operate'}>
                                    <Button
                                        type="primary"
                                        className={'regionalFields-card-rightCard-content-operate-button'}
                                        onClick={handleUp}
                                    >
                                        <UpOutlined style={{ fontSize: 12 }} />
                                    </Button>
                                    <Button
                                        type="primary"
                                        className={'regionalFields-card-rightCard-content-operate-button'}
                                        onClick={handleDown}
                                    >
                                        <DownOutlined style={{ fontSize: 12 }} />
                                    </Button>
                                    <Button
                                        danger
                                        className={'regionalFields-card-rightCard-content-operate-button'}
                                        onClick={handleDelete}
                                    >
                                        <DeleteOutlined style={{ fontSize: 12 }} />
                                    </Button>
                                </div>
                                <div>
                                    <div className={'regionalFields-card-rightCard-content-head'}>
                                        <div className={'regionalFields-card-rightCard-content-row-first'} />
                                        <div className={'regionalFields-card-rightCard-content-row-second'}>
                                            <a onClick={handleAllChose} style={{ color: '#0B2470' }}>
                                                选择
                                            </a>
                                        </div>
                                        <div className={'regionalFields-card-rightCard-content-row-third'}>
                                           数据表
                                        </div>
                                        <div className={'regionalFields-card-rightCard-content-row-four'}>
                                            已选字段
                                        </div>
                                    </div>
                                    <div className={'regionalFields-card-rightCard-content-table'}>
                                        <Radio.Group
                                            onChange={onRadioChange}
                                            value={radioValue}
                                            style={{ width: '100%' }}
                                        >
                                            {areaArr.map((item) => {
                                                return (
                                                    <div key={item.areaId}>
                                                        <div className={'regionalFields-card-rightCard-content-row'}>
                                                            <div
                                                                className={'regionalFields-card-rightCard-content-row-first'}
                                                            >
                                                                <Radio value={item.areaId} />
                                                            </div>
                                                            <div
                                                                className={'regionalFields-card-rightCard-content-row-second1'}
                                                            >
                                                                {item.title}
                                                            </div>
                                                        </div>
                                                        {item.children && item.children.length > 0 && (
                                                            <Checkbox.Group
                                                                value={checkedValue}
                                                                style={{ width: '100%' }}
                                                                onChange={(checkedValues) =>
                                                                    onCheckboxChange(checkedValues as string[], item.areaId as number)
                                                                }
                                                            >
                                                                {item.children.map((item2) => {
                                                                    return (
                                                                        <div
                                                                            className={'regionalFields-card-rightCard-content-row'}
                                                                            key={item2.fieldName}
                                                                        >
                                                                            <div
                                                                                className={
                                                                                    'regionalFields-card-rightCard-content-row-first'
                                                                                }
                                                                            />
                                                                            <div
                                                                                className={
                                                                                    'regionalFields-card-rightCard-content-row-second'
                                                                                }
                                                                            >
                                                                                <Checkbox value={`${item2.tableName}~${item2.fieldName}`} />
                                                                            </div>
                                                                            <div
                                                                                className={
                                                                                    'regionalFields-card-rightCard-content-row-third'
                                                                                }
                                                                            >
                                                                                <span>{`${
                                                                                    item2?.tableDesc ? item2?.tableDesc : ''
                                                                                }(${item2.tableName})`}</span>
                                                                            </div>
                                                                            <div
                                                                                className={
                                                                                    'regionalFields-card-rightCard-content-row-four'
                                                                                }
                                                                            >
                                                                                 <span>{`${
                                                                                     item2?.fieldDesc ? item2?.fieldDesc : ''
                                                                                 }(${item2.fieldName})`}</span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </Checkbox.Group>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </Radio.Group>
                                    </div>
                                </div>
                            </div>
                        </ProCard>
                    </ProCard>
                </div>
                <FooterToolbar portalDom={false}>
                    <Button type="primary" onClick={onSave} disabled={loading}>
                        保存
                    </Button>
                </FooterToolbar>
            </Spin>
        </ProCard>
    );
};

export default Fields;