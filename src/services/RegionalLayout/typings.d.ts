declare namespace API {
    // 布局信息
    interface LayoutFormAreas {
        id?: number;
        areaId: number;
        areaSpan?: number;
        name: string;
    }
    // 字段（属性）信息
    interface LayoutFieldsItem {
        areaId: number;
        // id值
        id: number;
        // 字段code
        fieldCode: string;
        // 表code
        tableCode: string;
        // 描述
        name?: string;
    }
    interface LayoutTableItem {
        tableDesc?: string;
        tableName?: string;
        fields?: LayoutTableItem[];
        fieldDesc?: string;
        fieldName?: string;
    }

    interface FormAreasItem {
        areaId: number;
        areaSpan: number;
        name: string;
    };
}