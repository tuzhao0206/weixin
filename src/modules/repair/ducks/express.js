import dispatch from '../../../utils/dispatch';

export default {
  namespaced: true,
  state: {
    expressObj: {},
  },
  mutations: {
    changeExpressObj(state, payload) {
      state.expressObj = payload.expressObj;
    },
  },
  actions: {
    changeExpressObj: dispatch('changeExpressObj'),
  },
};
