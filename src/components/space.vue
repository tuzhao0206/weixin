<template>
  <div :style="inside ? `padding: ${space}` : `margin: ${space}`"><slot /></div>
</template>

<script>
export default {
  props: {
    space: { type: String, default: '0px' },
    inside: { type: Boolean, default: false },
  },
};
</script>
