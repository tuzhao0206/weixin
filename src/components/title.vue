<template>
  <h1 class="title"><b v-if="title" v-html="slogan"></b> <slot></slot></h1>
</template>
<script>
export default {
  computed: {
    title() {
      return this.$store.state.title;
    },
    slogan() {
      if (this.title === 'BITMAIN') {
        return '<img width="100" src="//img1.qdingnet.com/4880a7869699859b831775236ca879dd.svg" />';
      }
      return this.title;
    },
  },
};
</script>
