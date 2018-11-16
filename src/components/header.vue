<template>
  <header class="bar top-fixed" v-if="!nested"><slot></slot></header>
</template>
<script>
import Env from '../utils/env';
export default {
  props: {
    title: { type: String },
  },
  computed: {
    nested: function() {
      return Env.nested;
    },
  },
  watch: {
    title: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$store.dispatch({
          type: 'setTitle',
          title: this.title,
        });
      }
    },
  },
  created() {
    this.$store.dispatch({
      type: 'setTitle',
      title: this.title,
    });
  },
};
</script>
