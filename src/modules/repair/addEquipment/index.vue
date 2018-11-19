<template>
  <ex-view>
    <ex-header title="添加维修设备">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title />
    </ex-header>

    <ex-content>
      <div class="list productType">
        <div class="item productType">
          <div>
            <p @click="activeProductType = 1;" :class="{ active: activeProductType == 1 }">整机列表</p>
            <p @click="activeProductType = 2;" :class="{ active: activeProductType == 2 }">配件列表</p>
            <p @click="activeProductType = 3;" :class="{ active: activeProductType == 3 }">物料列表</p>
          </div>
        </div>
      </div>

      <div class="productsChoose list">
        <div class="item title" @click=""><span>S9</span> <i class="icon">&#xe60b;</i></div>

        <div class="item"><input type="checkbox" />蚂蚁矿机1</div>
        <div class="item"><input type="checkbox" />蚂蚁矿机2</div>

        <div class="item"><p>T9</p></div>
        <div class="item"><p>Power Supply</p></div>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="returnToChoosePage();">完成</button>
    </ex-footer>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../../env.config';
export default {
  data() {
    return {
      activeProductType: 1,
      productSubtype: 0,

      productDataArray: [],
      activeValue3: 2,
    };
  },
  mounted() {},
  methods: {
    returnToChoosePage() {
      this.$router.push({ path: this.$prelang('repair/choose') });
    },
    getProductList(deviceType, uncollectFlag) {
      const url = `${
        HOSTS.REPAIR
      }/api/productRepair/getByDeviceType?deviceType=${deviceType}&uncollectFlag=${uncollectFlag}`;
      axios.get(url).then(({ data }) => {
        this.productDataArray = data.data;
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../../less/base/variable/color.less';
div.list.productType {
  margin: 0;
  div.item.productType {
    padding: 0;
    > div {
      margin: 0 auto;
      height: 50px;
      p {
        display: inline-block;
        width: 100px;

        line-height: 50px;
        text-align: center;
      }
      p.active {
        box-shadow: inset 0 -3px 0 @blue;
      }
    }
  }
}
div.list.productsChoose {
  margin: 0;
  div.item.title {
    display: flex;
    justify-content: space-between;
  }
}
</style>
