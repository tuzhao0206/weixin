<template>
  <ex-view>
    <ex-header title="提交确认">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content class="content" v-if="complete">
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
              <div class="value">{{ item.name }}</div>
              <div class="count">x {{ item.count }}</div>
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
            <h4>{{ address.name }} {{ address.mobile }}</h4>
            <div
              class="brief"
            >{{ address.province.name }}{{ address.city.name }}{{ address.street }}</div>
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
              <span class="value">{{ express.name }}</span>
            </div>
            <div class="text-justify">
              <span class="label">发货运单号</span>
              <span class="value">{{ tracking }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="list text-sm">
        <div class="item">
          <div class="text">回寄物流</div>
        </div>
        <div class="item text-sm">
          <div class="text">{{ channel.name }}</div>
        </div>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed">
      <div class="protocol">
        <div class="agree">
          <label class="center">
            <input class="checkbox primary" type="checkbox" v-model="agree">
            <span>
              请阅读并同意:
              <a class="text-primary" @click="promptProtocol">《BITMAIN售后维修服务条款》</a>
              <a class="text-primary" @click="promptPrice">《售后维修报价标准》</a>
              <a class="text-primary" @click="promptCredit" v-if="type === 2">《对发服务条款》</a>
            </span>
          </label>
        </div>
        <button class="button primary square" @click="confirm()" :disabled="!agree">确认提交</button>
      </div>
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
      agree: false,
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
          this.$router.push(this.$prelang('repair/'));
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

    // 新增设备
    createDevices(form) {
      return this.clearCache().then(() => {
        const url = `${HOSTS.REPAIR}/api/repairLine/batchSaveRepairLine`;
        return axios.post(url, {
          dtype: form.dtype, // 工单类型
          repairLine: this.selected.map(item => ({
            productId: item.productId,
            productCount: item.count,
          })),
        });
      });
    },

    // 创建工单
    createRepair(form) {
      this.createDevices(form).then(() => {
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
    // 维修条款
    promptProtocol() {
      const url = `${HOSTS.BASE}/api/sysinit/getSysInit`;
      const params = { flag: 'ticket' };
      axios.get(url, { params, cache: true }).then(({ data }) => {
        this.$confirm({
          message: `
          <div style="max-height:300px;max-height:50vh;overflow-y:scroll;font-size:14px;text-align:left;">
            ${this.$options.filters.rmstyle(data[0].moreInfo)}
          </div>`,
          trigger: 'all', // 取消也触发
          callback: action => {
            this.agree = action;
          },
        });
      });
    },
    // 报价标准
    promptPrice() {
      this.$confirm({
        message: `
          <div style="max-height:300px;max-height:50vh;overflow-y:scroll;font-size:14px;text-align:left;">
            <p><strong>一、报价规则</strong></p>
            <p>1.维修报价（含混板、报废报价）不高于整机价格。</p>
            <p>2.治具</p>
            <p>
              ①若能提供订单号证明维修工单是在发货30天内创建，可联系在线客服申请不收费(注：若同一设备连续两次申请二返，且二返测试结果皆为无故障良品，则连续第三次走二返将予以报价)；
            </p>
            <p>
              ②若无相关免收费证明，则不良治具报价100RMB/15USD、报废治具报价同官网售价。
            </p>
            <p><strong>二、具体参考报价如下：</strong></p>
            <p><strong>1.整机返修</strong></p>
            <p>
              <img style="max-width:100%" src="https://dn-bitmain.qbox.me/o_1cv2d01mi1s496gnio84uk17svf.png" />
            </p>
            <p>
              <img style="max-width:100%" src="https://dn-bitmain.qbox.me/o_1cv2d5dctuf5bnrmbf1murd40u.png" />
            </p>
            <p><strong>2.单独返修</strong></p>
            <p>
              <img style="max-width:100%" src="https://dn-bitmain.qbox.me/o_1cv2d13hqsjgjc41li9ouvdh3p.png" />
            </p>
            <p>
              <strong
                >温馨提示：以上报价可能会根据市价和实际情况进行调整，以最新公布维修价格为准</strong
              >
            </p>
          </div>`,
        trigger: 'all', // 取消也触发
        callback: action => {
          this.agree = action;
        },
      });
    },
    // 对发协议
    promptCredit() {
      const url = `https://file11.bitmain.com/shop-product/clause/workOrderService.html`;
      axios.get(url, { cache: true, withCredentials: false }).then(policy => {
        this.$confirm({
          message: `
          <div style="max-height:300px;max-height:50vh;overflow-y:scroll;font-size:14px;text-align:left;">
            ${this.$options.filters.rmstyle(policy)}
          </div>`,
          trigger: 'all', // 取消也触发
          callback: action => {
            this.agree = action;
          },
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../less/base/fn.less';
.message {
  font-size: 13px;
  background: #fff5e5;
  color: @orange;
  line-height: 44px;
  padding: 0 15px;
}
.content {
  margin-bottom: 122px;
}
.protocol {
  flex: 1;
  .agree {
    font-size: 14px;
  }
}
</style>
