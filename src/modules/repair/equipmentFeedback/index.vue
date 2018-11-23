<template>
  <div class="equipment-feedback">
    <ex-header title="设备反馈">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title />
    </ex-header>

    <ex-content>
      <section class="card">
        <p class="title">SN: fklsadjfl902351</p>
        <div class="content">
          <table>
            <tr>
              <td>收货时间：</td>
              <td>2018/08/08 00:00</td>
            </tr>
            <tr>
              <td>质保:</td>
              <td>保外</td>
            </tr>
            <tr class="btm-dashed">
              <td>问题检测结果:</td>
              <td>7板丢板;6板丢板;控制板不良</td>
            </tr>
            <tr>
              <td>维修价格:</td>
              <td class="base">带报价</td>
            </tr>
            <tr>
              <td>付款状态:</td>
              <td class="base">待付款</td>
            </tr>
            <tr>
              <td>发货状态:</td>
              <td class="base">待发货</td>
            </tr>
          </table>
        </div>
      </section>

      <section class="card">
        <p class="title">SN: fklsadjfl902351</p>
        <div class="content">
          <table>
            <tr>
              <td>收货时间：</td>
              <td>2018/08/08 00:00</td>
            </tr>
            <tr>
              <td>质保:</td>
              <td>保外</td>
            </tr>
            <tr class="btm-dashed">
              <td>问题检测结果:</td>
              <td>7板丢板;6板丢板;控制板不良</td>
            </tr>
            <tr>
              <td>维修价格:</td>
              <td>¥100</td>
            </tr>
            <tr>
              <td>付款状态:</td>
              <td class="base">待付款</td>
            </tr>
            <tr>
              <td>发货状态:</td>
              <td class="base">待发货</td>
            </tr>
          </table>
        </div>
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

  methods: {},
};
</script>

<style scoped lang="less" style="text/less">
@import '../../../less/base/variable/color.less';
.equipment-feedback {
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
  }
  .base {
    color: @blue !important;
  }
}
</style>
