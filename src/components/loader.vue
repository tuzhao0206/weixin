<template>
  <div ref="panel" class="loader">
    <slot />
    <div class="loadmore" v-if="loading">
      <i class="loading" /> <span class="tips text-gray">{{ $t('tips') }}</span>
    </div>
    <div class="vspace" ui-mode="15px" v-else-if="list.length === 0">
      <p class="text-sm text-center text-gray text-thin">— {{ $t('blank') }} —</p>
    </div>
    <div class="divider" ui-mode="30%" v-else-if="isEnds">{{ $t('ends') }}</div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  i18n: {
    messages: {
      en: { tips: 'Loading...', ends: 'No more data available', blank: 'No data available' },
      zh: { tips: '努力加载中', ends: '亲，我是有底线的', blank: '暂无数据' },
    },
  },
  props: {
    url: { type: String, required: true },
    callback: { type: Function, default: n => n },
    list: { type: Array, default: () => [] }, // 默认值 比如从vuex中恢复时
    query: { type: Object, default: () => ({}) }, // 查询参数
    size: { type: Number, default: 10 },
    threshold: { type: Number, default: 300 }, // 阈值
    pname: { type: String, default: 'page' },
    sname: { type: String, default: 'size' },
    ends: { type: Boolean, default: false },
    transform: { type: Function, default: data => data.list },
  },
  data() {
    return {
      page: 0,
      loading: false,
      items: [].concat(this.list), // 防止篡改原引用
    };
  },
  computed: {
    isEnds: function() {
      // 首页不展示ends信息
      return this.ends && this.page > 1 && this.page * this.size > this.items.length;
    },
  },
  watch: {
    url: function(newVal, oldVal) {
      this.reload();
    },
    query: function(newVal, oldVal) {
      // TODO: 这里有一个隐患 如果query本身只是对调参数顺序 这个判定会返回错误 从而导致整个列表重置
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.reload();
      }
    },
  },
  mounted: function() {
    this.listener();
  },
  destroyed() {
    this.release();
  },
  methods: {
    // 提供一个方法用于重置数据 并重新加载
    reload() {
      this.page = 0;
      this.loading = false;
      this.items = [];
      this.callback({ list: this.items });
      // 重新绑定监听 防止之前被释放 并且会自动加载
      this.listener();
    },
    handler() {
      // 若容器被隐藏 不需要自动加载
      if (!this.$refs.panel.offsetParent) {
        return;
      }
      const BD = document.body;
      const DE = document.documentElement;
      const ST = Math.max(BD.scrollTop, DE.scrollTop); // scrollTop
      const SH = Math.max(BD.scrollHeight, DE.scrollHeight); // scrollHeight
      const CH = Math.min(BD.clientHeight, DE.clientHeight); // clientHeight
      // 如果距离底部距离大于阈值 则执行加载
      if (SH - ST - CH < this.threshold) {
        this.loadMore();
      }
    },
    release() {
      // 取消异步请求
      if (this.cancel) {
        this.cancel('cancel');
      }
      window.removeEventListener('scroll', this.handler);
    },
    listener() {
      this.release();
      window.addEventListener('scroll', this.handler);

      const count = this.items.length;
      // 如果默认数据为空 自动加载
      if (count === 0) {
        this.loadMore();
      } else {
        // 如果默认存在数据 重算页码
        this.page = Math.ceil(count / this.size);
      }
    },
    loadMore() {
      // 正在加载需要等待
      if (this.loading) {
        return;
      }
      // 如果当前数据小于理论数量 就认为已经没有下一页数据了
      if (this.page * this.size > this.items.length) {
        return;
      }

      this.loading = true;
      axios
        .get(this.url, {
          params: {
            [this.pname]: this.page + 1,
            [this.sname]: this.size,
            ...this.query,
          },
          global: false, // 不触发全局事件(Toast提示)
          cancelToken: new axios.CancelToken(cancel => {
            this.cancel = cancel;
          }),
        })
        .then(({ data }) => {
          this.loading = false;
          this.page = this.page + 1;
          const list = this.transform(data);
          this.items = this.items.concat(list);
          // 不足一页
          if (list.length < this.size) {
            this.release();
          }

          // 调用回调
          this.callback({ list: this.items });
        })
        .catch(() => {
          this.loading = false;
          this.release();
        });
    },
  },
};
</script>
