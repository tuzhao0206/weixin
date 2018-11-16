import Vue from 'vue';
import Vuex from 'vuex';
import { modules } from './schema';
import dispatch from './utils/dispatch';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: modules,
  plugins: process.env.NODE_ENV !== 'production' ? [require('vuex/dist/logger')()] : [],
  state: {
    title: 'BITMAIN',
    lang: 'en',
    site: 'en',
    ready: false,
    token: null,
    user: null,
    toast: {},
    modal: {},
    sheet: {},
    cartCount: 0,
  },
  mutations: {
    setSite(state, { lang, site }) {
      state.lang = lang;
      state.site = site;
    },
    setTitle(state, { title }) {
      if (title && state.title !== title) {
        state.title = title;
        document.title = title;
      }
    },
    fetchToken(state, { token }) {
      state.token = token;
    },
    fetchUser(state, { user }) {
      state.ready = true;
      state.user = user;
    },
    removeUser(state) {
      state.user = null;
    },
    cartCount(state, { count }) {
      state.cartCount = count;
    },
    showToast(state, { toast }) {
      clearTimeout(this.toastTimer);
      state.toast = { ...toast, show: true };
    },
    hideToast(state) {
      clearTimeout(this.toastTimer);
      state.toast = { ...state.toast, show: false };
    },
    tipsToast(state, { toast }) {
      state.toast = { ...toast, show: true };
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        store.dispatch('hideToast');
      }, toast.mills || 3000);
    },
    showModal(state, { modal }) {
      state.modal = { ...modal, show: true };
    },
    hideModal(state) {
      state.modal = { ...state.modal, show: false };
    },
    showSheet(state, { sheet }) {
      state.sheet = { ...sheet, show: true };
    },
    hideSheet(state) {
      state.sheet = { ...state.sheet, show: false };
    },
  },
  actions: {
    setSite: dispatch('setSite'),
    setTitle: dispatch('setTitle'),
    fetchToken: dispatch('fetchToken'),
    fetchUser: dispatch('fetchUser'),
    removeUser: dispatch('removeUser'),
    showToast: dispatch('showToast'),
    hideToast: dispatch('hideToast'),
    tipsToast: dispatch('tipsToast'),
    showModal: dispatch('showModal'),
    hideModal: dispatch('hideModal'),
    showSheet: dispatch('showSheet'),
    hideSheet: dispatch('hideSheet'),
    cartCount: dispatch('cartCount'),
  },
});

export default store;
