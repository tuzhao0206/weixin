<template>
  <ex-view>
    <ex-header title="添加维修设备">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title></ex-title>
    </ex-header>

    <ex-content>
      <div class="list duifa" v-if="type == 2">
        <div class="item">
          <p>
            <span>可用对发额度</span><span class="blue">¥{{ duifaAmount }}</span>
          </p>
          <p>
            <span>本工单扣除额度</span><span class="blue">¥{{ usedAmount }}</span>
          </p>
        </div>
      </div>

      <div class="list">
        <div class="item title"><div class="text text-sm">Step1：请选择您需要维修的机器型号和数量</div></div>

        <div class="item addProduct specialBorder">
          <div class="text">
            <ex-space space="10px">
              <button class="button plain-primary" @click="addEquipment"><span>手动添加维修设备</span></button>
            </ex-space>
            <ex-space space="10px">
              <button class="button primary"><i class="icon">&#xe614;</i> <span>扫码添加</span></button>
            </ex-space>
          </div>
        </div>

        <div class="item title specialBorder-dotted" id="equipmentName">
          <div class="text text-sm">
            <p class="subTitle">设备名称：</p>
            <div class="message" v-if="productData.length == 0"><p>- 您还没有添加任何设备 -</p></div>
          </div>
        </div>

        <template v-if="productData.length !== 0" v-for="(item, i) in productData">
          <template v-for="(productObj, j) in item.content">
            <div
              v-for="(product, m) in productObj.productArray"
              :key="i + '/' + j + '/' + m"
              v-if="product.active"
              class="item equipment"
            >
              <div class="tag" :class="{ peijian: item.name == '配件', wuliao: item.name == '物料' }">
                {{ item.name }}
              </div>
              <div class="text text-sm not-break">{{ product.name }}</div>
              <div class="extra">
                <ex-stepper
                  @data-should-be-deleted="showDeleteProductModal(i, j, m);"
                  @change="changeProductNumber(i, j, m, $event);"
                  :value="product.number || 1"
                  :min="1"
                  :max="500"
                ></ex-stepper>
              </div>
            </div>
          </template>
        </template>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="nextStep();">下一步</button>
    </ex-footer>

    <ex-modal :show="confirmDeleteModal" class="confirmDelete">
      <div class="content"><p>设备数量小于 1 将被删除，请确认是否删除？</p></div>
      <footer class="footer">
        <div class="button cancel" @click="confirmDeleteModal = false;">取消</div>
        <div class="button confirm" @click="deleteProduct();">删除</div>
      </footer>
    </ex-modal>

    <ex-modal :show="errorMessageModal" class="errorMessage">
      <div class="content"><p>对发可用余额不足，请调整您的设备。</p></div>
      <footer class="footer"><div class="button confirm" @click="errorMessageModal = false;">确认</div></footer>
    </ex-modal>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../../env.config';
import { mapState } from 'vuex';
import NP from 'number-precision';
export default {
  data() {
    return {
      submitData: [],

      confirmDeleteModal: false,
      errorMessageModal: false,

      index: [],

      type: this.$route.query.type,

      duifaAmount: 0,
      usedAmount: 0,
    };
  },
  computed: {
    ...mapState('repair/equipment', ['productData']),
  },
  mounted() {
    //获取授信信息
    if (this.type === '2') {
      const url = `${HOSTS.REPAIR}/api/repairCredit/getCredit`;
      let that = this;
      axios.get(url).then(({ data }) => {
        that.duifaAmount = data[0].ablAmount + data[0].ablPledge;

        this.usedAmount = this.getUsedAmount(this.productData);
      });
    }
  },
  methods: {
    getUsedAmount(val) {
      let total = 0;
      if (this.type == 2) {
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < val[i].content.length; j++) {
            for (let m = 0; m < val[i].content[j].productArray.length; m++) {
              if (val[i].content[j].productArray[m].active == true) {
                if (!val[i].content[j].productArray[m].number) {
                  val[i].content[j].productArray[m].number = 1;
                }
                total = NP.plus(
                  total,
                  NP.times(val[i].content[j].productArray[m].number, val[i].content[j].productArray[m].priceOneCredit)
                );
              }
            }
          }
        }
      }
      return total;
    },
    addEquipment() {
      this.$router.push({ path: this.$prelang('repair/addEquipment'), query: { type: this.type } });
    },
    showDeleteProductModal(i, j, m) {
      this.confirmDeleteModal = true;

      this.index = [i, j, m];
    },
    deleteProduct() {
      // active为false
      // number为0和1都可(目前为1)

      let i = this.index[0];
      let j = this.index[1];
      let m = this.index[2];

      this.productData[i].content[j].productArray[m].active = false;
      //this.productData[i].content[j].productArray[m].number = 0;
      this.usedAmount = this.getUsedAmount(this.productData);

      this.$store.commit('repair/equipment/changeProductData', { productData: this.productData });

      this.confirmDeleteModal = false;
    },
    changeProductNumber(i, j, m, number) {
      this.$set(this.productData[i].content[j].productArray[m], `number`, number);
      this.usedAmount = this.getUsedAmount(this.productData);

      this.$store.commit('repair/equipment/changeProductData', { productData: this.productData });
    },
    nextStep() {
      // 校验余额是否大于本次需用
      if (this.type == 2) {
        if (this.duifaAmount < this.usedAmount) {
          this.errorMessageModal = true;

          return false;
        }
      }

      // 计算
      for (let i = 0; i < this.productData.length; i++) {
        for (let j = 0; j < this.productData[i].content.length; j++) {
          for (let m = 0; m < this.productData[i].content[j].productArray.length; m++) {
            if (this.productData[i].content[j].productArray[m].active == true) {
              if (!this.productData[i].content[j].productArray[m].number) {
                this.productData[i].content[j].productArray[m].number = 1;
              }
              this.submitData.push(this.productData[i].content[j].productArray[m]);
            }
          }
        }
      }

      // 赋值
      this.$store.commit('repair/equipment/changeSubmitData', { submitData: this.submitData });
      this.$store.commit('repair/equipment/changeType', { type: this.type });

      // 跳转
      this.$router.push({ path: this.$prelang('repair/addLocation') });
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../../less/base/variable/color.less';
div.list.duifa {
  div.item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    p {
      display: flex;
      width: 100%;
      justify-content: space-between;

      font-size: 14px;
      color: @lightBlack;
      span.blue {
        color: @blue;
      }
    }
  }
}
div.addProduct {
  background-color: white;
}
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
  p.subTitle {
    color: @lightBlack;
  }
  div.message {
    height: 150px;
    color: @lighterBlack;
    padding-top: 50px;
    p {
      text-align: center;
      font-size: 12px;

      opacity: 0.4;
    }
  }
}
div.confirmDelete,
div.errorMessage {
  div.content {
    height: 80px;
    padding: 20px 30px 0 30px;
    text-align: left;
  }
  footer.footer {
    display: flex;
    height: 50px;
    div.button {
      min-width: 50%;
      line-height: 50px;
      padding: 0;
      margin: 0 !important;
      &.cancel {
        background-color: white;
        border-right: 1px solid @borderColor;
        color: @cancelgray;
      }
      &.confirm {
        color: @blue;
      }
    }
  }
}
div.equipment {
  &:before {
    border-top-width: 0;
    border-bottom: 1px solid #e5e5e5;
    top: 52px;
  }
}
div.equipment:nth-last-of-type(1) {
  border-bottom-width: 0;
}
div#equipmentName {
  padding-bottom: 0;
}
</style>
