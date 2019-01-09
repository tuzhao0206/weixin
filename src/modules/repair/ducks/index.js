// 目录起名为ducks是沿用了redux的习惯
// https://github.com/erikras/ducks-modular-redux
import dispatch from '../../../utils/dispatch';
import orders from './orders';

export default {
  namespaced: true,
  modules: { orders },
  state: {
    type: 0, // 工单类型
    ticketId: null, // 工单编号
    selected: [], // 配件列表
    station: null, // 维修站点
    express: null, // 物流信息
    tracking: '', // 运单号码
    address: null, // 回寄地址
    channel: null, // 回寄物流
  },
  mutations: {
    setBasis(state, { ticketType, ticketId }) {
      state.type = ticketType;
      state.ticketId = ticketId;
    },
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
    setAddress(state, { address }) {
      state.address = address;
    },
    setChannel(state, { channel }) {
      state.channel = channel;
    },
  },
  actions: {
    setBasis: dispatch('setBasis'),
    setSelected: dispatch('setSelected'),
    setStation: dispatch('setStation'),
    setExpress: dispatch('setExpress'),
    setAddress: dispatch('setAddress'),
    setChannel: dispatch('setChannel'),
  },
};
