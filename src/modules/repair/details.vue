<template>
  <ex-view>
    <ex-header title="工单详情">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content v-if="loaded">
      <div class="list text-sm">
        <div class="item">
          <div class="text text-strong text-darkgray">基本信息</div>
        </div>
        <div class="item">
          <div class="text">
            <div class="text-justify">
              <span class="label">状态:</span>
              <span
                class="value"
                :class="{'text-primary': ticket.status != 2}"
              >{{ ticket.status|status }}</span>
            </div>
            <div class="text-justify">
              <span class="label">工单类型:</span>
              <span class="value">{{ ticket.type|type }}</span>
            </div>
            <div class="text-justify">
              <span class="label">工单ID:</span>
              <span class="value">{{ticket.repairId}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="list text-sm">
        <div class="item">
          <div class="text text-strong text-darkgray">维修设备信息</div>
        </div>
        <router-link
          tag="div"
          class="item text-sm"
          v-for="item in devices"
          :key="item.id"
          :to="{path:$prelang(`repair/inventory/${item.id}`), query: {title: item.productName}}"
        >
          <div
            class="tag"
            :class="{ success: +item.type === 1, driving: +item.type === 2 }"
          >{{ item.type|deviceType }}</div>
          <div class="text">{{ item.productName }}</div>
          <div class="extra">x {{item.productCount}}</div>
          <i class="icon text-gray">&#xe61a;</i>
        </router-link>
      </div>

      <div class="list text-sm">
        <div class="item">
          <div class="text text-strong text-darkgray">收件人信息</div>
        </div>
        <div class="item">
          <div class="text">
            <div class="text-justify">
              <span class="label">收件人:</span>
              <span class="value">{{address.userName}}</span>
            </div>
            <div class="text-justify">
              <span class="label">电话号码:</span>
              <span class="value">{{address.mobile}}</span>
            </div>
            <div class="text-justify">
              <span class="label">收货地址:</span>
              <span class="value">{{address.state}}{{address.city}}{{address.street}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="list text-sm">
        <div class="item">
          <div class="text text-strong text-darkgray">维修点信息</div>
          <div class="extra" v-if="station">{{ station.name }}</div>
        </div>
        <div class="item">
          <div class="text">
            <div v-if="station" v-html="$options.filters.rmstyle(station.note) || '暂未放开'"></div>
            <div v-else class="text-gray">暂无信息</div>
          </div>
        </div>
      </div>

      <!-- 特殊工单无需输入发货物流 -->
      <div class="list text-sm" v-if="express && ticket.billNo">
        <div class="item">
          <div class="text text-strong text-darkgray">发货物流</div>
        </div>
        <div class="item">
          <div class="text">
            <div class="text-justify">
              <span class="label">物流公司:</span>
              <span class="value">{{ express.name }}</span>
            </div>
            <div class="text-justify">
              <span class="label">物流单号:</span>
              <span class="value">{{ ticket.billNo }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="list text-sm">
        <div class="item text-strong text-darkgray">
          <div class="text">回寄物流</div>
        </div>
        <div class="item text-sm">
          <div class="text" v-if="channel">
            <div class="text-justify">
              <span class="label">物流公司:</span>
              <span class="value">{{ channel.name }}</span>
            </div>
          </div>
          <div class="text text-gray" v-else>暂无信息</div>
        </div>
      </div>
    </ex-content>
    <ex-footer class="btm-fixed" v-if="isEditable">
      <div class="button-group compact">
        <button class="button square text-warning" @click="delTicket">删除</button>
        <button class="button square primary" @click="editAction">编辑</button>
      </div>
    </ex-footer>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../env.config';
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      loaded: false,
      ticket: null,
      express: null,
      channel: null,
      station: null,
      address: null,
      devices: [],
    };
  },
  computed: {
    isEditable() {
      // 0:待收货 1:已收货 2:已完成 3:不收货 4:后收货 5:部分收货 6:待审核。
      // type: 6-退运重发工单不可编辑
      return this.ticket && (this.ticket.status === 0 || this.ticket.status === 6) && this.ticket.type !== 6;
    },
  },
  filters: {
    // 工单状态
    // 0:待收货 1:已收货 2:已完成 3:不收货 4:后收货 5:部分收货 6:待审核。
    status(status) {
      return ['待收货', '已收货', '已完成', '不收货', '后收货', '部分收货', '待审核'][status] || '其他';
    },
    // 工单类型
    // 0:维修工单 2:特殊工单
    type(type) {
      return ['维修工单', '', '特殊工单', '', '', '对发工单', '退运工单', '矿场工单'][type] || '其他';
    },
    // 设备类型
    deviceType(type) {
      const types = ['整机', '配件', '物料'];
      return types[type];
    },
  },
  mounted() {
    this.getTicket().then(ticket => {
      this.ticket = ticket;
      // 数字转换 方便对比计算
      this.ticket.type = Number(this.ticket.type);
      this.ticket.status = Number(this.ticket.status);

      // 前置加载工单 由于后面会依赖工单数据
      axios.all([this.getLogistics(), this.getStation(), this.getAdress(), this.getDevices()]).then(
        axios.spread((logistics, station, address, devices) => {
          this.express = logistics.find(item => item.code === this.ticket.billName);
          this.channel = logistics.find(item => item.code === this.ticket.sendBackBillName);
          this.station = station;
          this.address = address;
          this.devices = devices;
          // 全部加载完成
          this.loaded = true;
        })
      );
    });
  },
  methods: {
    ...mapActions('repair', ['setSelected', 'setStation', 'setExpress', 'setAddress', 'setChannel']),
    ...mapActions('repair', ['setBasis']),
    ...mapActions('repair/tickets', ['setTickets']),
    // 工单详情
    getTicket() {
      const url = `${HOSTS.REPAIR}/api/repairHeader/workOrderInfo`;
      const params = { repairId: this.$route.params.id };
      return axios.get(url, { params, global: false }).then(({ data }) => {
        return data[0];
      });
    },
    // 设备列表
    getDevices() {
      const url = `${HOSTS.REPAIR}/api/repairLine/repairLineList`;
      const params = { repairId: this.$route.params.id };
      return axios.get(url, { params }).then(({ data }) => {
        return data;
      });
    },
    // 回寄地址
    getAdress() {
      const url = `${HOSTS.REPAIR}/api/repairHeader/clientInfo`;
      const params = { repairId: this.$route.params.id };
      return axios.get(url, { params }).then(({ data }) => {
        return data[0];
      });
    },
    // 物流列表
    getLogistics() {
      const url = `${HOSTS.BASE}/api/logistics/getLogistics?flag=repair`;
      return axios.get(url, { cache: true }).then(({ data }) => {
        return data;
      });
    },
    // 维修站点
    getStation() {
      const url = `${HOSTS.REPAIR}/api/repairSite/siteList`;
      const params = { countryCode: 'CN' };
      return axios.get(url, { params, cache: true }).then(({ data }) => {
        return data.find(item => item.code === this.ticket.repairSite);
      });
    },
    // 删除工单
    delTicket() {
      this.$confirm({
        message: '确认是否删除本工单所有信息？',
        callback: () => {
          const url = `${HOSTS.REPAIR}/api/repairHeader/deleteRepairHeader`;
          const params = { repairId: this.$route.params.id };
          axios.get(url, { params }).then(({ message }) => {
            this.$message(message || '删除成功');
            this.setTickets({ list: [] });
            this.$router.go(-1);
          });
        },
      });
    },
    // 编辑提醒
    editAction() {
      this.$store.dispatch({
        type: 'showSheet',
        sheet: {
          message: '请选择编辑内容',
          dismiss: () => {
            this.$store.dispatch('hideSheet');
          },
          buttons: [
            [
              {
                text: '编辑维修设备',
                class: 'text-primary',
                onClick: () => {
                  this.$store.dispatch('hideSheet');
                  this.editDevice();
                },
              },
              {
                text: '编辑物流信息',
                class: 'text-driving',
                onClick: () => {
                  this.$store.dispatch('hideSheet');
                  this.editTicket();
                },
              },
            ],
            [
              {
                text: '取消',
                class: 'text-gray',
                onClick: () => {
                  this.$store.dispatch('hideSheet');
                },
              },
            ],
          ],
        },
      });
    },
    // 编辑设备
    editDevice() {
      const selected = this.devices.map(item => ({
        id: item.id,
        count: item.productCount,
        name: item.productName,
        priceOneCredit: item.priceOneCredit,
        productId: item.productId,
        type: +item.type,
      }));

      let type = 0;
      // 特殊工单
      if (this.ticket.type === 2) {
        type = 1;
      }
      // 对发工单
      else if (Number(this.ticket.afterCollectFlag) === 1) {
        type = 2;
      }
      this.setSelected({ selected });
      this.$router.push(this.$prelang(`repair/issue/${this.ticket.repairId}?type=${type}`));
    },
    // 编辑工单
    editTicket() {
      // 设备列表
      const selected = this.devices.map(item => ({
        id: item.id,
        count: item.productCount,
        name: item.productName,
        priceOneCredit: item.priceOneCredit,
        productId: item.productId,
        type: +item.type,
      }));
      // 收货地址
      const station = this.station;
      // 物流信息
      const express = this.express;
      // 运单号码
      const tracking = this.ticket.billNo;
      // 回寄物流
      const channel = this.channel;
      // 回寄地址
      const address = {
        name: this.address.userName,
        mobile: this.address.mobile,
        province: {
          code: this.address.stateCode,
          name: this.address.state,
        },
        city: {
          code: this.address.cityCode,
          name: this.address.city,
        },
        street: this.address.street,
      };

      this.setSelected({ selected });
      this.setStation({ station });
      this.setExpress({ express, tracking });
      this.setChannel({ channel });
      this.setAddress({ address });

      let type = 0;
      // 特殊工单
      if (this.ticket.type === 2) {
        type = 1;
      }
      // 对发工单
      else if (Number(this.ticket.afterCollectFlag) === 1) {
        type = 2;
      }
      this.setBasis({ ticketType: type, ticketId: this.ticket.repairId });
      this.$router.push(this.$prelang('repair/address'));
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../less/base/fn.less';
.text-justify .label {
  min-width: 4.5em;
}
div.item {
  div.tag {
    padding: 4px 5px;
    border-radius: 2px;
    font-size: 12px;
    margin-right: 5px;
    line-height: 1;
    color: #fff;
    background-color: @blue;

    &.success {
      background-color: @green;
    }
    &.driving {
      background-color: @orange;
    }
  }
}
</style>
