<template>
  <ex-view class="view">
    <ex-header title="提交成功">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content>
      <div class="feedback">
        <div class="mark">
          <i class="icon">&#xe696;</i>
        </div>
        <h3 class="title">工单已提交</h3>
        <div class="describe">请尽快将维修设备寄到维修点，我们将在收到您的包裹后尽快安排检测维修。</div>
      </div>
      <div class="vspace hspace">
        <router-link class="button plain-success" :to="$prelang('repair')">返回</router-link>
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
    color: @green;
  }
}
</style>


