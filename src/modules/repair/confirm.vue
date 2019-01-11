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
          <div class="text">维修设备信息</div>
        </div>
        <div class="item">
          <div class="text">
            <div class="text-justify" v-for="item in selected" :key="item.id">
              <div class="value">{{item.name}}</div>
              <div class="count">x {{item.count}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="list text-sm">
        <div class="item">
          <div class="text">收件人信息</div>
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
          <div class="text">维修点信息</div>
        </div>
        <div class="item">
          <div class="text">
            <div v-html="$options.filters.rmstyle(station.note) || '暂未放开'"></div>
          </div>
        </div>
      </div>
      <!-- 配件工单没有发货信息 -->
      <div class="list text-sm" v-if="type !== 1">
        <div class="item">
          <div class="text">发货物流</div>
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
          <div class="text">回寄物流</div>
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
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      complete: false,
    };
  },
  computed: {
    ...mapState('repair', ['type', 'ticketId', 'selected', 'station', 'express', 'tracking', 'address', 'channel']),
  },
  mounted() {
    if (!this.selected.length) {
      return this.$alert({
        message: '数据不完善，请重新输入<br /><span class="text-warning">注意：中途不要刷新或离开</span>',
        callback: () => {
          this.$router.push(this.$prelang('repair'));
        },
      });
    }
    // 完善
    this.complete = true;
  },
  methods: {
    ...mapActions('repair/tickets', ['setTickets']),
    confirm() {
      // 前台的三个工单 type: 0:普通工单 1:配件工单 2:对发工单
      // 接口字段太绕了...
      const form = {
        dtype: this.type !== 1 ? '0' : '1', // 工单类型 0:普通工单 1:配件工单
        repairSite: this.station.code, // 维修地点
        sendBackBillName: this.channel.code, // 回寄物流
      };
      // 非配件工单
      if (this.type !== 1) {
        Object.assign(form, {
          afterCollectFlag: this.type !== 2 ? '0' : '1', // 是否对发 0:普通工单 1:对发工单
          billNo: this.tracking, // 物流单号
          billName: this.express.code, // 物流公司
          // 以下几个默认参数 M站不存在
          monoFlag: '0', // 0正常/1挪单
          packageCount: '1',
          repairPayInfo: {},
          remark: '',
        });
      }

      // 地址信息
      const addressInfo = {
        country: 'CN',
        countryName: '中国',
        custom: 0,
        areaCode: '',
        serialNumber: '',
        tax: '',
        zipCode: '',

        state: this.address.province.name,
        stateCode: this.address.province.code,
        city: this.address.city.name,
        cityCode: this.address.city.code,
        mobile: this.address.mobile,
        street: this.address.street,
        userName: this.address.name,
      };

      form.addressInfo = addressInfo;
      if (this.ticketId) {
        this.updateRepair(form);
      } else {
        this.createRepair(form);
      }
    },

    // 清空后台设备记录 (后台接口设计问题，防止M站和PC不同步)
    clearCache() {
      const url = `${HOSTS.REPAIR}/api/deviceCart/deviceCartList`;
      return axios.all([axios.get(url, { params: { dtype: 0 } }), axios.get(url, { params: { dtype: 1 } })]);
    },

    // 编辑设备
    updateDevices() {
      return this.clearCache().then(() => {
        // 需要更新设备
        return true;
      });
    },

    // 创建工单
    createRepair(form) {
      this.clearCache().then(() => {
        axios
          .all(
            // 接口和设计的遗留问题:
            // 每意见商品都要单发一个请求
            this.selected.map(item => {
              const url = `${HOSTS.REPAIR}/api/repairLine/saveRepairLine`;
              return axios.post(url, {
                certNo: '',
                issueInfo: '',
                type: item.type, // 配件类型
                dtype: form.dtype, // 工单类型
                productId: item.productId,
                productCount: item.count,
              });
            })
          )
          .then(() => {
            const url = `${HOSTS.REPAIR}/api/repairHeader/addRepairHeader`;
            axios.post(url, form).then(
              ({ data }) => {
                // 清空工单列表记录
                this.setTickets({ list: [] });
                this.$router.push(this.$prelang(`repair/success`));
              },
              ({ message }) => {
                this.$router.push(this.$prelang(`repair/failure`));
              }
            );
          });
      });
    },

    // 编辑工单
    updateRepair(form) {
      form.repairId = this.ticketId;
      const url = `${HOSTS.REPAIR}/api/repairHeader/modifyRepairHeader`;
      axios.post(url, form).then(
        ({ data }) => {
          // 清空工单列表记录
          this.setTickets({ list: [] });
          this.$router.push(this.$prelang(`repair/success`));
        },
        ({ message }) => {
          this.$router.push(this.$prelang(`repair/failure`));
        }
      );
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
