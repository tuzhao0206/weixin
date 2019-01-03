// 目录起名为ducks是沿用了redux的习惯
// https://github.com/erikras/ducks-modular-redux
import dispatch from '../../../utils/dispatch';

export default {
  namespaced: true,
  state: {
    selected: [], // 配件列表
    station: null, // 维修站点
    express: null, // 物流信息
    tracking: '', // 运单号码
  },
  mutations: {
    setSelected(state, { selected }) {
      state.selected = selected;
    },
    setStation(state, { station }) {
      state.station = station;
    },
    setExpress(state, { express, tracking }) {
      state.express = express;
      state.tracking = tracking;
    },
  },
  actions: {
    setSelected: dispatch('setSelected'),
    setStation: dispatch('setStation'),
    setExpress: dispatch('setExpress'),
  },
};
