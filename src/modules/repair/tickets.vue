<template>
  <div class="ticket-list">
    <ex-header title="工单列表">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content>
      <ex-loader
        :url="url"
        :list="list"
        :transform="transform"
        :callback="callback"
        pname="currentPage"
        sname="pageSize"
      >
        <router-link
          tag="div"
          class="list text-sm"
          v-for="item in list"
          :key="item.repairId"
          :to="$prelang(`repair/details/${item.repairId}`)"
        >
          <div class="item">
            <div class="text text-ellipsis text-darkgray">{{ item.type | type }}</div>
            <div
              class="extra"
              :class="{'text-primary': item.status != 2}"
            >{{ item.status | status }}</div>
          </div>
          <div class="item">
            <div class="text">
              <ex-space space="5px 0">
                <div class="text-justify">
                  <span class="label">运单号:</span>
                  <span class="value">{{ item.waybillNumber || '暂无' }}</span>
                </div>
                <div class="text-justify">
                  <span class="label">工单ID:</span>
                  <span class="value">{{ item.repairId }}</span>
                </div>
                <div class="text-justify">
                  <span class="label">创建时间:</span>
                  <span class="value">{{ item.date }}</span>
                </div>
              </ex-space>
            </div>
          </div>
        </router-link>
      </ex-loader>
    </ex-content>
  </div>
</template>

<script>
import axios from 'axios';
import HOSTS from '../../env.config';
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      index: 0,
    };
  },
  computed: {
    ...mapState('repair/tickets', ['list']),
    url() {
      return `${HOSTS.REPAIR}/api/repairHeader/repairHeaderList`;
    },
  },
  filters: {
    // 工单状态
    // 0:待收货 1:已收货 2:已完成 3:不收货 4:后收货 5:部分收货 6:待审核。
    status(status) {
      return ['待收货', '已收货', '已完成', '不收货', '后收货', '部分收货', '待审核'][status] || '其他';
    },
    // 工单类型
    // 0:维修工单 2:配件工单 5:对发工单 6:退运工单 7:矿场工单
    type(type) {
      return ['维修工单', '', '配件工单', '', '', '对发工单', '退运工单', '矿场工单'][type] || '其他';
    },
  },
  methods: {
    ...mapActions('repair/tickets', ['setTickets']),
    transform(data) {
      return data;
    },
    callback({ list }) {
      this.setTickets({ list });
    },
  },
};
</script>
<style scoped lang="less">
.text .label {
  min-width: 5em;
}
</style>
