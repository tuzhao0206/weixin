<template>
  <div class="stepper">
    <button :class="{ disabled: currentValue === min || disabled }" @click="decrease();">
      <i class="icon">&#xe62d;</i>
    </button>
    
    <input :disabled="disabled" type="number" @input="onInput" :value="currentValue">
    
    <button :disabled="currentValue === max || disabled" @click="increase();">
      <i class="icon">&#xe62c;</i>
    </button>
  </div>
</template>
<script>
export default {
  props: {
    value: { type: Number, default: 1 },
    min: { type: Number, default: 1 },
    max: { type: Number, default: Infinity },
    step: { type: Number, default: 1 },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      currentValue: this.value,
    };
  },
  watch: {
    value: function(val) {
      this.currentValue = val;
    },
  },

  methods: {
    decrease() {
      this.currentValue = Number(this.currentValue) - this.step;
      if (this.currentValue <= 0) {
        this.$emit('prompt', this.currentValue);
      }
      if (this.currentValue < this.min) {
        this.currentValue = this.min;
      }
      this.$emit('input', this.currentValue);
      this.$emit('change', this.currentValue);
    },
    increase() {
      this.currentValue = Number(this.currentValue) + this.step;
      if (this.currentValue > this.max) {
        this.currentValue = this.max;
      }
      this.$emit('input', this.currentValue);
      this.$emit('change', this.currentValue);
    },
    onInput(e) {
      this.currentValue = Number(e.target.value);
      if (this.currentValue > this.max) {
        this.currentValue = this.max;
      } else if (this.currentValue < this.min) {
        this.currentValue = this.min;
      }
      this.$emit('input', this.currentValue);
      this.$emit('change', this.currentValue);
    },
  },
};
</script>
<style lang="less" scoped>
.stepper {
  display: inline-block;
  font-size: 0;
  input {
    outline: none;
    width: 34px;
    height: 30px;
    text-align: center;
    border: 1px solid #eee;
    border-width: 1px 0;
    color: #666;
    font-size: 14px;
    vertical-align: middle;
    -webkit-appearance: none;
    &:disabled {
      background-color: #f1f1f1;
      border-color: #e5e5e5;
    }
  }
  button {
    outline: none;
    cursor: pointer;
    color: #666666;
    width: 34px;
    height: 30px;
    vertical-align: middle;
    border: 1px solid #eee;
    background-color: #fff;
    font-size: 18px;
    // &:disabled,
    // &.disabled {
    //   background-color: #f1f1f1;
    //   border-color: #e5e5e5;
    // }
  }
}
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
</style>
