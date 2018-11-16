<template>
  <div :class="$style.wrap"><div id="__slider_verify__"></div></div>
</template>
<script>
import loadjs from 'loadjs';
export default {
  props: {
    callback: {
      type: Function,
      required: true,
    },
  },
  mounted() {
    loadjs('https://aeis.alicdn.com/sd/nch5/index.js?t=2015052012', () => {
      this.$nextTick(() => {
        const nc_token = ['CF_APP_1', new Date().getTime(), Math.random()].join(':');
        const scene = this.$i18n.locale === 'zh' ? 'nc_login' : 'login_us';
        const appkey = 'LQYI';
        const nc = window.NoCaptcha.init({
          renderTo: '#__slider_verify__',
          appkey: appkey,
          scene: scene,
          foreign: this.$i18n.locale === 'zh' ? '' : 1,
          token: nc_token,
          trans: { key1: 'code200' },
          elementID: ['usernameID'],
          is_Opt: 0,
          language: this.$i18n.locale === 'zh' ? 'cn' : 'en',
          timeout: 10000,
          retryTimes: 5,
          errorTimes: 5,
          inline: false,
          apimap: {
            // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
            // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
          },
          bannerHidden: false,
          initHidden: false,
          callback: data => {
            data.token = nc_token;
            data.scene = scene;
            data.appkey = appkey;
            this.callback(data);
          },
          error: function(s) {},
        });
        window.NoCaptcha.setEnabled(true);
        nc.reset(); //请务必确保这里调用一次reset()方法
      });
    });
  },
};
</script>
<style lang="less" module>
@size: 45px;
:local(.wrap) {
  width: 100%;
  height: @size;
  ._nc .stage1 {
    height: @size;
  }
  ._nc .stage1 .slider {
    height: @size;
    border-radius: 26px;
    box-shadow: 0 0 3px #999;
    background-color: #ddd;
  }
  /* 滑动条 */
  ._nc .stage1 .track div {
    border-radius: 26px;
    color: #fff;
  }
  /* 滑动条背景色-正常 */
  ._nc .stage1 .bg-green {
    background-color: #2ec051;
  }
  /* 滑动条背景色-失败 */
  ._nc .stage1 .bg-red {
    background-color: #e74949;
  }
  ._nc .stage1 .track div,
  ._nc .stage1 .label {
    height: @size;
    line-height: @size;
  }
  ._nc .stage1 .button {
    width: @size;
    height: @size;
    border-radius: 50%;
  }
  ._nc .icon-ok {
    color: #2ec051;
  }
  ._nc .stage1 .icon {
    left: 8px;
    top: -1px;
    bottom: 0 !important;
  }
}
</style>
