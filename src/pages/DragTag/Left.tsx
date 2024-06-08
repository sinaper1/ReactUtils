import React from 'react';
import { Tag } from 'antd';
import { useDrag } from 'react-dnd';


const Left = () => {
    // 示例数据
    const dataSource = [
        {
            key: 1,
            title: '苹果',
        },
        {
            key: 2,
            title: '梨',
        },
        {
            key: 3,
            title: '芒果',
        },
        {
            key: 4,
            title: '波罗蜜',
        },
        {
            key: 5,
            title: '荔枝',
        },
        {
            key: 6,
            title: '龙眼',
        },
        {
            key: 7,
            title: '香蕉',
        },
        {
            key: 8,
            title: '榴莲',
        },
    ];
    const TagItem = ({ tag, draggable }: any) => {
        //实现拖拽
        const [, drag] = useDrag({
            type: 'LeftTag',
            item: () => {
                // 使用时间戳来定义id值，避免移动后的数据的id值相同
                return { ...tag, id: new Date().getTime() };
            },
            collect: (monitor: any) => ({
                isDragging: monitor.isDragging(),
            }),
            canDrag: () => {
                return draggable;
            },
        });
        return (
            <Tag
                ref={drag}
                className={'formula-left-constant-tag-item'}
            >
                {tag.title}
            </Tag>
        );
    };
    return(
        <div className={'left'}>
            {
                dataSource?.map(item=><TagItem key={item.key} tag={item} draggable="true" />)
            }
        </div>
    )
}

export default Left;