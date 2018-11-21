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
        <div class="item"><div class="text text-sm">Step1：请选择您需要维修的机器型号和数量</div></div>
        <div class="item">
          <div class="text">
            <ex-space space="10px">
              <button class="button plain-primary" @click="addEquipment"><span>手动添加维修设备</span></button>
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
              <div class="text text-sm not-break">{{ product.priceOneCredit }}</div>
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
          </div>
        </div>
      </div>
    </ex-content>

    <!-- @DONE 点击下一步的时候进行多余数据的过滤 -->
    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="nextStep();">下一步</button>
    </ex-footer>

    <ex-modal :show="confirmDeleteModal" class="confirmDelete">
      <div class="content"><p>设备数量小于 1 将被删除，请确认是否删除？</p></div>
      <footer class="footer">
        <div class="button cancel" @click="confirmDeleteModal = false;">取消</div>
        <div class="button delete" @click="deleteProduct();">删除</div>
      </footer>
    </ex-modal>
  </ex-view>
</template>
<script>
// @DONE 为什么number需要set而active不用，set之后还要继续set么 => set之后就完成了数据的监听
import axios from 'axios';
import HOSTS from '../../../env.config';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      // productData: this.$store.state.repair.equipment.productData,
      submitData: [],

      confirmDeleteModal: false,
      index: [],

      type: this.$route.query.type,

      duifaAmount: 0,
      usedAmount: 0,
    };
  },
  mounted() {
    //获取授信信息
    if (this.type === '2') {
      const url = `${HOSTS.REPAIR}/api/repairCredit/getCredit`;
      let that = this;
      axios.get(url).then(({ data }) => {
        that.duifaAmount = data[0].ablAmount + data[0].ablPledge;
      });
    }
  },
  computed: {
    ...mapState('repair/equipment', ['productData']),
  },
  watch: {
    productData: {
      handler: function(val, oldVal) {
        console.log(val);
      },
      // 深度观察
      deep: true,
    },
  },
  methods: {
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

      this.$store.commit('repair/equipment/changeProductData', { productData: this.productData });

      this.confirmDeleteModal = false;
    },
    changeProductNumber(i, j, m, number) {
      this.$set(this.productData[i].content[j].productArray[m], `number`, number);

      this.$store.commit('repair/equipment/changeProductData', { productData: this.productData });
    },
    nextStep() {
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

      console.log(this.submitData);
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
div.confirmDelete {
  div.content {
    height: 80px;
    padding: 20px 30px 0 30px;
    text-align: left;
  }
  footer.footer {
    display: flex;
    height: 50px;
    div.button {
      width: 50%;
      line-height: 50px;
      padding: 0;
      margin: 0 !important;
      &.cancel {
        background-color: white;
        border-right: 1px solid @borderColor;
        color: @cancelgray;
      }
      &.delete {
        color: @blue;
      }
    }
  }
}
</style>
