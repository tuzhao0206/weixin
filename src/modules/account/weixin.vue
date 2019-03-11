<template>
  <ex-view class="view">
    <ex-content>
      <ex-grid-loading/>
    </ex-content>
  </ex-view>
</template>
<script>
import axios from 'axios';
import { parseQuery } from '../../utils/helper';
export default {
  data() {
    const { code, next } = parseQuery();
    return {
      code,
      next,
    };
  },
  mounted() {
    if (!this.code) {
      return this.$message('参数错误');
    }
    this.getWxUser();
  },
  methods: {
    getWxUser() {
      axios.get('/api/weChat/checkUnionId', { global: false, params: { code: this.code } }).then(({ code, data }) => {
        const { token, userId, unionId } = data;
        this.$store.dispatch('fetchToken', { token });

        // 已经绑定
        if (userId) {
          this.$store.dispatch('fetchUser', { user: { userId } });
          this.$router.push(this.next || '/');
        }
        // 尚未绑定
        else {
          // 防止刷新 缓存起来
          sessionStorage.setItem('unionId', unionId);

          // 跳转绑定
          this.$router.push({
            path: this.$prelang('login'),
            query: { next: this.next },
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.view {
  min-height: 100vh;
  background: #fff;
}
</style>
