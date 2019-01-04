<template>
  <ex-view>
    <ex-header title="填写收货信息">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content>
      <div class="list">
        <div class="item">
          <div class="text-sm">Step4：请填写您的收货信息</div>
        </div>
        <div class="item">
          <ex-space space="10px 0">
            <div class="notice text-sm">注意：产品维修好之后，会将良品返还给您所填写的地址，为不影响您的正常收货，请务必保证信息填写正确。</div>
          </ex-space>
        </div>
        <label class="item text-sm" ui-mode="input">
          <div class="label" ui-mode="64px">
            <i class="text-warning">*</i>
            <span>收件人</span>
          </div>
          <input class="input" type="text" v-model="name" maxlength="30" placeholder="收件人">
        </label>
        <label class="item text-sm" ui-mode="input">
          <div class="label">
            <i class="text-warning">*</i>
            <span>联系手机</span>
          </div>
          <input
            class="input"
            type="tel"
            pattern="[0-9]*"
            v-model="mobile"
            maxlength="11"
            placeholder="联系手机"
          >
        </label>
        <div class="item text-sm" @click="openPicker">
          <div class="label">
            <i class="text-warning">*</i>
            <span>所在地区</span>
          </div>
          <div class="text">
            <span v-if="province && city">{{province.name}} {{city.name}}</span>
            <span class="text-gray" v-else>所在地区</span>
          </div>
          <i class="icon text-gray">&#xe61a;</i>
        </div>
        <label class="item text-sm" ui-mode="input">
          <div class="label">
            <i class="text-warning">*</i>
            <span>详细地址</span>
          </div>
          <input class="input" type="text" v-model="street" maxlength="50" placeholder="详细地址">
        </label>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="next();">下一步</button>
    </ex-footer>

    <ex-picker
      :title="'所在地区'"
      :show="picker"
      :groups="groups"
      :dismiss="onCancel"
      :onCancel="onCancel"
      :onChange="onChange"
      :onConfirm="onConfirm"
    />
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../env.config';
import { mapActions } from 'vuex';
export default {
  data() {
    const { name = '', mobile = '', province = null, city = null, street = '' } =
      this.$store.state.repair.address || {};
    return {
      name: name,
      mobile: mobile,
      province: province,
      city: city,
      street: street,
      picker: false,
      groups: [],
    };
  },
  computed: {},
  mounted() {
    this.listProvince().then(provinces => {
      this.groups = [provinces];
    });
  },
  methods: {
    ...mapActions('repair', ['setAddress']),
    openPicker() {
      this.picker = true;
    },
    onCancel() {
      this.picker = false;
    },
    onChange({ index, group, groupIndex }) {
      if (groupIndex !== 0) {
        return null;
      }
      return this.listCity(group[index].code);
    },
    onConfirm({ list }) {
      this.picker = false;
      this.province = list[0];
      this.city = list[1];
    },
    listProvince() {
      const url = `${HOSTS.BASE}/api/region/provinceRegionList`;
      const params = { code: 'CN', type: 'sales' };
      return axios.get(url, { params, cache: true }).then(({ data }) => {
        return data.provinceRegionList;
      });
    },
    listCity(code) {
      const url = `${HOSTS.BASE}/api/city/cityListWithCode`;
      const params = { code, type: 'sales' };
      return axios.get(url, { params, cache: true, global: false }).then(({ data }) => {
        return data.cityList;
      });
    },
    next() {
      if (!this.name) {
        return this.$message('请填写收件人');
      }
      if (!/^\d{11}$/.test(this.mobile)) {
        return this.$message('请输入正确的联系手机');
      }
      if (!this.province || !this.city) {
        return this.$message('请选择所在地区');
      }
      if (!this.street) {
        return this.$message('请填写详细地址');
      }

      // 缓存数据
      this.setAddress({
        address: {
          name: this.name,
          mobile: this.mobile,
          province: this.province,
          city: this.city,
          street: this.street,
        },
      });
      // 下一步
      this.$router.push(this.$prelang('repair/channel'));
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../less/base/fn.less';
.notice {
  position: relative;
  font-size: 14px;
  padding: 10px 15px;
  border-radius: 4px;
  color: @orange;
  background-color: #fff5e5;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 15px;
    height: 15px;
    transform: translate(-50%, -50%) rotate(45deg);
    border-radius: 3px;
    background-color: #fff5e5;
  }
}

.details {
  border: 1px solid @borderColor;
  border-radius: 4px;
  margin-top: 10px;
  padding: 15px 10px;
}
</style>
