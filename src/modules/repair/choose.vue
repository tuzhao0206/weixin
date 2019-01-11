<template>
  <ex-view>
    <ex-header title="添加维修设备">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title />
    </ex-header>

    <ex-content>
      <!-- 配件工单不需要显示整机和物料 -->
      <div class="navbar underline primary" v-if="type !== 1">
        <a class="item" :class="{ active: index === 0 }" @click="listDevice(0);">整机列表</a>
        <a class="item" :class="{ active: index === 1 }" @click="listDevice(1);">配件列表</a>
        <a class="item" :class="{ active: index === 2 }" @click="listDevice(2);">物料列表</a>
      </div>

      <div class="list compact text-md">
        <label class="item tapable" v-for="item in list" :key="item.id" @change="toggleEquip(item);">
          <input class="checkbox primary" type="checkbox" :checked="isSelected(item)" />
          <div class="text">{{ item.name }}</div>
        </label>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed"> <button class="button primary square" @click="confirm();">确定</button> </ex-footer>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../env.config';
import { mapActions } from 'vuex';
export default {
  data() {
    // type: 0-普通工单 1-配件工单 2-对发工单
    const type = Number(this.$route.query.type);
    return {
      index: 0,
      list: [],
      type: type,
      // 创建副本
      selected: [...this.$store.state.repair.selected],
    };
  },

  mounted() {
    this.listDevice(this.type === 1 ? 1 : 0);
  },
  methods: {
    ...mapActions('repair', ['setSelected']),
    // 是否选中
    isSelected(target) {
      return this.selected.findIndex(item => item.id === target.id) !== -1;
    },
    // 列举设备
    listDevice(index) {
      this.index = index;
      // deviceType: 0-整机 1-配件 2-物料
      const url = `${HOSTS.REPAIR}/api/productRepair/getByDeviceType`;
      const params = { deviceType: index, uncollectFlag: this.type === 1 ? 1 : 0 };
      axios.get(url, { params, cache: true }).then(({ data }) => {
        this.list = data.map(item => {
          item.type = index;
          item.count = 1;
          return item;
        });
      });
    },
    // 选择/取消产品
    toggleEquip(item) {
      const index = this.selected.indexOf(item);
      if (index !== -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(item);
      }
    },
    // 确定
    confirm() {
      this.setSelected({ selected: this.selected.sort((a, b) => a.type - b.type) });
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../less/base/fn.less';
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
</style>
