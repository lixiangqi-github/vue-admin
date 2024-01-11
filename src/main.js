import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import SvgIcon from '@/icons/SvgIcon'// svg component
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 自定义全局组件
import "./icons";
// Vue.use(ElementUI);
// Vue.use(VueCompositionApi);

// VueElement.config.productionTip = false;
const app = createApp(App);
app.use(ElementPlus);
app.component('svg-icon', SvgIcon);

app.use(store).use(router).mount('#app')
