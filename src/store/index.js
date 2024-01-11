import { createStore } from 'vuex'

export default createStore({
  state: {
    isCollapse: false,
  },
  getters: {
    isCollapse: state => state.isCollapse
  },
  mutations: {
    SET_COLLAPSE(state) {
      state.isCollapse = !state.isCollapse;
      sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
    },
  },
  actions: {
  },
  modules: {
  }
})
