<template>
  <ex-view class="login">
    <ex-header title="绑定微信">
      <ex-title/>
    </ex-header>
    <ex-content>
      <div class="list compact overlap">
        <div class="item">
          <div class="text text-gray">首次登陆需要将您的账户与微信进行绑定</div>
        </div>
        <label class="item thread" ui-mode="input">
          <div class="label">
            <span>邮箱:</span>
          </div>
          <input
            class="input"
            type="email"
            v-model.trim="username"
            maxlength="50"
            placeholder="请输入邮箱"
          >
        </label>
        <label class="item" ui-mode="input">
          <div class="label">
            <span>密码:</span>
          </div>
          <input
            class="input"
            type="password"
            v-model="password"
            maxlength="50"
            placeholder="请输入密码"
          >
        </label>
      </div>

      <ex-space space="40px 15px 20px">
        <button class="button primary" :loading="processing" @click="submit">登录</button>
      </ex-space>

      <ex-space space="20px">
        <a class="button plain-primary" hrer="https://account.bitmain.com/sign_up">注册</a>
      </ex-space>
    </ex-content>
  </ex-view>
</template>
<script>
import axios from 'axios';
import { parseQuery } from '../../utils/helper';
export default {
  data() {
    return {
      username: '',
      password: '',
      unionId: sessionStorage.getItem('unionId'),
      processing: false,
    };
  },
  methods: {
    submit() {
      const regexp = /^[a-zA-Z0-9_\-.+]+@[a-zA-Z0-9_\-]+(\.[a-zA-Z0-9_\-]+)+$/;
      if (!regexp.test(this.username)) {
        return this.$message('请输入正确的邮箱');
      }
      if (!this.password) {
        return this.$message('请输入密码');
      }

      this.processing = true;
      axios
        .post('/api/weChat/weChatLogin', {
          username: this.username,
          password: this.password,
          unionId: this.unionId,
        })
        .then(({ code, data }) => {
          const { next } = parseQuery();
          const { token, userId } = data;
          this.$store.dispatch('fetchToken', { token });
          this.$store.dispatch('fetchUser', { user: { userId } });
          this.$router.push(next || '/');
        })
        .finally(() => {
          this.processing = false;
        });
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  background: #fff;
  min-height: 100vh;
}
</style>
