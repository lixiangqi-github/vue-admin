import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// Vue.use(ElementUI);
// Vue.use(VueCompositionApi);

// VueElement.config.productionTip = false;
const app = createApp(App);
app.use(ElementPlus);

app.use(store).use(router).mount('#app')
