// 符号
export const FormulaSymbol: API.FormulaConstantItem[] = [
  {
    code: '+',
    title: '+',
  },
  {
    code: '-',
    title: '-',
  },
  {
    code: '*',
    title: '*',
  },
  {
    code: '/',
    title: '/',
  },
  {
    code: '%',
    title: '%',
  },
  {
    code: '(',
    title: '(',
  },
  {
    code: ')',
    title: ')',
  },
  {
    code: '>',
    title: '>',
  },
  {
    code: '>=',
    title: '>=',
  },
  {
    code: '<',
    title: '<',
  },
  {
    code: '<=',
    title: '<=',
  },
  {
    code: '==',
    title: '==',
  },
  {
    code: '!=',
    title: '!=',
  },
  {
    code: '&&',
    title: '并且',
  },
  {
    code: '||',
    title: '或者',
  },
];

// 字段
export const FormulaField: API.FormulaConstantItem[] = [
  {
    code: 'EmployeeInfo',
    title: '员工信息',
    children: [
      {
        code: 'BasicInfo',
        title:'员工基本信息',
        children: [
          {
            code: 'ResignationDate',
            title: '离职日期',
          },
          {
            code: 'DisableCode',
            title: '残疾证号',
          },
          {
            code: 'CompanyEmail',
            title: '公司邮箱',
          },
          {
            code: 'CompanyName',
            title: '公司名称',
          },
          {
            code: 'ConversionDate',
            title: '转正日期',
          },
          {
            code: 'BirthDate',
            title: '出生日期',
          },
          {
            code: 'DepartmentName',
            title: '部门名称',
          },
          {
            code: 'EmployeeNumber',
            title: '员工编号',
          }
        ]
      },
      {
        code: 'CustomFields',
        title: '员工自定义字段',
        children: [
          {
            code: 'city',
            title: '城市',
          },
          {
            code: 'country',
            title: '国家',
          },
        ],
      },
    ],
  }
];

// 常量
export const FormulaConstant: API.FormulaConstantItem[] = [
  {
    code: '{{FIRSTOFMONTH}}',
    title: '本月第一天'
  },
  {
    code: '{{LASTOFWEEK}}',
    title: '本周最后一天'
  },
  {
    code: '{{LASTOFYEAR}}',
    title: '本年最后一天',
  },
  {
    code: '{{TODAY}}',
    title: '今天',
  }
];

// 函数
export const FormulaFunc: API.FormulaConstantItem[] = [
  {
    code: 'Date',
    title: '日期',
    children: [
      {
        code: 'AddDays',
        title: '将指定的天数加到目标日期上',
        parameters: [
          {
            code: 'TargetDate',
            title: '目标日期',
          },
          {
            code: 'Days',
            title: '指定的天数',
          }
        ],
      },
      {
        code: 'AddMonths',
        title: '将指定的月数加到目标日期上',
        parameters: [
          {
            code: 'TargetDate',
            title: '目标日期',
          },
          {
            code: 'months',
            title: '指定的月数',
          }
        ],
      },
      {
        code: 'AddYears',
        title: '将指定的年数加到目标日期上',
        parameters: [
          {
            code: 'TargetDate',
            title: '目标日期'
          },
          {
            code: 'Years',
            title: '指定的年数'
          }
        ],
      },
    ]
  },
]
