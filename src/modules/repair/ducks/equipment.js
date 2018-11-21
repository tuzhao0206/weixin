import dispatch from '../../../utils/dispatch';

export default {
  namespaced: true,
  state: {
    productData: [],
    submitData: [],
    type: '',
  },
  mutations: {
    changeProductData(state, payload) {
      state.productData = payload.productData;
    },
    changeSubmitData(state, payload) {
      state.submitData = payload.submitData;
    },
    changeType(state, payload) {
      state.type = payload.type;
    },
  },
  actions: {
    changeProductData: dispatch('changeProductData'),
    changeSubmitData: dispatch('changeSubmitData'),
    changeType: dispatch('changeType'),
  },
};
