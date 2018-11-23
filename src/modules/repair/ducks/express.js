import dispatch from '../../../utils/dispatch';

export default {
  namespaced: true,
  state: {
    expressObj: {},
    expressCode: '',
  },
  mutations: {
    changeExpressObj(state, payload) {
      state.expressObj = payload.expressObj;
    },
    changeExpressCode(state, payload) {
      state.expressCode = payload.expressCode;
    },
  },
  actions: {
    changeExpressObj: dispatch('changeExpressObj'),
    changeExpressCode: dispatch('changeExpressCode'),
  },
};
