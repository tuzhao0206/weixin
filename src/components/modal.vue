<template>
  <transition name="ex-widget" @enter="enter">
    <ex-mask v-if="show" @click="dismiss">
      <div class="modal">
        <slot>
          <h3 class="title" v-if="title" v-html="title" />
          <div class="content" v-html="message" />
          <footer class="footer" v-if="buttons.length > 0">
            <div class="button-group compact nesting">
              <button
                class="button"
                v-for="(item, idx) in buttons"
                :key="idx"
                v-bind="buttonConfig(item)"
                @click="item.onClick(item);"
              >
                {{ item.text }}
              </button>
            </div>
          </footer>
        </slot>
        <i class="bt-icon close" @click="close" v-if="close">&#xe61f;</i>
      </div>
    </ex-mask>
  </transition>
</template>
<script>
export default {
  props: {
    show: { type: Boolean, default: false },
    title: { type: String },
    message: { type: String },
    close: { type: Function },
    dismiss: { type: Function, default: n => n },
    buttons: { type: Array, default: () => [] },
  },
  methods: {
    // 过滤button的属性
    buttonConfig(config) {
      const options = {};
      Object.keys(config).forEach(key => {
        if (key !== 'onClick' && key !== 'text') {
          options[key] = config[key];
        }
      });
      return options;
    },
    enter: (el, done) => done(),
  },
};
</script>
