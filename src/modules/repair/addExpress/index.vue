<!-- @TODO 样式同一化 -->
<template>
  <ex-view>
    <ex-header title="选择维修点">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title></ex-title>
    </ex-header>

    <ex-content>
      <div class="list">
        <div class="item"><div class="text">Step2: 请选择维修点</div></div>
        <div class="item"><div class="text">注意：维修产品需寄往对应网点地址进行维修，请勿寄往其他维修点。</div></div>
        <div class="item"><div class="text">选择维修网点</div></div>
      </div>

      <div class="list">
        <div class="item">
          <div class="text">
            <p>请将维修机器寄往以下地址：</p>
            <div class="locationDetail" v-html="locationList[0].note"></div>
          </div>
        </div>
      </div>
    </ex-content>

    <!-- @DONE 点击下一步的时候进行多余数据的过滤 -->
    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="nextStep();">下一步</button>
    </ex-footer>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../../env.config';
export default {
  data() {
    return {
      locationList: [],
    };
  },
  mounted() {
    const url = `${HOSTS.REPAIR}/api/repairSite/siteList`;
    let that = this;
    axios.get(url).then(({ data }) => {
      this.locationList = data;
    });
  },
  computed: {},
  methods: {},
};
</script>
<style lang="less" scoped>
@import '../../../less/base/variable/color.less';
div.locationDetail {
  border: 1px solid @gray;
  padding: 18px 10px;
}
</style>
