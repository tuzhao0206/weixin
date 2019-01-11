<template>
  <ex-view class="view">
    <ex-header title="提交失败">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title />
    </ex-header>

    <ex-content>
      <div class="feedback">
        <div class="mark"><i class="icon">&#xe6a0;</i></div>
        <h3 class="title">工单提交失败！</h3>
        <div class="describe">请重新编辑或联系售后客户处理。</div>
      </div>
      <div class="vspace hspace">
        <router-link class="button plain-warning" :to="$prelang('repair')">返回</router-link>
      </div>
    </ex-content>
  </ex-view>
</template>
<style lang="less" scoped>
@import '../../less/base/fn.less';
.view {
  background: #fff;
  min-height: 100vh;
  .feedback .icon {
    color: @red;
  }
}
</style>
