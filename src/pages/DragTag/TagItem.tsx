import React, { useRef } from 'react';
import { Tag } from 'antd';
import {DragSourceMonitor, useDrag, useDrop} from 'react-dnd';

type ListItem = {
    key: number;
    title: string;
    id: number;
}

type TagItemProps = {
    tag: any;
    index: number;
    moveTag: (dragIndex: number, hoverIndex: number, item: ListItem) => void;
}

const TagItem: React.FC<TagItemProps> = (props) => {
    const {tag, index, moveTag} = props;
    const ref = useRef<HTMLDivElement>(null);
    //实现拖拽
    const [, drag] = useDrag({
        type: 'RightTag',
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
        // item 中包含 index 属性，则在 drop 组件 hover 和 drop 是可以根据第一个参数获取到 index 值
        item: { ...tag, index },
    });
    const [, drop] = useDrop({
        // 指明该区域允许接收的拖放物。可以是单个，也可以是数组里面的值就是useDrag所定义的type
        accept: ['LeftTag', 'RightTag'],
        drop: (item: any) => {
            if (!ref.current) return;
            let dragIndex = item.index;
            let hoverIndex = index;
            // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
            if (dragIndex === hoverIndex) {
                return;
            }
            // 执行 move 回调函数
            moveTag(dragIndex, hoverIndex, item);
            item.index = hoverIndex;
            return item;
        },
    });
    drag(drop(ref));
    return (
        <Tag
            ref={ref}
        >
            {tag.title}
        </Tag>
    );
};

export default TagItem;