import React, { useState } from 'react';
import {useDrop} from 'react-dnd';
import TagItem from './TagItem';

type ListItem = {
    key: number;
    title: string;
    id: number;
}

const Right = () => {
    // const ref = useRef<HTMLDivElement>(null);
    const [dataList, setDataList] = useState<ListItem[]>([]);
    const [, dropRef] = useDrop({
        // 指明该区域允许接收的拖放物。可以是单个，也可以是数组里面的值就是useDrag所定义的type
        accept: ['LeftTag'],
        drop: (item: ListItem) => {
            if (item) {
                setDataList((data: ListItem[])=>{
                    // 判断现有的数据源是否有id值相同的数据，若有则不做处理，若无则把数据插入到数组尾部
                    const hasIndex = data.findIndex((v: ListItem) => v.id === item?.id);
                    if(hasIndex === -1){
                        return [...data, item] as ListItem[];
                    }
                    return [...data] as ListItem[];
                })
            }
            return item;
        },
    });
    const moveTag = (dragIndex: number, hoverIndex: number, item: ListItem) => {
        /**
         * 1、如果dragIndex 为 undefined，则此时为新增的元素，则此时修改 dataList 中的占位元素的位置即可
         * 2、如果此时dragIndex 不为 undefined，则此时为拖拽现有的元素，此时替换 dragIndex 和 hoverIndex 位置的元素即可
         */
        console.log(dragIndex, hoverIndex, item, '---item---');
        if (dragIndex !== undefined) {
            // 拖动元素
            let data = [...dataList];
            let temp = data[dragIndex];
            data.splice(dragIndex, 1);
            data.splice(hoverIndex, 0, temp);
            setDataList(data);
        } else {
            // 新增元素，如果是函数需要额外加上参数
            let data = [...dataList];
            data.splice(hoverIndex, 0, item);
            setDataList(data);
        }
    };
    return (
        <div className={'right'} ref={dropRef}>
            {
                dataList?.map((item, index)=><TagItem key={item.id} tag={item} index={index} moveTag={moveTag}/>)
            }
        </div>
    )
}

export default Right;
