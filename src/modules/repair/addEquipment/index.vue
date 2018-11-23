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
              v-show="type == 0 || type == 2"
            >
              整机列表
            </p>
            <p @click="getPeijian();" :class="{ active: activeProductType == 1 }">配件列表</p>
            <p @click="getWuliao();" :class="{ active: activeProductType == 2 }" v-show="type == 0 || type == 2">
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
// @DONE 接口参传：普通工单、配件工单、对发工单
// @TODO-RC 整机列表下，如果子类active都为false，次级父类自动折叠
// @TODO-RC 修改getPeijian()和getWuliao()等接口，降低逻辑重复; filterData()多次调用了
// @DONE 用户不选择后自动置数量为1
export default {
  data() {
    return {
      activeProductType: this.$route.query.type == 1 ? 1 : 0,

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
    init() {
      if (this.$store.state.repair.equipment.productData.length == 0) {
        if (this.type === '0') {
          // 整机类型
          this.getZhengjiType();
        } else if (this.type === '1') {
          // 配件工单
          this.getPeijian(1);
        } else if (this.type === '2') {
          // 整机类型
          this.getZhengjiType();
        }
      } else {
        this.productData = this.$store.state.repair.equipment.productData;
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
     * 这个函数是为了可以让用户随意点：整机，物料，配件
     *
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
    async getZhengjiType() {
      const url = `${HOSTS.REPAIR}/api/productRepair/getByDeviceType?deviceType=0&categoryFlag=1`;
      let that = this;
      axios.get(url).then(({ data }) => {
        let mainProductObject = {
          name: '整机',
          content: [],
        };

        for (let i = 0; i < data.length; i++) {
          mainProductObject.content.push({
            name: data[i].productCategory,
            productArray: [],
          });
        }

        that.productData.push(mainProductObject);

        that.filterData();
      });
    },
    // 防止用户点得频繁
    async getZhengji(i) {
      let name = this.productData[this.activeProductType].content[i].name;

      if (this.productData[this.activeProductType].content[i].productArray.length == 0) {
        const url = `${HOSTS.REPAIR}/api/productRepair/getByCategory?deviceType=0&productCategory=${name}`;
        let res = await axios.get(url);

        this.productData[this.activeProductType].content[i].productArray = res.data;

        this.filterData();
      }
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

      this.getZhengji(i);
    },
    chooseProduct(i, j) {
      let specialType = this.activeProductType;
      if (this.type === '1') {
        specialType = 0;
      }
      if (!this.productData[specialType].content[i].productArray[j].active) {
        this.$set(this.productData[specialType].content[i].productArray[j], `active`, true);
      } else {
        this.$set(this.productData[specialType].content[i].productArray[j], `active`, false);
        this.$set(this.productData[specialType].content[i].productArray[j], `number`, 1);
      }
      this.$store.commit('repair/equipment/changeProductData', { productData: this.productData });
    },
    returnToChoosePage() {
      this.$router.push({ path: this.$prelang('repair/editEquipment'), query: { type: this.type } });
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
