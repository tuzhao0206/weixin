<template>
  <ex-view>
    <ex-header :title="title">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content>
      <div class="item" v-if="list.length === 0">
        <div class="text">
          <ex-space space="30px 0">
            <div class="text-sm text-center text-gray">- 暂无设备信息 -</div>
          </ex-space>
        </div>
      </div>

      <!-- 维修订单号 发货运单号 -->
      <div class="list text-sm" v-for="item in list" :key="item.id">
        <div class="item">
          <div class="text">SN: {{item.certSn}}</div>
        </div>
        <div class="item">
          <div class="text">
            <div class="text-justify">
              <span class="label text-gray">收货时间</span>
              <span>{{item.collectTime|date('yyyy-MM-dd hh:mm:ss')|defaults('暂无')}}</span>
            </div>
            <div class="text-justify">
              <span class="label text-gray">质保</span>
              <span>{{item.warrantyStatus|warranty}}</span>
            </div>
            <div class="text-justify">
              <span class="label text-gray">问题检测结果</span>
              <span>{{item.faultName || '暂无'}}</span>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="text">
            <div class="text-justify">
              <span class="label text-gray">维修价格</span>
              <!-- quotedpriceStatus 1/2 -->
              <span v-if="[1,2].indexOf(+item.quotedpriceStatus) !== -1">{{item.expend|currency}}</span>
              <span class="text-primary" v-else>待报价</span>
            </div>
            <div class="text-justify">
              <span class="label text-gray">付款状态</span>
              <span :class="{'text-primary': +item.payStatus !== 1}">{{item.payStatus|payStatus}}</span>
            </div>
            <div class="text-justify">
              <span class="label text-gray">发货状态</span>
              <span :class="{'text-primary': +item.sendStatus !== 2}">{{item.sendStatus|sendStatus}}</span>
            </div>
          </div>
        </div>
        <div class="item" v-if="+item.sendStatus === 2">
          <div class="text">
            <div class="text-justify">
              <span class="label text-gray">发货物流</span>
              <span>{{item.sendBillName|billName}}</span>
            </div>
            <div class="text-justify">
              <span class="label text-gray">发货运单号</span>
              <span>{{item.sendBillNo}}</span>
            </div>
            <div class="text-justify">
              <span class="label text-gray">发货SN</span>
              <span>{{item.repairSn}}</span>
            </div>
          </div>
        </div>
      </div>
    </ex-content>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../env.config';
let logistics = [];
export default {
  data() {
    return {
      title: this.$route.query.title || '工单设备明细',
      list: [],
    };
  },
  filters: {
    // inWarrantyPeriod: 保内保外，0:保外；1:保内
    warranty(type) {
      return ['保外', '保内'][type];
    },
    payStatus(type) {
      const map = ['未付款', '已付款'];
      return map[type];
    },
    sendStatus(type) {
      const map = ['未发货', '待发货', '已发货'];
      return map[type];
    },
    billName(code) {
      const target = logistics.find(item => item.code === code);
      return target ? target.name : code;
    },
  },
  mounted() {
    this.getLogistics();

    const url = `${HOSTS.REPAIR}/api/repairDetail/getRepairDetails`;
    const params = { lineId: this.$route.params.id };
    axios.get(url, { params }).then(({ data }) => {
      this.list = data.filter(item => Object.keys(item).length !== 0);
    });
  },
  methods: {
    getLogistics() {
      const url = `${HOSTS.BASE}/api/logistics/getLogistics?flag=repair`;
      axios.get(url, { cache: true }).then(({ data }) => {
        logistics = data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../less/base/fn.less';
</style>
