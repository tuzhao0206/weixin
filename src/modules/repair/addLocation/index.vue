<!-- @TODO 样式同一化 -->
<template>
  <ex-view>
    <ex-header title="选择维修点">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title></ex-title>
    </ex-header>

    <ex-content v-if="!loading">
      <div class="list">
        <div class="item"><div class="title text-sm">Step2: 请选择维修点</div></div>
        <div class="item">
          <div class="attention text-sm">
            <div class="imgContainer"><i class="icon">&#xe677;</i></div>
            <p>注意：维修产品需寄往对应网点地址进行维修，请勿寄往其他维修点。</p>
          </div>
        </div>
        <div class="item">
          <div class="text text-sm" id="chooseLocation">
            <div><i class="attention">*</i> <span>选择维修网点</span></div>
            <div class="content" @click="showAddModal = true;">
              <span>{{ choosedLocation }}</span> <i class="icon">&#xe61a;</i>
            </div>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="item">
          <div class="text">
            <p class="subTitle">请将维修机器寄往以下地址：</p>
            <div class="locationDetail" v-html="locationList[0].note"></div>
          </div>
        </div>
      </div>

      <!-- @TODO 上拉动画 -->
      <transition name="fade">
        <div class="location-add" v-show="showAddModal">
          <div class="black" @click="showAddModal = false;"></div>
          <div class="location-add-modal">
            <div class="title">
              <span @click="showAddModal = false;">取消</span>
              <p>请选择维修网点</p>
              <span>确认</span>
            </div>

            <div class="content">
              <ul>
                <li v-for="(location, index) in locationList" :key="index">{{ location.name }}</li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </ex-content>

    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="nextStep();">下一步</button>
    </ex-footer>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../../env.config';
export default {
  data() {
    return {
      choosedLocation: '请选择维修网点',
      locationList: [],

      showAddModal: true,

      loading: true,
    };
  },
  mounted() {
    const url = `${HOSTS.REPAIR}/api/repairSite/siteList`;
    let that = this;
    axios.get(url).then(({ data }) => {
      that.locationList = data;
      that.loading = false;
    });
  },
  computed: {},
  methods: {},
};
</script>
<style lang="less" scoped>
@import '../../../less/base/variable/color.less';
div.title {
  color: @lightBlack;
  font-weight: bold;
}

div.attention {
  display: flex;
  align-items: flex-start;

  color: #e6a23b;
  background-color: #fdf6ec;
  padding: 7px;
  div.imgContainer {
    margin-right: 7px;
    font-size: 18px;
  }
  p {
    line-height: 16px;
  }
}

div#chooseLocation {
  display: flex;
  flex-wrap: nowrap;
  i.attention {
    color: #de2910;
  }
  div.content {
    display: flex;
    justify-content: space-between;
    margin-left: 22px;
    flex-grow: 1;
    span {
      color: @cancelgray;
    }
  }
}

p.subTitle {
  color: @lightBlack;
  font-size: 14px;
  line-height: 20px;
}

div.locationDetail {
  border: 1px solid @borderColor;
  border-radius: 4px;
  margin-top: 10px;
  padding: 5px 10px;
  p {
    line-height: 17px; //@TODO 无效？
  }
}

div.location-add {
  position: fixed;
  display: flex;

  flex-direction: column;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  div.black {
    flex-grow: 1;
  }
  div.location-add-modal {
    display: flex;
    flex-direction: column;

    height: 40%; //百分比高度，适配大屏幕
    width: 100%;
    background-color: white;
    div.title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 15px;

      font-size: 14px;
      border-bottom: 1px solid @borderColor;
      span {
        color: @blue;
      }
    }
    div.content {
      display: flex;
      align-items: center;
      flex-grow: 1;
      ul {
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>
