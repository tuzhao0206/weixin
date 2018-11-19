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

      <div class="productsChoose list" v-for="(productObj, i) in productData" :key="i">
        <div class="item title" :class="{ active: productObj.active }" @click="chooseSection(i);">
          <span>{{ productObj.name }}</span> <i class="icon">&#xe60b;</i>
        </div>

        <template v-for="(product, j) in productObj.productArray">
          <div class="item content" :key="j" :class="{ active: productObj.active }" @click="chooseProduct(i, j);">
            <input type="checkbox" />
            <p :class="{ active: product.active }">{{ product.name }}</p>
          </div>
        </template>
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

      productData: [
        {
          name: 'S9',
          productArray: [
            {
              id: 3584,
              name: '蚂蚁矿机S7-1C模组（N）4.455T',
              priceOneCredit: 10.89,
              productId: '00020180426221415240a4s8d6020628',
            },
            {
              id: 141,
              name: 'BB Board(for L3/L3+/L3++/D3/A3/X3)',
              priceOneCredit: 100,
              productId: '00020180206123029356l0P4OfW30651',
            },
          ],
        },
        {
          name: 'T9',
          productArray: [
            {
              id: 3584,
              name: '蚂蚁矿机T9',
              priceOneCredit: 10.89,
              productId: '00020180426221415240a4s8d6020627',
            },
          ],
        },
      ],
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
        this.productData = data.data;
      });
    },
    chooseSection(i) {
      if (!this.productData[i].active) {
        this.$set(this.productData[i], `active`, true);
      } else {
        this.$set(this.productData[i], `active`, false);
      }
    },
    chooseProduct(i, j) {
      if (!this.productData[i].productArray[j].active) {
        this.$set(this.productData[i].productArray[j], `active`, true);
      } else {
        this.$set(this.productData[i].productArray[j], `active`, false);
      }
      this.$store.commit('repair/home/changeProductData', { productData: this.productData });
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

    i {
      transition: all ease 0.4s;
    }

    &.active {
      i {
        transform: rotate(180deg);
      }
    }
  }
  div.item.content {
    display: flex;
    padding-left: 32px;
    position: relative;

    display: none;

    &.active {
      display: block;
    }
    input {
      -webkit-appearance: none;
      border: none;
      bottom: 0;
      height: 16px;
      margin: auto 0;
      opacity: 0;
      position: absolute;
      text-align: center;
      top: 0;
      width: 16px;
    }
    p {
      background-image: url('./cart-choose-icon-not-pressed.svg');
      background-position: 0;
      background-repeat: no-repeat;
      padding-left: 30px;
      transition: all 0.4s;
      word-break: break-all;
    }
    p.active {
      background-image: url('./cart-choose-icon-pressed.svg');
    }
  }
}
</style>
