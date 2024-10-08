export default [
    {
        path: '/',
        redirect: '/otpInput',
    },
    {
        name: '一次性输入框',
        path: '/otpInput',
        component: './OtpInput',
    },
    {
        name: '标签拖拽',
        path: '/dragTag',
        component: './DragTag',
    },
    {
        name: '公式编辑器',
        path: '/formulaEditor',
        component: './FormulaEditor',
    },
    {
        name: '区域布局',
        path: '/regionalLayout',
        component: './RegionalLayout',
    },
]