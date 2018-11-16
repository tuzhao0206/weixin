<template>
  <section ref="element" class="content" :style="style"><slot /></section>
</template>
<script>
export default {
  data() {
    return {
      style: { marginTop: 0, marginBottom: 0 },
    };
  },
  mounted() {
    this.adjustMargin();
  },
  // 防止动态增删顶部和底部的Bar
  updated() {
    this.adjustMargin();
  },
  methods: {
    // HEADER FOOTER 间距处理
    adjustMargin() {
      const container = this.$refs.element.parentNode;
      const header = container.querySelector('header.bar.top-fixed');
      const footer = container.querySelector('footer.bar.btm-fixed');
      if (header && header.parentNode === container) {
        this.style.marginTop = header.offsetHeight + 'px';
      } else {
        this.style.marginTop = '0px';
      }
      if (footer && footer.parentNode === container) {
        this.style.marginBottom = footer.offsetHeight + 'px';
      } else {
        this.style.marginBottom = '0px';
      }
    },
  },
};
</script>
