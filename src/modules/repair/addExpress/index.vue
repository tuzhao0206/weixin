<template>
  <ex-view>
    <ex-header title="填写发货单号">
      <ex-menu class="text-gray" @click="$router.back();"> <i class="icon">&#xe60e;</i> </ex-menu>
      <ex-title></ex-title>
    </ex-header>

    <ex-content v-if="!loading">
      <div class="list">
        <div class="item"><div class="title text-sm">Step3：请联系快递商打包物品并填写包裹信息</div></div>
        <div class="item">
          <div class="attention text-sm">
            <div class="imgContainer"><i class="icon">&#xe677;</i></div>
            <p>注意：请认真填写您的包裹信息，务必保证运单号与设备信息的准确。</p>
          </div>
        </div>
        <div class="item">
          <div class="text text-sm" id="wuliu">
            <div><i class="attention">*</i> <span>发货物流商</span></div>
            <div class="content" @click="showAddModal = true;" :class="{ haveContent: this.expressName !== '' }">
              <span>{{ expressName | noContent }}</span> <i class="icon">&#xe61a;</i>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="text text-sm" id="yundan">
            <div><i class="attention">*</i> <span>发货运单号</span></div>
            <div class="content" :class="{ haveContent: this.expressName !== '' }">
              <input v-model="code" placeholder="发货运单号" /><i class="icon">&#xe614;</i>
            </div>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="item">
          <div class="text">
            <p class="subTitle">请将维修机器寄往以下地址：</p>
            <div class="locationDetail" v-html="this.$store.state.repair.location.location.note"></div>
          </div>
        </div>
      </div>
    </ex-content>

    <ex-footer class="btm-fixed">
      <button class="button primary square" @click="nextStep();">下一步</button>
    </ex-footer>

    <ex-picker
      :onCancel="onCancel"
      :onConfirm="onConfirm"
      :title="'选择维修网点'"
      :show="showAddModal"
      :groups="[this.expressList]"
    ></ex-picker>

    <ex-modal :show="errorMessageModal" class="errorMessage">
      <div class="content">
        <p>{{ errorMessage }}</p>
      </div>
      <footer class="footer"><div class="button confirm" @click="errorMessageModal = false;">确认</div></footer>
    </ex-modal>
  </ex-view>
</template>
<script>
import axios from 'axios';
import HOSTS from '../../../env.config';
export default {
  data() {
    return {
      expressList: [],

      showAddModal: false,
      errorMessageModal: false,
      errorMessage: '',

      loading: true,

      checked: -1,
      expressName: '',
      code: '',
    };
  },
  filters: {
    noContent: function(val) {
      if (val == '') {
        return '发货物流商';
      } else {
        return val;
      }
    },
    noContentCode: function(val) {
      if (val == '') {
        return '发货运单号';
      } else {
        return val;
      }
    },
  },
  mounted() {
    const url = `${HOSTS.BASE}/api//logistics/getLogistics?flag=repair`;
    let that = this;
    axios.get(url).then(({ data }) => {
      that.expressList = data;
      that.loading = false;
    });
  },
  methods: {
    onCancel() {
      this.showAddModal = false;
    },
    onConfirm(value) {
      this.checked = value.checked[0];
      this.expressName = value.list[0].name;
      this.showAddModal = false;
    },
    nextStep() {
      // 校验
      if (this.checked == -1) {
        this.errorMessage = '请选择发货单号。';
        this.errorMessageModal = true;

        return false;
      }
      if (!new RegExp('^[A-Za-z0-9-]+$').test(this.code)) {
        this.errorMessage = '请输入正确的运单号。';
        this.errorMessageModal = true;

        return false;
      }
      if (this.code.length < 8 || this.code.length > 30) {
        this.errorMessage = '运单号8～30位。';
        this.errorMessageModal = true;

        return false;
      }

      // 赋值
      this.$store.commit('repair/express/changeExpressObj', { expressObj: this.expressList[this.checked] });
      this.$store.commit('repair/express/changeCode', { code: this.code });

      // 跳转
      alert('cool');
      this.$router.push({ path: this.$prelang('repair/addExpress') });
    },
  },
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

div#wuliu,
div#yundan {
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
    span,
    i {
      color: @cancelgray;
    }
    input {
      flex-grow: 1;
      text-decoration: none;
      outline: none;
      border-width: 0;
    }
    input::placeholder {
      color: @cancelgray;
    }
  }
  div.content.haveContent {
    span,
    i {
      color: black;
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
div.errorMessage {
  div.content {
    height: 64px;
    padding: 20px 30px 0 30px;
    text-align: center;
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
</style>
