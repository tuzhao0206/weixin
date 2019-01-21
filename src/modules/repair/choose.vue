<template>
  <ex-view>
    <ex-header title="添加维修设备">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content>
      <!-- 配件工单不需要显示整机和物料 -->
      <div class="navbar underline primary" v-if="type !== 1">
        <a class="item" :class="{ active: index === 0 }" @click="listDevice(0);">整机列表</a>
        <a class="item" :class="{ active: index === 1 }" @click="listDevice(1);">配件列表</a>
        <a class="item" :class="{ active: index === 2 }" @click="listDevice(2);">物料列表</a>
      </div>

      <!-- 矿机 -->
      <template v-if="index === 0">
        <div class="list compact" v-for="(group, name) in categories" :key="name">
          <div class="item" :class="{active: active === name}" @click="toggleCategory(name)">
            <div class="text text-sm text-strong text-darkgray">{{name}}</div>
            <i class="icon text-gray">&#xe61a;</i>
          </div>
          <div class="list compact text-md">
            <label
              class="item tapable"
              v-for="item in group"
              :key="item.id"
              @change="toggleEquip(item);"
            >
              <input class="checkbox primary" type="checkbox" :checked="isSelected(item)">
              <div class="text">{{ item.name }}</div>
            </label>
          </div>
        </div>
      </template>
      <!-- 配件&物料 -->
      <div class="list compact text-md" v-else>
        <label
          class="item tapable"
          v-for="item in list"
          :key="item.id"
          @change="toggleEquip(item);"
        >
          <input class="checkbox primary" type="checkbox" :checked="isSelected(item)">
          <div class="text">{{ item.name }}</div>
        </label>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="confirm();">确定</button>
    </ex-footer>
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
      active: '',
      type: type,
      // 创建副本
      selected: [...this.$store.state.repair.selected],
    };
  },
  computed: {
    categories() {
      const groups = {};
      this.list.forEach(item => {
        const key = item.productCategory || '其他分类';
        groups[key] = groups[key] || [];
        groups[key].push(item);
      });

      const ordered = {};
      Object.keys(groups)
        .sort()
        .forEach(key => {
          ordered[key] = groups[key];
        });
      return ordered;
    },
  },
  mounted() {
    this.listDevice(this.type === 1 ? 1 : 0);
  },
  methods: {
    ...mapActions('repair', ['setSelected']),
    // 是否选中
    isSelected(target) {
      return this.selected.findIndex(item => item.productId === target.productId) !== -1;
    },
    // 切换分组
    toggleCategory(name) {
      this.active = this.active === name ? '' : name;
    },
    // 列举设备
    listDevice(index) {
      this.index = index;
      // deviceType: 0:整机 1:配件 2:物料
      const url = `${HOSTS.REPAIR}/api/productRepair/getByDeviceType`;
      const params = { deviceType: index, uncollectFlag: this.type === 1 ? 1 : 0 };
      axios.get(url, { params, cache: true }).then(({ data }) => {
        this.list = data.map(item => {
          item.count = 1;
          item.type = index;
          return item;
        });
      });
    },
    // 选择/取消产品
    toggleEquip(target) {
      const index = this.selected.findIndex(item => item.productId === target.productId);
      if (index !== -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push({ ...target });
      }
    },
    // 还原数量
    prevCount(product) {
      const target = this.$store.state.repair.selected.find(item => item.productId === product.productId);
      return target ? target.count : 1;
    },
    // 确定
    confirm() {
      const selected = this.selected
        .sort((a, b) => a.type - b.type)
        .map(item => {
          item.count = this.prevCount(item);
          return item;
        });
      this.setSelected({ selected });
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../less/base/fn.less';
.item {
  & + .list {
    display: none;
  }
  &.active {
    background: #f2f2f2;
    & + .list {
      display: block;
    }
    & > .icon {
      transform: rotate(90deg);
      transition-property: transform;
      transition-duration: 0.3s;
    }
  }
}
</style>
