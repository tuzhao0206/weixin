<template>
  <ex-view>
    <ex-header title="添加维修设备">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title></ex-title>
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
        <div v-for="(item, i) in productData" :key="i">
          <div v-for="(productObj, j) in item.content" :key="j">
            <div v-for="(product, m) in productObj.productArray" :key="m" v-if="product.active" class="item">
              <div class="tag" :class="{ peijian: item.name == '配件', wuliao: item.name == '物料' }">
                {{ item.name }}
              </div>
              <div class="text text-sm not-break">{{ product.name }}</div>
              <div class="extra">
                <ex-stepper
                  @data-should-be-deleted="deleteProduct(i, j, m);"
                  @change="changeProductNumber(i, j, m, $event);"
                  :value="product.number || 1"
                  :min="1"
                  :max="500"
                ></ex-stepper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ex-content>

    <!-- @TODO 点击下一步的时候进行多余数据的过滤 -->
    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="nextStep();">下一步</button>
    </ex-footer>
  </ex-view>
</template>
<script>
export default {
  data() {
    return {
      productData: this.$store.state.repair.home.productData,
    };
  },
  methods: {
    addEquipment() {
      this.$router.push({ path: this.$prelang('repair/addEquipment') });
    },
    deleteProduct(i, j, m) {
      // active为false
      // number为1
      // ..
      if (confirm('delete?')) {
        this.productData[i].content[j].productArray[m].active = false;

        this.$store.commit('repair/home/changeProductData', { productData: this.productData });
      }
    },
    changeProductNumber(i, j, m, number) {
      this.$set(this.productData[i].content[j].productArray[m], `number`, number);

      this.$store.commit('repair/home/changeProductData', { productData: this.productData });
    },
    nextStep() {},
  },
};
</script>
<style lang="less" scoped>
@import '../../../less/base/variable/color.less';
div.item {
  div.tag {
    height: 16px;
    padding: 0 5px;
    margin-right: 5px;
    border-radius: 2px;
    font-size: 12px;
    line-height: 16px;

    background-color: @blue;
    color: white;

    &.peijian {
      background-color: @green;
    }
    &.wuliao {
      background-color: @orange;
    }
  }
  div.not-break {
    display: inline-block;
    margin-right: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
