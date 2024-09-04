type optionsItem = {
  value: number;
  label: React.ReactNode;
};

type coordinateItem = {
  // 指定在哪一行开始显示网格元素。
  gridRowStart: number;
  // 指定在哪一列开始显示网格元素。
  gridColumnStart: number;
  // 指定哪一行停止显示网格元素。
  gridRowEnd: number;
  // 指定哪一列停止显示网格元素。
  gridColumnEnd: number;
};

// 区域合并下拉选择框
export const getOptions = (): optionsItem[] => {
  return [
    {
      value: 0,
      label: '独立的',
    },
    {
      value: 1,
      label: '区域1',
    },
    {
      value: 2,
      label: '区域2',
    },
    {
      value: 3,
      label: '区域3',
    },
    {
      value: 4,
      label: '区域4',
    },
    {
      value: 5,
      label: '区域5',
    },
    {
      value: 6,
      label: '区域6',
    },
  ];
};

// 区域定位
export const coordinate: {
  [key in number]: coordinateItem;
} = {
  1: {
    // 第一行第一列
    gridRowStart: 1,
    gridColumnStart: 1,
    gridRowEnd: 2,
    gridColumnEnd: 2,
  },
  2: {
    // 第一行第二列
    gridRowStart: 1,
    gridColumnStart: 2,
    gridRowEnd: 2,
    gridColumnEnd: 3,
  },
  3: {
    // 第二行第一列
    gridRowStart: 2,
    gridColumnStart: 1,
    gridRowEnd: 3,
    gridColumnEnd: 2,
  },
  4: {
    // 第二行第二列
    gridRowStart: 2,
    gridColumnStart: 2,
    gridRowEnd: 3,
    gridColumnEnd: 3,
  },
  5: {
    // 第三行第一列
    gridRowStart: 3,
    gridColumnStart: 1,
    gridRowEnd: 4,
    gridColumnEnd: 2,
  },
  6: {
    // 第三行第二列
    gridRowStart: 3,
    gridColumnStart: 2,
    gridRowEnd: 4,
    gridColumnEnd: 3,
  },
};

export const TreeData = [
  {
    fields: [
      {
        fieldDesc: '测试1',
        fieldName: 'test1',
      },
      {
        fieldDesc: '测试2',
        fieldName: 'test2',
      },
      {
        fieldDesc: '测试3',
        fieldName: 'test3',
      },
      {
        fieldDesc: '测试4',
        fieldName: 'test4',
      },
      {
        fieldDesc: '测试5',
        fieldName: 'test5',
      },
      {
        fieldDesc: '测试6',
        fieldName: 'test6',
      },
      {
        fieldDesc: '测试7',
        fieldName: 'test7',
      },
      {
        fieldDesc: '测试8',
        fieldName: 'test8',
      },
      {
        fieldDesc: '测试9',
        fieldName: 'test9',
      },
      {
        fieldDesc: '测试10',
        fieldName: 'test10',
      },
      {
        fieldDesc: '测试11',
        fieldName: 'test11',
      },
      {
        fieldDesc: '测试12',
        fieldName: 'test12',
      },
      {
        fieldDesc: '测试13',
        fieldName: 'test13',
      },
      {
        fieldDesc: '测试14',
        fieldName: 'test14',
      },
      {
        fieldDesc: '测试15',
        fieldName: 'test15',
      },
      {
        fieldDesc: '测试16',
        fieldName: 'test16',
      },
    ],
    tableDesc: '数据表1',
    tableName: 'table1',
  }
];

export const FieldsData:API.LayoutFieldsItem[] = [
  {
    areaId: 1,
    id: 1,
    tableCode: "table1",
    fieldCode: "test1",
    name: '测试1'
  },
  {
    areaId: 1,
    id: 2,
    tableCode: "table1",
    fieldCode: "test2",
    name: '测试2'
  },
  {
    areaId: 1,
    id: 3,
    tableCode: "table1",
    fieldCode: "test3",
    name: '测试3'
  },
  {
    areaId: 2,
    id: 4,
    tableCode: "table1",
    fieldCode: "test4",
    name: '测试4'
  },
  {
    areaId: 2,
    id: 5,
    tableCode: "table1",
    fieldCode: "test5",
    name: '测试5'
  },
  {
    areaId: 3,
    id: 6,
    tableCode: "table1",
    fieldCode: "test6",
    name: '测试6'
  },
  {
    areaId: 3,
    id: 7,
    tableCode: "table1",
    fieldCode: "test7",
    name: '测试7'
  },
  {
    areaId: 4,
    id: 8,
    tableCode: "table1",
    fieldCode: "test8",
    name: '测试8'
  },
  {
    areaId: 5,
    id: 9,
    tableCode: "table1",
    fieldCode: "test9",
    name: '测试9'
  },
  {
    areaId: 5,
    id: 10,
    tableCode: "table1",
    fieldCode: "test10",
    name: '测试10'
  },
  {
    areaId: 6,
    id: 11,
    tableCode: "table1",
    fieldCode: "test11",
    name: '测试11'
  },
  {
    areaId: 6,
    id: 12,
    tableCode: "table1",
    fieldCode: "test12",
    name: '测试12'
  },
];

export const LayoutData = [
  {
    areaId: 1,
    areaSpan: 0,
    name: '测试1',
  },
  {
    areaId: 2,
    areaSpan: 0,
    name: '测试2',
  },
  {
    areaId: 3,
    areaSpan: 0,
    name: '测试3',
  },
  {
    areaId: 4,
    areaSpan: 0,
    name: '测试4',
  },
  {
    areaId: 5,
    areaSpan: 0,
    name: '测试5',
  },
  {
    areaId: 6,
    areaSpan: 0,
    name: '测试6',
  }
];

