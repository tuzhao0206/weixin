<template>
  <div class="tabbar">
    <a class="item" :class="{ active: tab === 0 }" @click="active(0);">
      <img class="icon" src="../assets/images/icon-05.svg" v-if="tab === 0" />
      <img class="icon" src="../assets/images/icon-06.svg" v-if="tab !== 0" />
    </a>
    <a class="item" :class="{ active: tab === 1 }" @click="active(1);">
      <img class="icon" src="../assets/images/icon-07.svg" v-if="tab === 1" />
      <img class="icon" src="../assets/images/icon-08.svg" v-if="tab !== 1" />
    </a>
    <a class="item" :class="{ active: tab === 2 }" @click="active(2);">
      <img class="icon" src="../assets/images/icon-03.svg" v-if="tab === 2" />
      <img class="icon" src="../assets/images/icon-04.svg" v-if="tab !== 2" />
    </a>
    <a class="item" :class="{ active: tab === 3 }" @click="active(3);">
      <img class="icon" src="../assets/images/icon-09.svg" v-if="tab === 3" />
      <img class="icon" src="../assets/images/icon-10.svg" v-if="tab !== 3" />
    </a>
  </div>
</template>
<script>
export default {
  props: {
    index: { type: Number, default: 0 },
    force: { type: Boolean, default: false },
  },
  data() {
    return { tab: this.index };
  },
  methods: {
    active(index) {
      if (this.force || this.tab !== index) {
        this.tab = index;
        this.$emit('click', index);
      }
    },
  },
};
</script>
