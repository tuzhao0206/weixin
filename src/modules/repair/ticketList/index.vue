<template>
  <div class="ticket-list">
    <ex-header title="工单列表">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title />
    </ex-header>

    <ex-content>
      <section class="card" @click="goToDetail('idididid753429875');">
        <p class="title"><span>工单ID: </span><span>03320171122181630429X7KLmm9l069D</span></p>
        <div class="content">
          <p><span>创建时间: </span> <span>2018/08/08 00:00</span></p>
          <p><span>运单号: </span> <span>2018231515432</span></p>
        </div>
      </section>

      <section class="card" @click="goToDetail('idididid90231472315');">
        <p class="title"><span>工单ID: </span><span>03320171122181630429X7KLmm9l069D</span></p>
        <div class="content">
          <p><span>创建时间: </span> <span>2018/08/08 00:00</span></p>
          <p><span>运单号: </span> <span>2018231515432</span></p>
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

  methods: {
    goToDetail(id) {
      this.$router.push(`/repair/ticketDetail/${id}`);
    },
  },
};
</script>

<style scoped lang="less" style="text/less">
.ticket-list {
  .card {
    background-color: #fff;
    padding: 0 12px;
    margin-top: 10px;
    .title {
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(38, 38, 38, 1);
      line-height: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 10px 0;
      border-bottom: 2px dashed #efeff4;
    }
    .content {
      font-family: PingFangSC-Regular;
      color: #676767;
      padding: 11px 0 13px 0;
    }
  }
}
</style>
