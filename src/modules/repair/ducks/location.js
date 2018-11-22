import dispatch from '../../../utils/dispatch';

export default {
  namespaced: true,
  state: {
    location: {},
  },
  mutations: {
    changeLocation(state, payload) {
      state.location = payload.location;
    },
  },
  actions: {
    changeLocation: dispatch('changeLocation'),
  },
};
