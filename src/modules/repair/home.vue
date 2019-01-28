<template>
  <ex-view>
    <ex-header title="选择工单类型">
      <ex-title/>
    </ex-header>
    <ex-content>
      <ex-space space="20px 12px">
        <p class="text-sm">请选择维修服务类型</p>
      </ex-space>

      <ex-space space="12px">
        <div class="list compact round">
          <router-link class="item" :to="$prelang('repair/issue?type=0')">
            <div class="avatar">
              <img width="24" src="../../assets/images/image-01.png">
            </div>
            <div class="text">
              <ex-space space="15px 0">普通工单</ex-space>
            </div>
            <i class="icon text-gray">&#xe61a;</i>
          </router-link>
        </div>
      </ex-space>

      <ex-space space="12px">
        <div class="list compact round">
          <router-link class="item" :to="$prelang('repair/issue?type=1')">
            <div class="avatar">
              <img width="24" src="../../assets/images/image-02.png">
            </div>
            <div class="text">
              <ex-space space="15px 0">配件工单</ex-space>
            </div>
            <i class="icon text-gray">&#xe61a;</i>
          </router-link>
        </div>
      </ex-space>

      <ex-space space="12px" v-if="balance > 0">
        <div class="list compact round">
          <router-link class="item" :to="$prelang('repair/issue?type=2')">
            <div class="avatar">
              <img width="24" src="../../assets/images/image-03.png">
            </div>
            <div class="text">
              <ex-space space="15px 0">对发工单</ex-space>
            </div>
            <i class="icon text-gray">&#xe61a;</i>
          </router-link>
        </div>
      </ex-space>
    </ex-content>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../env.config';
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      balance: 0,
    };
  },
  mounted() {
    // 重置数据
    this.setSelected({ selected: [] });
    // 对发权限
    const url = `${HOSTS.REPAIR}/api/repairCredit/getCredit`;
    axios.get(url, { cache: true, global: false }).then(({ data }) => {
      if (data[0] && data[0].ablAmount && data[0].ablPledge) {
        // 可用对发额度 = 授信可用余额 + 押金可用余额
        this.balance = data[0].ablAmount + data[0].ablPledge;
      }
    });
  },
  methods: {
    ...mapActions('repair', ['setSelected']),
  },
};
</script>

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
