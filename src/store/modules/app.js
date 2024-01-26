import { Login, Logout } from "@/api/login";
import { setToken, setUserName, getUserName, removeUserName, removeToken } from "@/utils/app";
// import cookie from "cookie_js";


const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    to_ken: '',
    // username: cookie.get('username') || '',
    username: getUserName() || '',
}
const getters = {
    isCollapse: state => state.isCollapse,
}
const mutations = {
    SET_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse;
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
        // Cookie.set('isCollapse', JSON.stringify(state.isCollapse));
    },
    SET_TOKEN(state, value) {
        state.to_ken = value;
    },
    SET_USERNAME(state, value) {
        state.username = value;
    },
}
const actions = {
    login(content, requestData) {
        return new Promise((resolve, reject) => {
            //接口
            Login(requestData).then((response) => {
                let data = response.data;
                content.commit('SET_TOKEN', data.token);
                content.commit('SET_USERNAME', data.username);
                setToken(data.token);
                setUserName(data.username);
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        })
    },
    logout(context) {
        return new Promise((resolve, reject) => {
            removeUserName();
            removeToken();
            context.commit("SET_TOKEN", "");
            context.commit("SET_USERNAME", "");
            resolve();
        });
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};