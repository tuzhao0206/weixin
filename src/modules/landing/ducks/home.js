import dispatch from '../../../utils/dispatch';

export default {
  namespaced: true,
  state: {
    index: 0,
  },
  mutations: {
    setIndex(state, { index }) {
      state.index = index;
    },
  },
  actions: {
    // home
    setIndex: dispatch('setIndex'),
  },
};
