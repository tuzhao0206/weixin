<template>
  <ex-view :class="$style.style">
    <ex-header title="自动加载(Vuex版)">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title />
    </ex-header>
    <ex-content>
      <div class="vspace hspace">
        <div class="divider text-ts" ui-mode="20%">以下方法会重置Loader</div>
        <div class="button-group">
          <button class="button sm plain-warning" @click="changeUrl();">更改查询接口</button>
          <button class="button sm plain-primary" @click="changeQuery();">更改查询参数</button>
          <button class="button sm plain-success" @click="reload();">手动重载</button>
        </div>
      </div>
      <ex-loader ref="loader" :url="url" :list="list" :query="query" :callback="callback">
        <div class="list compact overlap">
          <div class="item" v-for="(item, idx) in list" :key="idx">
            <div class="text">{{ item.name }}</div>
          </div>
        </div>
      </ex-loader>
    </ex-content>
  </ex-view>
</template>
<script>
export default {
  data() {
    return {
      url: '/api/example/list',
      query: {},
    };
  },
  computed: {
    // PS:如果不想用Vuex，可以直接声明给当前state
    list: function() {
      return this.$store.state.example.loader.list;
    },
  },
  methods: {
    changeUrl() {
      this.url = '/example/ajax/list?_=' + Date.now();
    },
    changeQuery() {
      this.query = { t: Date.now() };
    },
    reload() {
      this.$refs.loader.reload();
    },
    callback({ list }) {
      // PS:如果不想用Vuex，可以直接赋值给当前state
      this.$store.dispatch('example/loader/listItems', {
        type: 'listItems',
        list: list,
      });
    },
  },
};
</script>
<style lang="less" module>
:local(.style) {
  .demo {
    color: #f00;
  }
}
</style>
