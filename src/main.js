import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import SvgIcon from '@/icons/SvgIcon'// svg component
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "./router/premit";

// 全局方法引入
import global from './utils/global_V3.0';
// 自定义全局组件
import "./icons";
// Vue.use(ElementUI);
// Vue.use(VueCompositionApi);

// VueElement.config.productionTip = false;
const app = createApp(App);
app.use(ElementPlus);
app.component('svg-icon', SvgIcon);
app.provide('global', global) // 将global方法挂载到全局

app.use(store).use(router).mount('#app')
