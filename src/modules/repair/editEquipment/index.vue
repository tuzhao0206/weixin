<template>
  <ex-view>
    <ex-header title="添加维修设备">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title />
    </ex-header>

    <ex-content>
      <div class="list">
        <div class="item"><div class="text text-sm">Step1：请选择您需要维修的机器型号和数量</div></div>
        <div class="item">
          <div class="text">
            <ex-space space="10px">
              <button class="button plain-primary" @click="addEquipment();"><span>手动添加维修设备</span></button>
            </ex-space>
            <ex-space space="10px">
              <button class="button primary"><i class="icon">&#xe614;</i> <span>扫码添加</span></button>
            </ex-space>
          </div>
        </div>
      </div>
      <div class="list">
        <div class="item"><div class="text text-sm">设备名称：</div></div>
        <div class="item" v-for="(item, index) in [1, 2]" :key="index">
          <div class="text text-sm">蚂蚁矿机S7-1G模组（N）5</div>
          <div class="extra"><ex-stepper :min="1" /></div>
        </div>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed"> <button class="button primary square">下一步</button> </ex-footer>
  </ex-view>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    addEquipment() {
      this.$router.push({ path: this.$prelang('repair/addEquipment') });
    },
  },
};
</script>
<style lang="less" scoped></style>
