import { defineConfig } from '@umijs/max';
import routes from "./routes";

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
    antd: {},
    access: {},
    model: {},
    initialState: {},
    request: {},
    layout: {
        title: '组件库',
        locale: false,
    },
    favicons: [
        //  图标的 meta 头标签
        '/image/avatar.svg',
    ],
    publicPath: isDev
        ? '/'
        : 'https://static.kinglebronjames.club/static/component/dist/', // CDN地址
    routes: routes,
    npmClient: 'pnpm',
    hash: true,
    jsMinifier: 'esbuild',
    outputPath: 'dist',
});
