import React, { useState } from 'react';
import { ProCard, PageContainer } from '@ant-design/pro-components';
import Field from './Tabs/Fields';
import Layout from './Tabs/Layout';

const AddEdit: React.FC = () => {
    const [tab, setTab] = useState<string>('layout');
    const [dataSource, setDataSource] = useState<API.FormAreasItem[]>([])
    const onChangeTab = (key: string) => {
        setTab(key);
    };
    const itemList = [
        {
            label: '布局设置',
            key: 'layout',
            children: <Layout setDataSource={setDataSource}/>,
        },
        {
            label: '字段设置',
            key: 'fields',
            children: <Field dataSource={dataSource}/>,
        },
    ];

    return (
        <PageContainer>
            <ProCard
                tabs={{
                    tabPosition: 'top',
                    activeKey: tab,
                    destroyInactiveTabPane: true,
                    items: itemList,
                    onChange: onChangeTab,
                }}
            />
        </PageContainer>
    );
};

export default AddEdit;
