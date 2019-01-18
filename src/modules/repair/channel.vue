<template>
  <ex-view>
    <ex-header title="请选择回寄物流方式">
      <ex-menu class="text-gray" @click="$router.back();">
        <i class="icon">&#xe60e;</i>
      </ex-menu>
      <ex-title/>
    </ex-header>

    <ex-content>
      <div class="list">
        <div class="item">
          <div class="text-sm">请选择回寄物流方式</div>
        </div>
        <div class="item">
          <ex-space space="10px 0">
            <div class="notice text-sm">
              <p>请选择您的维修包裹回寄物流方式，我们将优先按照您选择的物流方式将设备寄回给您。</p>
              <p>如果确认您的工单地址不能创建该物流订单或该物流不能到达时，蚂蚁售后将另行安排合理的物流商，并不会发出有关此替代安排的任何通知，请知悉。</p>
            </div>
          </ex-space>
        </div>
      </div>
      <div class="pannel clearfix">
        <div
          class="item"
          :class="{ active: channel && channel.id === item.id }"
          v-for="item in list"
          :key="item.id"
          @click="checkChannel(item);"
        >
          <div class="wrap">{{ item.name }}</div>
        </div>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="submit();">提交工单</button>
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
      list: [],
      channel: this.$store.state.repair.channel,
    };
  },
  computed: {
    ...mapState('repair', ['station']),
  },
  mounted() {
    if (!this.station) {
      return this.$alert({
        message: '数据不完善，请重新输入<br /><span class="text-warning">注意：中途不要刷新或离开</span>',
        callback: () => {
          this.$router.push(this.$prelang('repair'));
        },
      });
    }
    const url = `${HOSTS.REPAIR}/api/repairSite/getSendBackLogistics`;
    const params = { siteCode: this.station.code };
    axios.get(url, { params, cache: true }).then(({ data }) => {
      this.list = data;
    });
  },
  methods: {
    ...mapActions('repair', ['setChannel']),
    checkChannel(channel) {
      this.channel = channel;
    },
    submit() {
      if (!this.channel) {
        return this.$message('请选择回寄物流方式');
      }

      // 缓存数据
      this.setChannel({
        channel: this.channel,
      });
      this.$router.push({ path: this.$prelang('repair/confirm') });
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
.pannel {
  background: #fff;
  padding: 6px;
  margin-top: -10px;
  .item {
    float: left;
    width: 33.3333%;
    padding: 6px;
    .wrap {
      display: block;
      line-height: 46px;
      font-size: 14px;
      text-align: center;
      border-radius: 3px;
      border: 1px solid @light;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    &.active {
      .wrap {
        position: relative;
        color: @blue;
        border-color: @blue;
        &:before {
          content: '';
          position: absolute;
          right: -20px;
          bottom: -20px;
          width: 40px;
          height: 40px;
          background: @blue;
          transform: rotate(45deg);
        }
        &:after {
          content: '';
          position: absolute;
          right: 2px;
          bottom: 6px;
          width: 14px;
          height: 6px;
          transform: rotate(-45deg);
          border-left: 2px solid #fff;
          border-bottom: 2px solid #fff;
        }
      }
    }
  }
}
</style>
