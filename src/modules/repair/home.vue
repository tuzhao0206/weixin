<template>
  <ex-view>
    <ex-header title="选择工单类型"> <ex-title /> </ex-header>
    <ex-content>
      <ex-space space="20px 12px"> <p class="text-sm">请选择维修服务类型</p> </ex-space>

      <ex-space space="12px">
        <div class="list compact round">
          <router-link class="item" :to="$prelang('repair/issue?type=0')">
            <div class="avatar"><img width="30" src="../../assets/images/image-01.png" /></div>
            <div class="text"><ex-space space="15px 0">普通工单</ex-space></div>
            <i class="icon text-gray">&#xe61a;</i>
          </router-link>
        </div>
      </ex-space>

      <ex-space space="12px">
        <div class="list compact round">
          <router-link class="item" :to="$prelang('repair/issue?type=1')">
            <div class="avatar"><img width="30" src="../../assets/images/image-02.png" /></div>
            <div class="text"><ex-space space="15px 0">配件工单</ex-space></div>
            <i class="icon text-gray">&#xe61a;</i>
          </router-link>
        </div>
      </ex-space>

      <ex-space space="12px">
        <div class="list compact round">
          <router-link class="item" :to="$prelang('repair/issue?type=2')">
            <div class="avatar"><img width="30" src="../../assets/images/image-03.png" /></div>
            <div class="text"><ex-space space="15px 0">对发工单</ex-space></div>
            <i class="icon text-gray">&#xe61a;</i>
          </router-link>
        </div>
      </ex-space>
    </ex-content>
  </ex-view>
</template>
<style lang="less" scoped>
.list.round {
  border-radius: 4px;
  overflow: hidden;
  & > .item {
    &:before,
    &:after {
      content: none;
    }
  }
}
</style>
