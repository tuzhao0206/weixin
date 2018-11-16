<template>
  <div id="app">
    <router-view v-if="ready"></router-view>
    <ex-grid-loading v-else />
    <ex-widgets>
      <ex-toast v-bind="toast" />
      <ex-modal v-bind="modal" />
      <ex-sheet v-bind="sheet" />
    </ex-widgets>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['ready', 'toast', 'modal', 'sheet']),
  },
};
</script>
