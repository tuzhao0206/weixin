<template>
  <ex-view>
    <ex-header :title="title">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content>
      <div class="item" v-if="meta && list.length === 0">
        <div class="text">
          <ex-space space="20px 0">
            <div class="text-sm text-center text-gray">- 工单未收货，暂无设备信息 -</div>
          </ex-space>
        </div>
      </div>

      <!-- 维修订单号 发货运单号 -->
      <div class="list text-sm" v-for="item in list" :key="item.id">
        <div class="item">
          <div class="text">
            <div class="text-justify">
              <span class="label text-gray">收货SN号</span>
              <span>{{item.receiptSN}}</span>
            </div>
            <div class="text-justify">
              <span class="label text-gray">发货SN号</span>
              <span>{{item.shipSN}}</span>
            </div>
            <div class="text-justify">
              <span class="label text-gray">质保</span>
              <span>{{item.inWarrantyPeriod|warranty}}</span>
            </div>
            <div class="text-justify">
              <span class="label text-gray">维修价格</span>
              <span>{{item.repairMoney|currency}}</span>
            </div>
            <div class="text-justify">
              <span class="label text-gray">发货状态</span>
              <span>{{item.productStatus|status}}</span>
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
export default {
  data() {
    return {
      meta: null,
      list: [],
    };
  },
  computed: {
    title() {
      return this.meta ? this.meta.productName : '...';
    },
  },
  filters: {
    // inWarrantyPeriod: 保内保外，0:保外；1:保内
    warranty(type) {
      return ['保外', '保内'][type];
    },
    status(type) {
      const map = ['未收货', '已收货', '后收货', '不收货', '未收款', '已收款', '已发货'];
      return map[type];
    },
  },
  mounted() {
    const url = `${HOSTS.REPAIR}/api/repairLine/repairLineList`;
    const params = { repairId: this.$route.params.repairId };
    axios.get(url, { params }).then(({ data }) => {
      this.meta = data.find(item => item.id === this.$route.params.id);
      this.list = this.meta ? this.meta.equipmentDetailList : [];
    });
  },
};
</script>

<style lang="less" scoped>
@import '../../less/base/fn.less';
</style>
