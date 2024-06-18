declare namespace API {
    interface FormulaFieldItem {
        title?: string;
        value?: string;
        type?: string;
        // 用于判断函数左括号
        offset?: boolean;
    }
    interface FormulaConstantItem {
        code: string;
        title: string;
        children?: FormulaConstantItem[],
        parameters?: FormulaConstantItem[],
    }
    interface FormulaValueType {
        type: string;
        value: string;
        title: string;
    }
}