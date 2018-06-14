import Vue from 'vue';
import Vuex from 'vuex';

import customers from "./modules/customers";
import lots from "./modules/lots";
import store from "./modules/store";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: true
  },
  getters: {
    isVisible: (state) => {
      return state.drawer
    }
  },
  mutations: {
    toogleSidebar: (state) => state.drawer = !state.drawer
  },
  modules: {
    customers,
    lots,
    store
  }
});