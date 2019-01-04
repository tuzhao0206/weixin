<template>
  <ex-view>
    <ex-header title="选择维修点">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content v-if="!loading">
      <div class="list">
        <div class="item">
          <div class="text text-sm">Step2: 请选择维修点</div>
        </div>
        <div class="item">
          <ex-space space="10px 0">
            <div class="notice text-sm">注意：维修产品需寄往对应网点地址进行维修，请勿寄往其他维修点。</div>
          </ex-space>
        </div>
        <div class="item text-sm" @click="openPicker">
          <div class="text">
            <i class="text-warning">*</i>
            <span>维修网点</span>
          </div>
          <div class="extra">
            <span v-if="station">{{station.name}}</span>
            <span v-else class="text-gray">选择</span>
          </div>
          <i class="icon text-gray">&#xe61a;</i>
        </div>
      </div>

      <div class="list" v-if="station">
        <div class="item text-sm">
          <div class="text">
            <ex-space space="10px 0">
              <p>请将维修机器寄往以下地址：</p>
              <div class="details" v-html="$options.filters.rmstyle(station.note)"></div>
            </ex-space>
          </div>
        </div>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="next();">下一步</button>
    </ex-footer>

    <ex-picker
      :title="'选择维修网点'"
      :show="picker"
      :groups="[stations]"
      :dismiss="onCancel"
      :onCancel="onCancel"
      :onConfirm="onConfirm"
    />
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../env.config';
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      station: this.$store.state.repair.station,
      stations: [],
      picker: false,
      loading: true,
    };
  },
  mounted() {
    const url = `${HOSTS.REPAIR}/api/repairSite/siteList`;
    const params = { countryCode: 'CN' };
    axios.get(url, { params, cache: true }).then(({ data }) => {
      this.stations = data;
      this.loading = false;
    });
  },
  methods: {
    ...mapActions('repair', ['setStation']),
    openPicker() {
      this.picker = true;
    },
    onCancel() {
      this.picker = false;
    },
    onConfirm({ checked }) {
      this.picker = false;
      this.station = this.stations[checked[0]];
    },
    next() {
      // 校验
      if (!this.station) {
        return this.$message('请选择维修点');
      }
      // 缓存数据
      this.setStation({ station: this.station });
      // 填写物流
      this.$router.push({ path: this.$prelang('repair/express') });
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../less/base/fn.less';
.notice {
  position: relative;
  font-size: 14px;
  padding: 10px 15px;
  border-radius: 4px;
  color: @orange;
  background-color: #fff5e5;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 15px;
    height: 15px;
    transform: translate(-50%, -50%) rotate(45deg);
    border-radius: 3px;
    background-color: #fff5e5;
  }
}

.details {
  border: 1px solid @borderColor;
  border-radius: 4px;
  margin-top: 10px;
  padding: 15px 10px;
}
</style>
