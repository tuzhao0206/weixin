<template>
  <ex-view>
    <ex-header :title="title">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content>
      <!-- 配件工单 -->
      <div class="list compact overlap" v-if="type === 1">
        <div class="item text-sm">
          <div class="text text-warning">此工单为特殊工单需审核，审核通过后，我们将根据以下设备信息发货。创建工单后请将工单ID通过微信公众号发送给我们审核。</div>
        </div>
      </div>
      <!-- 对发工单 -->
      <div class="list compact overlap" v-if="type === 2">
        <div class="item text-sm">
          <div class="text">
            <ex-space space="10px 0">
              <div class="text-justify">
                <span class="label">可用对发额度</span>
                <span class="value text-right text-primary">{{ balance | currency }}</span>
              </div>
              <div class="text-justify">
                <span class="label">本工单扣除额度</span>
                <span class="value text-right text-primary">{{ amount | currency }}</span>
              </div>
            </ex-space>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="item">
          <div class="text text-sm">请选择您需要维修的机器型号和数量</div>
        </div>

        <div class="item thread">
          <div class="text">
            <ex-space space="10px">
              <router-link
                class="button plain-primary"
                :to="{ path: $prelang('repair/choose'), query: { type } }"
              >
                <span>+ 添加维修设备</span>
              </router-link>
            </ex-space>
          </div>
        </div>

        <div class="item">
          <div class="text text-sm">
            <p>设备名称：</p>
          </div>
        </div>
        <div class="item thread" v-if="selected.length === 0">
          <div class="text">
            <ex-space space="50px 0">
              <p class="text-center text-gray text-sm">- 您还没有添加任何设备 -</p>
            </ex-space>
          </div>
        </div>
        <div class="item thread text-sm" v-for="item in selected" :key="item.id">
          <div
            class="tag"
            :class="{ success: item.type === 1, driving: item.type === 2 }"
          >{{ item.type | deviceType }}</div>
          <div class="text">{{ item.name }}</div>
          <div class="extra">
            <ex-stepper
              :value="item.count || 1"
              :min="1"
              :max="500"
              @prompt="prompt($event, item);"
              @change="change($event, item);"
            />
          </div>
        </div>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="next();" v-if="!ticketId">下一步</button>
      <button class="button primary square" v-if="ticketId" @click="updateRepair">完成</button>
    </ex-footer>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../env.config';
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      // 普通工单:0 配件工单:1 对发工单:2
      type: Number(this.$route.query.type),
      balance: 0,
      submitData: [],
    };
  },
  computed: {
    ...mapState('repair', ['ticketId', 'selected']),
    // 计算所选商品的授信金额
    amount() {
      return this.selected.reduce((total, item) => total + item.count * item.priceOneCredit, 0);
    },
    title() {
      return this.ticketId ? '编辑维修设备' : '添加维修设备';
    },
  },
  mounted() {
    // 设置基础信息
    this.setBasis({ ticketType: this.type, ticketId: this.$route.params.id });

    // 获取授信信息
    if (this.type === 2) {
      const url = `${HOSTS.REPAIR}/api/repairCredit/getCredit`;
      axios.get(url, { cache: true }).then(({ data }) => {
        if (data[0] && data[0].ablAmount && data[0].ablPledge) {
          // 可用对发额度 = 授信可用余额 + 押金可用余额
          this.balance = data[0].ablAmount + data[0].ablPledge;
        }
      });
    }
    // 编辑工单的设备
    if (this.ticketId && this.selected.length === 0) {
      // 设备列表
      const url = `${HOSTS.REPAIR}/api/repairLine/repairLineList`;
      const params = { repairId: this.ticketId };
      axios.get(url, { params }).then(({ data }) => {
        this.setSelected({
          selected: data.map(item => {
            return {
              id: item.id,
              count: item.productCount,
              name: item.productName,
              priceOneCredit: item.priceOneCredit,
              productId: item.productId,
              type: +item.type,
            };
          }),
        });
      });
    }
  },
  filters: {
    deviceType(type) {
      const types = ['整机', '配件', '物料'];
      return types[type];
    },
  },
  methods: {
    ...mapActions('repair', ['setSelected', 'setBasis']),
    ...mapActions('repair/tickets', ['setTickets']),
    // 移除配件
    prompt(count, target) {
      this.$confirm({
        message: `设备数量小于 1 将被删除，请确认是否删除？`,
        callback: () => {
          const selected = this.selected.filter(item => item.id !== target.id);
          this.setSelected({ selected });
        },
      });
    },
    // 更改数量
    change(count, target) {
      if (target.count !== count) {
        target.count = count;
        this.setSelected({ selected: this.selected });
      }
    },
    next() {
      if (this.selected.length === 0) {
        return this.$message('请添加维修设备');
      }
      // 校验余额是否大于本次需用
      if (this.type === 2) {
        if (this.balance < this.amount) {
          return this.$message('对发可用余额不足');
        }
      }
      this.$router.push({ path: this.$prelang('repair/address') });
    },

    // 更新设备 - 编辑工单
    updateRepair() {
      const url = `${HOSTS.REPAIR}/api/repairLine/batchSaveRepairLine`;
      return axios
        .post(url, {
          dtype: this.type !== 1 ? '0' : '1', // 工单类型 0:普通工单 1:配件工单
          repairId: this.ticketId,
          repairLine: this.selected.map(item => ({
            productId: item.productId,
            productCount: item.count,
          })),
        })
        .then(() => {
          // 清空工单列表记录
          this.setTickets({ list: [] });
          this.$router.push(this.$prelang(`repair/success`));
        });
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../less/base/fn.less';
div.item {
  div.tag {
    padding: 4px 5px;
    border-radius: 2px;
    font-size: 12px;
    margin-right: 5px;
    line-height: 1;
    color: #fff;
    background-color: @blue;

    &.success {
      background-color: @green;
    }
    &.driving {
      background-color: @orange;
    }
  }
}
</style>
