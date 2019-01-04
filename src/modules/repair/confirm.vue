<template>
  <ex-view>
    <ex-header title="提交确认">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content v-if="complete">
      <div class="message">
        <i class="text-driving">*</i> 请确认工单信息是否填写正确
      </div>
      <div class="list compact">
        <div class="item">
          <div class="text text-strong text-center">维修工单申请单</div>
        </div>
      </div>
      <div class="list text-sm">
        <div class="item">
          <div class="text text-darkgray">包裹信息</div>
        </div>
        <div class="item">
          <div class="text">
            <div class="text-justify" v-for="item in selected" :key="item.id">
              <div class="value">{{item.name}}</div>
              <div class="count">*{{item.count}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="list text-sm">
        <div class="item">
          <div class="text text-darkgray">包裹物流信息</div>
        </div>
        <div class="item">
          <div class="text">
            <div class="text-justify">
              <span class="label">发货物流商</span>
              <span class="value">{{express.name}}</span>
            </div>
            <div class="text-justify">
              <span class="label">发货运单号</span>
              <span class="value">{{tracking}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="list text-sm">
        <div class="item">
          <div class="text text-darkgray">维修点信息</div>
        </div>
        <div class="item">
          <div class="text">
            <div v-html="$options.filters.rmstyle(station.note)"></div>
          </div>
        </div>
      </div>
      <div class="list text-sm">
        <div class="item">
          <div class="text text-darkgray">收件人信息</div>
        </div>
        <div class="item">
          <div class="text">
            <h4>{{address.name}} {{address.mobile}}</h4>
            <div class="brief">{{address.province.name}}{{address.city.name}}{{address.street}}</div>
          </div>
        </div>
      </div>
      <div class="list text-sm">
        <div class="item">
          <div class="text text-darkgray">回寄物流</div>
        </div>
        <div class="item text-sm">
          <div class="text">{{channel.name}}</div>
        </div>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="confirm()">确认提交</button>
    </ex-footer>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../env.config';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      complete: false,
    };
  },
  computed: {
    ...mapState('repair', ['selected', 'station', 'express', 'tracking', 'address', 'channel']),
  },
  mounted() {
    if (this.selected.length && this.station && this.express && this.tracking && this.address && this.channel) {
      this.complete = true;
    } else {
      this.$alert({
        message: '数据不完善，请重新输入<br /><span class="text-warning">注意：中途不要刷新或离开</span>',
        callback: () => {
          this.$router.push(this.$prelang('repair'));
        },
      });
    }
  },
  methods: {
    confirm() {
      // TODO
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../less/base/fn.less';
.message {
  text-align: center;
  font-size: 13px;
  background: #fff5e5;
  color: @orange;
  line-height: 44px;
  padding: 0 15px;
}
</style>
