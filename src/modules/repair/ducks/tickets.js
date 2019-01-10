// 目录起名为ducks是沿用了redux的习惯
// https://github.com/erikras/ducks-modular-redux
import dispatch from '../../../utils/dispatch';

export default {
  namespaced: true,
  state: {
    list: [], // 配件列表
  },
  mutations: {
    setTickets(state, { list }) {
      state.list = list;
    },
  },
  actions: {
    setTickets: dispatch('setTickets'),
  },
};
