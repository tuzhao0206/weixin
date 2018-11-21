<template>
  <ex-view>
    <ex-header title="添加维修设备">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title />
    </ex-header>

    <ex-content v-if="loading">
      <div class="list productList" :class="{ hide: type == 1 }">
        <div class="item productItem">
          <div>
            <p
              @click="
                activeProductType = 0;
                filterData();
              "
              :class="{ active: activeProductType == 0 }"
              v-if="type == 0 || type == 2"
            >
              整机列表
            </p>
            <p @click="getPeijian();" :class="{ active: activeProductType == 1 }">配件列表</p>
            <p @click="getWuliao();" :class="{ active: activeProductType == 2 }" v-if="type == 0 || type == 2">
              物料列表
            </p>
          </div>
        </div>
      </div>

      <div
        class="productsChoose list"
        v-for="(productObj, i) in filteredData"
        :key="activeProductType.toString() + '/' + i.toString()"
      >
        <div
          class="item title"
          :class="{ active: productObj.active, hide: productObj.name == 'all' }"
          @click="chooseSection(i);"
        >
          <span>{{ productObj.name }}</span
          ><i class="icon">&#xe60b;</i>
        </div>

        <template v-for="(product, j) in productObj.productArray">
          <div
            class="item content"
            :key="activeProductType.toString() + '/' + i.toString() + '/' + j.toString()"
            :class="{ active: productObj.active || productObj.name == 'all' }"
            @click="chooseProduct(i, j);"
          >
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
// @TODO 接口参传：普通工单、配件工单、对发工单
// @TODO 整机列表下，如果子类active都为false，次级父类自动折叠
// @DONE 用户不选择后自动置数量为1
export default {
  data() {
    return {
      activeProductType: 0, // 默认选中第一个（整机）

      productData: [],

      loading: false,

      type: this.$route.query.type,

      filteredData: [],
    };
  },
  mounted() {
    this.init();
    this.filterData();
  },
  methods: {
    async init() {
      if (this.$store.state.repair.equipment.productData.length == 0) {
        // 请求接口
        // ...
        console.log('请求接口');

        if (this.type === '0') {
          // 普通工单
          // 获取整机
          this.productData = [
            {
              name: '整机',
              content: [
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
                      id: 3583,
                      name: '蚂蚁矿机T9',
                      priceOneCredit: 10.89,
                      productId: '00020180426221415240a4s8d6020627',
                    },
                  ],
                },
              ],
            },
          ];

          // 获取配件
          // ..
          // 获取物料
          // ..
        } else if (this.type === '1') {
          // 配件工单
          this.getPeijian(1);
        } else if (this.type === '2') {
          // 对发工单
          // 获取整机
          this.productData = [
            {
              name: '整机',
              content: [
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
                      id: 3583,
                      name: '蚂蚁矿机T9',
                      priceOneCredit: 10.89,
                      productId: '00020180426221415240a4s8d6020627',
                    },
                  ],
                },
              ],
            },
          ];

          // 获取配件
          // ..
          // 获取物料
          // ..
        }
      } else {
        this.productData = this.$store.state.repair.equipment.productData;
        console.log('读取缓存');
      }

      this.loading = true;
    },
    async getProductList(deviceType, uncollectFlag) {
      const url = `${
        HOSTS.REPAIR
      }/api/productRepair/getByDeviceType?deviceType=${deviceType}&uncollectFlag=${uncollectFlag}`;
      let res = await axios.get(url);
      return res.data;
    },
    /*
     * 返回false代表没有找到需要的数据
     *
     */
    filterData() {
      for (let i = 0; i < this.productData.length; i++) {
        if (this.activeProductType == 0) {
          if (this.productData[i].name == '整机') {
            this.filteredData = this.productData[i].content;

            return true;
          }
        }

        if (this.activeProductType == 1) {
          if (this.productData[i].name == '配件') {
            this.filteredData = this.productData[i].content;

            return true;
          }
        }

        if (this.activeProductType == 2) {
          if (this.productData[i].name == '物料') {
            this.filteredData = this.productData[i].content;

            return true;
          }
        }
      }

      return false;
    },
    async getPeijian(uncollectFlag) {
      let tag = uncollectFlag || 0;

      this.activeProductType = 1;

      if (!this.filterData()) {
        let mainProductArray = [];
        let mainProductObject = {};

        mainProductArray = await this.getProductList(1, tag);

        mainProductObject = {
          name: '配件',
          content: [
            {
              name: 'all',
              productArray: mainProductArray,
            },
          ],
        };

        this.productData.push(mainProductObject);
      }

      this.filterData();
    },
    async getWuliao() {
      this.activeProductType = 2;

      if (!this.filterData()) {
        let mainProductArray = [];
        let mainProductObject = {};

        mainProductArray = await this.getProductList(2, 0);

        mainProductObject = {
          name: '物料',
          content: [
            {
              name: 'all',
              productArray: mainProductArray,
            },
          ],
        };

        this.productData.push(mainProductObject);
      }

      this.filterData();
    },
    chooseSection(i) {
      if (!this.productData[this.activeProductType].content[i].active) {
        this.$set(this.productData[this.activeProductType].content[i], `active`, true);
      } else {
        this.$set(this.productData[this.activeProductType].content[i], `active`, false);
      }
      //      this.$store.commit('repair/equipment/changeProductData', { productData: this.productData });
    },
    chooseProduct(i, j) {
      if (!this.productData[this.activeProductType].content[i].productArray[j].active) {
        this.$set(this.productData[this.activeProductType].content[i].productArray[j], `active`, true);
      } else {
        this.$set(this.productData[this.activeProductType].content[i].productArray[j], `active`, false);
        this.$set(this.productData[this.activeProductType].content[i].productArray[j], `number`, 1);
      }
      this.$store.commit('repair/equipment/changeProductData', { productData: this.productData });
    },
    returnToChoosePage() {
      this.$router.push({ path: this.$prelang('repair/choose'), query: { type: this.type } });
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../../less/base/variable/color.less';
div.list.productList {
  margin: 0;
  &.hide {
    display: none;
  }
  div.item.productItem {
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
    &.hide {
      display: none;
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
