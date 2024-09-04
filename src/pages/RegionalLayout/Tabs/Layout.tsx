/**
 *
 * 区域布局
 * @params
 * @return
 */
import React, { useEffect, useState } from 'react';
import { FooterToolbar, ProCard, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import {Button, Form, message, Spin} from 'antd';
import {getOptions, coordinate, LayoutData} from '../DataSource';
import '../index.less';

type areaItem = {
    value: number;
    label: React.ReactNode;
    // 指定在哪一行开始显示网格元素。
    gridRowStart?: number;
    // 指定在哪一列开始显示网格元素。
    gridColumnStart?: number;
    // 指定哪一行停止显示网格元素。
    gridRowEnd?: number;
    // 指定哪一列停止显示网格元素。
    gridColumnEnd?: number;
    isShow?: boolean;
    // 需要用作下拉选项的value值
    sectionOptions?: number[];
    name?: string;
    areaSpan?: number;
};

type optionsItem = {
    value: number;
    label: React.ReactNode;
};

type LayoutProps = {
    setDataSource: (value: API.FormAreasItem[])=>void;
}

const Layout: React.FC<LayoutProps> = (props) => {
    const {setDataSource} = props;
    const [formRef] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [areaArr, setAreaArr] = useState<areaItem[]>([]);
    const [options, setOptions] = useState<optionsItem[]>([]);
    const getOptionArr = (index: number) => {
        let arr: number[] = [0];
        for (let i = 0; i < 7; i++) {
            if (i > index) {
                if (index % 2 === 0) {
                    //  偶数
                    // 右半侧区域的区域合并项的下拉选择数据
                    if (i % 2 === 0) {
                        if (i > index) {
                            arr.push(i);
                        }
                    }
                } else {
                    // 奇数
                    // 左半侧的区域合并项的下拉选择数据
                    if (i > index) {
                        arr.push(i);
                    }
                }
            }
        }
        return arr;
    };
    const getDataList = async () => {
        setLoading(true);
        const sectionOption = getOptions();
        setOptions(sectionOption);
        const newAreaArr: areaItem[] = [];
        // 保存处理后的新数据
        let newData = {};
        for (let i = 1; i < 7; i++) {
            // 获取合并区域的下拉选择数据
            const sectionOptions = getOptionArr(i);
            // 结束行
            let gridRowEnd = coordinate[i].gridRowEnd;
            // 结束列
            let gridColumnEnd = coordinate[i].gridColumnEnd;
            // 是否展示该区域
            let isShow = true;
            // 获取当前区域的数据
            const dataItem = LayoutData?.find((item: API.FormAreasItem) => item.areaId === i);
            // 给各个区域赋值
            let areaItems: areaItem = {
                ...sectionOption[i],
                gridRowStart: coordinate[i].gridRowStart,
                gridColumnStart: coordinate[i].gridColumnStart,
                // 获取合并区域的下拉选择数据
                sectionOptions: i !== 6 ? sectionOptions : [],
            };
            if (dataItem) {
                // 该区域是未被合并区域
                // 区域合并值
                const areaSpan: number = dataItem.areaSpan || 0;
                // 当前的区域id
                const areaId = dataItem.areaId;
                if (areaItems.value === i) {
                    areaItems = {
                        ...areaItems,
                        name: dataItem?.name,
                        areaSpan: areaSpan,
                    };
                }
                newData = {
                    ...newData,
                    [`title${sectionOption[i]?.value}`]: dataItem.name,
                    [`section${sectionOption[i]?.value}`]: areaSpan,
                };
                if (areaSpan !== 0) {
                    //   非独立区域
                    if (sectionOption[i].value === areaId) {
                        // 把当前选中的区域的结束行和列改为需要合并的行和列
                        gridRowEnd = coordinate[areaSpan].gridRowEnd;
                        gridColumnEnd = coordinate[areaSpan].gridColumnEnd;
                    } else if (areaId < i && i <= areaSpan) {
                        /*
                         * 把区域value大于当前value，但小于等于需要合并区域的value的isShow设为false，把被合并的区域隐藏
                         * 合并区域逻辑判断：
                         * 纵向合并：当前value为奇数时且合并的区域的value也为奇数或当前value为偶数时切且合并的区域的value也为偶数，
                         * 横向合并：若value为奇数时且合并的区域的value为偶数则把大于当前value且小于等于需要合并的区域的value的区域都合并
                         * 通过isShow控制各区域是否显示
                         * */
                        if (areaId % 2 === 0) {
                            // 右侧区域合并右侧区域
                            //  偶数
                            if (i % 2 === 0) {
                                // 合并的区域的value也为偶数
                                isShow = false;
                            }
                        } else {
                            // 奇数
                            if (areaSpan % 2 !== 0) {
                                // 左侧区域合并左侧区域
                                // 选择的区域合并的value值为奇数
                                if (i % 2 !== 0) {
                                    // 只能合并区域的value为奇数的区域，左侧的区域
                                    isShow = false;
                                }
                            } else {
                                // 合并的区域的value为偶数
                                // 左侧区域合并右侧区域
                                isShow = false;
                            }
                        }
                    }
                }
            } else {
                let areaSpan = 0;
                // 初始化已被合并区域
                if (LayoutData?.length) {
                    // 被合并区域初始化
                    isShow = false;
                } else {
                    //   新数据区域，默认只显示区域1
                    if (i !== 1) {
                        isShow = false;
                    } else {
                        areaSpan = 6;
                        gridRowEnd = coordinate[areaSpan].gridRowEnd;
                        gridColumnEnd = coordinate[areaSpan].gridColumnEnd;
                    }
                }
                if (areaItems.value === i) {
                    areaItems = {
                        ...areaItems,
                        areaSpan,
                    };
                }
                newData = {
                    ...newData,
                    [`title${sectionOption[i]?.value}`]: null,
                    [`section${sectionOption[i]?.value}`]: areaSpan,
                };
            }
            areaItems = {
                ...areaItems,
                gridRowEnd: gridRowEnd,
                gridColumnEnd: gridColumnEnd,
                // 设置区域是否展示
                isShow,
            };
            newAreaArr.push({
                ...areaItems,
            });
        }
        setAreaArr(newAreaArr);
        formRef?.setFieldsValue(newData);
        setLoading(false);
    };
    useEffect(() => {
        getDataList();
    }, []);

    const onChangeArea = (value: number, areaIndex: number) => {
        /*
         * value被合并区域
         * areaIndex当前选中区域的value值
         * */
        const newAreaArr: areaItem[] = [...areaArr];
        // 重复区域或旧的合并区域值
        let repeatArea: number = 0;
        let repeatAreaArr: number[] = [];
        // 释放区域的起始点
        let startIndex: number = areaIndex;
        newAreaArr.forEach((item) => {
            if (value !== 0) {
                // 选择非独立区域
                if (item.value === areaIndex) {
                    // 区域id相同
                    if (item?.areaSpan) {
                        // 之前有选择合并的区域，需记录之前合并的区域值
                        repeatArea = item.areaSpan;
                    }
                    item.gridRowEnd = coordinate[value].gridRowEnd;
                    item.gridColumnEnd = coordinate[value].gridColumnEnd;
                    item.areaSpan = value;
                    // 重设区域合并下拉选择框的值
                    formRef?.setFieldValue([`section${item?.value}`], value);
                } else {
                    if (
                        item?.areaSpan &&
                        (item.areaSpan === value ||
                            (item.areaSpan > value && item.value <= value) ||
                            //   被合并区域和当前选中区域的value值奇偶性不一致，一致之前合并的区域在当前合并区域的区间
                            (areaIndex % 2 !== value % 2 && areaIndex < item.areaSpan && value > item.areaSpan))
                    ) {
                        /*
                         *获取
                         * 选择的区域不是之前的已有合并区域的区域
                         * 合并区域重合，需把之前被合并的区域释放出来
                         */
                        if (item.areaSpan > repeatArea) {
                            // 之前的合并区域值大于现值，则更新值
                            repeatArea = item.areaSpan;
                        } else {
                            // 否则用数组存储区域值
                            repeatAreaArr.push(item.areaSpan);
                        }
                        item.gridRowEnd = coordinate[item.value].gridRowEnd;
                        item.gridColumnEnd = coordinate[item.value].gridColumnEnd;
                        // 重设区域合并下拉选择框的值
                        formRef?.setFieldValue([`section${item?.value}`], 0);
                        // 重设释放区域的起始点
                        startIndex = item.value;
                        item.areaSpan = 0;
                        // item.isShow = true;
                    }
                    if (repeatArea > 0 && startIndex < item.value && item.value <= repeatArea) {
                        // 释放被合并的区域,5,2,4,1,2
                        if (repeatAreaArr.includes(item.value)) {
                            item.isShow = true;
                        } else if (areaIndex % 2 === 0) {
                            if (item.value % 2 === value % 2) {
                                // 被合并的区域的value需与当前区域同为奇数或者同为偶数
                                item.isShow = true;
                            }
                        } else {
                            if (item.value % 2 === repeatArea % 2) {
                                // 重复区域或旧的合并区域值repeatArea需与当前区域同为奇数或者同为偶数
                                item.isShow = true;
                            } else if (item.value % 2 === areaIndex % 2) {
                                item.isShow = true;
                            }
                        }
                    }
                    if (areaIndex < item.value && item.value <= value) {
                        if (
                            item?.areaSpan &&
                            ((item?.areaSpan <= value && item.areaSpan % 2 === value % 2) ||
                                item?.value === value)
                        ) {
                            // 合并区域过程中发现被合并的区域之前有合并记录且需同奇数或偶数或者当前合并的区域有之前的合并记录，
                            // 则需重新记录之前合并的区域值，然后释放已被合并的区域
                            repeatArea = item?.areaSpan;
                            item.gridRowEnd = coordinate[item.value].gridRowEnd;
                            item.gridColumnEnd = coordinate[item.value].gridColumnEnd;
                            // 重设区域合并下拉选择框的值
                            formRef?.setFieldValue([`section${item?.value}`], 0);
                            item.areaSpan = 0;
                        }
                        /*
                         * 把区域value大于当前value，但小于等于需要合并区域的value的isShow设为false，把被合并的区域隐藏
                         * 合并区域逻辑判断：
                         * 纵向合并：当前value为奇数时且合并的区域的value也为奇数或当前value为偶数时切且合并的区域的value也为偶数，
                         * 横向合并：若value为奇数时且合并的区域的value为偶数则把大于当前value且小于等于需要合并的区域的value的区域都合并
                         * 通过isShow控制各区域是否显示
                         * */
                        if (areaIndex % 2 === 0) {
                            // 右侧区域合并右侧区域
                            //  偶数
                            if (item.value % 2 === 0) {
                                // 合并的区域的value也为偶数
                                item.isShow = false;
                            }
                        } else {
                            // 奇数
                            if (value % 2 !== 0) {
                                // 左侧区域合并左侧区域
                                // 选择的区域合并的value值为奇数
                                if (item.value % 2 !== 0) {
                                    // 只能合并区域的value为奇数的区域，左侧的区域
                                    item.isShow = false;
                                }
                            } else {
                                // 合并的区域的value为偶数
                                // 左侧区域合并右侧区域
                                item.isShow = false;
                            }
                        }
                    }
                }
            } else {
                //   独立重置相应的区域
                if (item.value === areaIndex) {
                    repeatArea = item?.areaSpan as number;
                    // 恢复原来区域的边界
                    item.gridRowEnd = coordinate[areaIndex].gridRowEnd;
                    item.gridColumnEnd = coordinate[areaIndex].gridColumnEnd;
                    item.areaSpan = value;
                } else if (repeatArea > 0 && areaIndex < item.value && item.value <= repeatArea) {
                    if (areaIndex % 2 === 0) {
                        // 右侧区域释放右侧区域
                        if (item.value % 2 === 0) {
                            item.isShow = true;
                        }
                    } else {
                        // 奇数
                        if (repeatArea % 2 !== 0) {
                            // 左侧区域释放左侧区域
                            // 选择的区域合并的value值为奇数
                            if (item.value % 2 !== 0) {
                                // 只能释放区域的value为奇数的区域，左侧的区域
                                item.isShow = true;
                            }
                        } else {
                            // 被合并的区域的value为偶数
                            // 左侧区域释放被合并的右侧区域
                            item.isShow = true;
                        }
                    }
                }
            }
        });
        setAreaArr(newAreaArr);
    };

    const onSave = async () => {
        await formRef?.validateFields().then(async () => {
            setLoading(true);
            let params: API.FormAreasItem[] = [];
            areaArr.forEach((item) => {
                if (item.isShow) {
                    params.push({
                        areaId: item.value,
                        areaSpan: item.areaSpan as number,
                        name: item?.name as string,
                    });
                }
            });
            console.log(params, '----params---');
            setDataSource(params);
            message.success('布局设置成功');
            setLoading(false);
        });
    };

    const onChangeTitle = (data: string, value: number) => {
        if (data) {
            areaArr.forEach((item) => {
                if (item.value === value) {
                    item.name = data;
                }
            });
            formRef?.setFieldValue([`title${value}`], data);
        }
    };

    return (
        <ProCard style={{ height: 650, width: '100%' }}>
            <Spin spinning={loading}>
                <div className={'regionalLayout'}>
                    {areaArr.map((item) => {
                        if (item.isShow) {
                            return (
                                <div
                                    key={item?.value}
                                    style={{
                                        gridRowStart: item.gridRowStart,
                                        gridColumnStart: item.gridColumnStart,
                                        gridRowEnd: item.gridRowEnd,
                                        gridColumnEnd: item.gridColumnEnd,
                                    }}
                                >
                                    <ProCard title={item.label} bordered style={{ height: '100%' }}>
                                        <ProForm
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 12 }}
                                            layout="horizontal"
                                            form={formRef}
                                            submitter={false}
                                            style={{ width: 600 }}
                                            colon={false}
                                        >
                                            <ProFormText
                                                name={`title${item?.value}`}
                                                label="标题"
                                                placeholder="请输入标题"
                                                fieldProps={{
                                                    onChange: (e) => onChangeTitle(e.target.value, item.value),
                                                    allowClear: false,
                                                }}
                                            />
                                            {item.sectionOptions && item.sectionOptions?.length > 0 && (
                                                <ProFormSelect
                                                    name={`section${item?.value}`}
                                                    label={'区域合并'}
                                                    request={async () => {
                                                        return options.filter(
                                                            (item2) => item.sectionOptions?.includes(item2.value) && item2,
                                                        );
                                                    }}
                                                    fieldProps={{
                                                        onChange: (value) => onChangeArea(value as number, item.value),
                                                        allowClear: false,
                                                    }}
                                                />
                                            )}
                                        </ProForm>
                                    </ProCard>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}
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

export default Layout;