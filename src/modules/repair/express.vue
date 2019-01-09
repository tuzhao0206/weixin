<template>
  <ex-view>
    <ex-header title="填写发货单号">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content v-if="!loading">
      <div class="list">
        <div class="item">
          <div class="text-sm">Step3：请联系快递商打包物品并填写包裹信息</div>
        </div>
        <div class="item">
          <ex-space space="10px 0">
            <div class="notice text-sm">注意：请认真填写您的包裹信息，务必保证运单号与设备信息的准确。</div>
          </ex-space>
        </div>
        <div class="item text-sm" @click="openPicker">
          <div class="text">
            <i class="text-warning">*</i>
            <span>发货物流商</span>
          </div>
          <div class="extra">
            <span v-if="express">{{express.name}}</span>
            <span v-else class="text-gray">选择</span>
          </div>
          <i class="icon text-gray">&#xe61a;</i>
        </div>
        <label class="item text-sm" ui-mode="input">
          <div class="label">
            <i class="text-warning">*</i>
            <span>发货运单号</span>
          </div>
          <input class="input text-right" v-model="tracking" maxlength="30" placeholder="发货运单号">
        </label>
      </div>

      <!-- <div class="list" v-if="station">
        <div class="item text-sm">
          <div class="text">
            <ex-space space="10px 0">
              <p>请将维修机器寄往以下地址：</p>
              <div class="details" v-html="$options.filters.rmstyle(station.note) || '暂未放开'"></div>
            </ex-space>
          </div>
        </div>
      </div>-->
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
      loading: true,
      logistics: [],
      express: this.$store.state.repair.express, // 物流
      tracking: this.$store.state.repair.tracking, // 运单
      picker: { show: false },
    };
  },
  computed: {
    ...mapState('repair', ['station']),
  },
  mounted() {
    const url = `${HOSTS.BASE}/api/logistics/getLogistics?flag=repair`;
    axios.get(url, { cache: true }).then(({ data }) => {
      this.logistics = data;
      this.loading = false;

      this.picker = {
        show: false,
        title: '发货物流商',
        groups: [this.logistics],
        checked: [-1],
        dismiss: () => {
          this.picker.show = false;
        },
        onCancel: () => {
          this.picker.show = false;
        },
        onConfirm: ({ list, checked }) => {
          this.picker.show = false;
          this.express = list[0];
          this.picker.checked = checked;
        },
      };
    });
  },
  methods: {
    ...mapActions('repair', ['setExpress']),
    openPicker() {
      this.picker.show = true;
    },
    next() {
      if (!this.express) {
        return this.$message('请选择发货物流商');
      }
      if (!/^[A-Z0-9]+$/i.test(this.tracking)) {
        return this.$message('请输入正确的运单号');
      }
      if (this.tracking.length < 8 || this.tracking.length > 30) {
        return this.$message('运单号8～30位');
      }

      // 缓存数据
      this.setExpress({
        express: this.express,
        tracking: this.tracking,
      });
      this.$router.push({ path: this.$prelang('repair/address') });
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
