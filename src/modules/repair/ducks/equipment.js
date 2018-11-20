import dispatch from '../../../utils/dispatch';

export default {
  namespaced: true,
  state: {
    productData: [],
  },
  mutations: {
    changeProductData(state, payload) {
      state.productData = payload.productData;
    },
  },
  actions: {
    changeProductData: dispatch('changeProductData'),
  },
};
