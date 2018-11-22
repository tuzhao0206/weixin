// 目录起名为ducks是沿用了redux的习惯
// https://github.com/erikras/ducks-modular-redux
import home from './home';
import equipment from './equipment';
import location from './location';
import express from './express';

export default {
  namespaced: true,
  modules: { home, equipment, location, express },
};
