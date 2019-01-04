<template>
  <div class="ticket-list">
    <ex-header title="工单列表">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content>
      <div class="navbar underline primary">
        <a class="item" :class="{active: index === 0}" @click="listOrders(0)">普通工单</a>
        <a class="item" :class="{active: index === 1}" @click="listOrders(1)">配件工单</a>
        <a class="item" :class="{active: index === 2}" @click="listOrders(2)">对发工单</a>
      </div>

      <ex-loader :url="url" :list="list" :query="query" :callback="callback">
        <div class="list text-sm" v-for="item in list" :key="item.id">
          <div class="item">
            <div class="text text-ellipsis text-darkgray">ID: 03320171122181630429X7KLmm9l069D</div>
          </div>
          <div class="item">
            <div class="text">
              <ex-space space="5px 0">
                <div class="text-justify">
                  <span class="label">创建时间:</span>
                  <span class="value">2018/08/08 00:00</span>
                </div>
                <div class="text-justify">
                  <span class="label">运单号:</span>
                  <span class="value">2018231515432</span>
                </div>
              </ex-space>
            </div>
          </div>
        </div>
      </ex-loader>
    </ex-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 0,
      list: [],
    };
  },
  computed: {
    url() {
      return '/api/repair/orders';
    },
    query() {
      return { type: this.index };
    },
  },
  methods: {
    listOrders(index) {
      this.index = index;
    },
    callback({ list }) {
      this.list = list;
    },
  },
};
</script>
<style scoped lang="less">
.text .label {
  min-width: 5em;
}
</style>
