import dispatch from '../../../utils/dispatch';

export default {
  namespaced: true,
  state: {
    expressObj: {},
    code: '',
  },
  mutations: {
    changeExpressObj(state, payload) {
      state.expressObj = payload.expressObj;
    },
    changeCode(state, payload) {
      state.code = payload.code;
    },
  },
  actions: {
    changeExpressObj: dispatch('changeExpressObj'),
    changeCode: dispatch('changeCode'),
  },
};
