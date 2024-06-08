import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '一次性输入框',
      path: 'otpInput',
      component: './OtpInput',
    },
    {
      name: '标签拖拽',
      path: 'dragTag',
      component: './DragTag',
    },
  ],
  npmClient: 'pnpm',
});
