import router from "./index";
import { getToken, removeToken, removeUserName } from "@/utils/app";
import { useStore } from 'vuex';

const whiteRouter = ['/login'];

// 路由守卫
router.beforeEach((to, from, next) => {
    const store = useStore();
    if (getToken()) {   // Token存在
        if (to.path === '/login') {
            removeToken();
            removeUserName();
            store.commit("app/SET_TOKEN", "");
            store.commit("app/SET_USERNAME", "");
            next();
        } else {
            next();
        }
    } else {        // Token不存在
        if (whiteRouter.indexOf(to.path) !== -1) {  // 存在
            next();
        } else {                                    // 不存在
            next('/login');
        }
    }
    /**
         * 1、直接进入index的时候，参数to被改变成了 "/index"，触发路由指向，就会跑beforeEach
         * 2、再一次 next 指向了login，再次发生路由指向，再跑beforeEach，参数的to被改变成了"/login"
         * 3、白名单判断存在，则直接执行next()，因为没有参数，所以不会再次beforeEach。
         */
})