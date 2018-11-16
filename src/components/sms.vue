<template>
  <button class="button inline sm plain-primary" :disabled="counter !== 0" @click="handleClick">
    <slot v-if="counter === 0">发送验证码</slot> <span v-if="counter !== 0">{{ formatter(counter) }}</span>
  </button>
</template>
<script>
export default {
  props: {
    seconds: {
      type: Number,
      default: 60,
    },
    formatter: {
      type: Function,
      default: n => n + 's',
    },
    callback: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      counter: 0,
    };
  },
  methods: {
    handleClick() {
      if (this.counter <= 0) {
        // 兼容callback返回Promise
        const promise = this.callback();
        if (promise && typeof promise.then === 'function') {
          promise.then(() => {
            this.handleCounter();
          });
        } else {
          this.handleCounter();
        }
      }
    },
    handleCounter() {
      clearInterval(this.timer);
      const start = Date.now();
      const seconds = (this.counter = this.seconds - 1);
      this.timer = setInterval(() => {
        this.counter = Math.max(0, seconds - Math.floor((Date.now() - start) / 1000));
        if (this.counter === 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="less" scoped>
.button {
  min-width: 90px;
}
</style>
