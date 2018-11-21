<template>
  <ex-view>
    <ex-header title="选择维修点">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title></ex-title>
    </ex-header>

    <ex-content>
      <div class="list">
        <div class="item"><div class="text text-sm">cool</div></div>
        <div class="item"><div class="text">cool</div></div>
      </div>
    </ex-content>

    <!-- @DONE 点击下一步的时候进行多余数据的过滤 -->
    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="nextStep();">下一步</button>
    </ex-footer>
  </ex-view>
</template>
<script>
// @DONE 为什么number需要set而active不用，set之后还要继续set么 => set之后就完成了数据的监听
import axios from 'axios';
import HOSTS from '../../../env.config';
import { mapState } from 'vuex';
import NP from 'number-precision';
export default {
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {},
};
</script>
<style lang="less" scoped>
@import '../../../less/base/variable/color.less';
</style>
