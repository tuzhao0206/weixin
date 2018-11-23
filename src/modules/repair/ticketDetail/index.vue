<template>
  <div class="ticket-detail">
    <ex-header title="工单详情">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title />
    </ex-header>

    <ex-content>
      <section class="card card1">
        <p class="status">待收货</p>
        <div class="content">
          <p class="ticket-id"><span>工单ID: </span> <span>03320171122181630429X7KLmm9l069D</span></p>
          <p><span>创建时间: </span> <span>2018/08/08 00:00</span></p>
        </div>
      </section>

      <section class="card send">
        <p class="title">发货物流信息</p>
        <div class="content">
          <table>
            <tr>
              <td>物流公司:</td>
              <td>德邦物流</td>
            </tr>
            <tr>
              <td>物流单号:</td>
              <td>DB73428572394</td>
            </tr>
            <tr>
              <td>维修网点:</td>
              <td>深圳</td>
            </tr>
            <tr>
              <td>邮寄地址:</td>
              <td></td>
            </tr>
            <tr>
              <td>收件人:</td>
              <td>蚂蚁售后</td>
            </tr>
            <tr>
              <td>电话号码:</td>
              <td>
                133123123123（此电话咋咋咋咋咋咋咋咋此电话咋咋咋咋咋咋咋此电话咋咋咋咋咋咋咋此电话咋咋咋咋咋咋咋）
              </td>
            </tr>
            <tr>
              <td>收货地址</td>
              <td>深圳市宝安区沙井镇沙头村裕明路20号</td>
            </tr>
          </table>
        </div>
      </section>

      <section class="card receipt">
        <p class="title">收货物流信息</p>
        <div class="content">
          <table>
            <tr>
              <td>收件人:</td>
              <td>客户名字</td>
            </tr>
            <tr>
              <td>电话号码:</td>
              <td>+86-13312921312</td>
            </tr>
            <tr>
              <td>收货地址:</td>
              <td>深圳市宝安区沙井镇沙头村裕明路20号</td>
            </tr>
          </table>
        </div>
      </section>

      <section class="card equipment">
        <p class="title">维修设备信息</p>
        <ul @click="goToEquipmentFeedback('idididid5317580243');">
          <li>
            <!-- tag1： css代表整机， tag0: 配件， tag2: 物料 -->
            <div><i class="tag tag1">整机</i> <span class="name">矿机蚂蚁矿机蚂蚁矿机矿机蚂蚁矿机蚂蚁矿机</span></div>
            <div class="count">*3</div>
          </li>
          <li>
            <div><i class="tag tag0">配件</i> <span>蚂蚁矿机S7-1G模组（N）5.4</span></div>
            <div class="count">*3</div>
          </li>
          <li>
            <div><i class="tag tag2">物料</i> <span>蚂蚁矿机S7-1G模组（N）5.4</span></div>
            <div class="count">*3</div>
          </li>
        </ul>
      </section>
    </ex-content>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },

  computed: {},

  mounted() {},

  methods: {
    goToEquipmentFeedback(id) {
      this.$router.push(`/repair/equipmentFeedback/${id}`);
    },
  },
};
</script>

<style scoped lang="less" style="text/less">
@import '../../../less/base/variable/color.less';
.ticket-detail {
  .card {
    background-color: @white;
    margin-top: 10px;
    .title {
      padding: 10px 12px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: @lightBlack;
      border-bottom: 1px solid #f3f3f3;
    }
    .content {
      padding: 12px;
    }
  }
  .card1 {
    padding: 0 12px;
    .status {
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: @blue;
      line-height: 20px;
      padding: 10px 0;
      border-bottom: 2px dashed #efeff4;
    }
    .content {
      font-family: PingFangSC-Regular;
      color: #262626;
      padding: 11px 0 13px 0;
      .ticket-id {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
  .send,
  .receipt {
    table {
      tr {
        vertical-align: top;
        padding: 5px 0;
        td:first-child {
          color: #262626;
          white-space: nowrap;
          padding-right: 10px;
        }
        td:last-child {
          color: #666666;
        }
      }
    }
  }
  .equipment {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0 14px 12px;
      &:not(:last-child) {
        border-bottom: 1px solid #f3f3f3;
      }
      .tag {
        font-size: 12px;
        color: #fff;
        font-style: normal;
        padding: 2px 5px;
        border-radius: 4px;
      }
      .tag0 {
        background-color: @green;
      }
      .tag1 {
        background-color: @blue;
      }
      .tag2 {
        background-color: @orange;
      }

      .count {
        padding-left: 5px;
        padding-right: 12px;
      }
    }
  }
}
</style>
