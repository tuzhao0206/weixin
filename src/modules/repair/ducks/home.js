import dispatch from '../../../utils/dispatch';

export default {
  namespaced: true,
  state: {
    index: 0,
    productData: [],
  },
  mutations: {
    setIndex(state, { index }) {
      state.index = index;
    },
    changeProductData(state, payload) {
      state.productData = payload.productData;
    },
  },
  actions: {
    // home
    setIndex: dispatch('setIndex'),
    changeProductData: dispatch('changeProductData'),
  },
};
