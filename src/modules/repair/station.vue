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
          <div class="text text-sm">请选择维修点</div>
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
            <span v-if="station">{{ station.name }}</span>
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
              <div class="details" v-html="$options.filters.rmstyle(station.note) || '暂未放开'"></div>
            </ex-space>
          </div>
        </div>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="next();">下一步</button>
    </ex-footer>

    <ex-picker v-bind="picker"/>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../env.config';
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      station: this.$store.state.repair.station,
      stations: [],
      picker: { show: false },
      loading: true,
    };
  },
  mounted() {
    const url = `${HOSTS.REPAIR}/api/repairSite/siteList`;
    const params = { countryCode: 'CN' };
    axios.get(url, { params, cache: true }).then(({ data }) => {
      this.stations = data;
      this.picker = {
        title: '选择维修网点',
        show: false,
        groups: [this.stations],
        checked: this.station ? [this.stations.findIndex(item => item.code === this.station.code)] : [-1],
        dismiss: () => {
          this.picker.show = false;
        },
        onCancel: () => {
          this.picker.show = false;
        },
        onConfirm: ({ list, checked }) => {
          this.picker.show = false;
          this.station = list[0];
          this.picker.checked = checked;
        },
      };
      this.loading = false;
    });
  },
  computed: {
    ...mapState('repair', ['type']),
  },
  methods: {
    ...mapActions('repair', ['setStation']),
    openPicker() {
      this.picker.show = true;
    },
    next() {
      // 校验
      if (!this.station) {
        return this.$message('请选择维修点');
      }
      // 缓存数据
      this.setStation({ station: this.station });
      // 配件工单不需要填写发货物流
      if (this.type === 1) {
        this.$router.push({ path: this.$prelang('repair/channel') });
      }
      // 普通工单和对发工单需要填写
      else {
        this.$router.push({ path: this.$prelang('repair/express') });
      }
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
