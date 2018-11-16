<template>
  <ul class="uploader clearfix">
    <li v-for="(item, index) in list" :key="index">
      <span :style="{ backgroundImage: `url(https://file11.bitmain.com/${item})` }"></span>
      <i class="icon" @click="handleRemove(index);">&#xe61f;</i>
    </li>
    <li class="appender" @click="handleUpload" v-if="list.length < max"><span></span></li>
  </ul>
</template>
<script>
import Env from '../utils/env';
import JSBridge from '../utils/bridge';
export default {
  model: {
    prop: 'list',
    event: 'input',
  },
  props: {
    max: {
      type: Number,
      default: Infinity,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleUpload() {
      if (Env.is('app')) {
        JSBridge.upload(url => {
          this.list.push(url);
          this.$emit('input', this.list);
        });
      } else {
        // TODO
      }
    },
    handleRemove(index) {
      this.list.splice(index, 1);
      this.$emit('input', this.list);
    },
  },
};
</script>

<style lang="less" scoped>
@import '../less/base/fn.less';
.uploader {
  list-style: none;
  margin-left: -5px;
  margin-right: -5px;
  li {
    position: relative;
    float: left;
    width: 25%;
    padding: 5px;
    span {
      position: relative;
      display: block;
      width: 100%;
      padding-top: 100%;
      background: #ebebeb no-repeat center center;
      background-size: cover;
    }
    .icon {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      color: #888;
      background: #e3e3e3;
      border-radius: 50%;
      transform: translate(20%, -30%);
    }
    &.appender {
      span {
        background: #eaecf5;
        &:before,
        &:after {
          content: ' ';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #bbccc3;
          width: 2px;
          height: 24px;
        }
        &:after {
          height: 2px;
          width: 24px;
        }
      }
    }
  }
}
</style>
