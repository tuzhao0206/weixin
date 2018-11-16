<template>
  <transition name="ex-widget" @enter="enter">
    <ex-mask v-if="show" @click="dismiss($event);">
      <div class="modal" :class="clazz">
        <h3 class="title" v-if="title">{{ title }}</h3>
        <div class="content" v-html="message"></div>
        <footer class="footer">
          <div class="compact nesting" :class="{ 'button-group': clazz !== 'android' }">
            <button
              class="button"
              v-for="(item, idx) in buttons"
              :key="idx"
              :class="[item.class || 'text-primary']"
              @click="item.onClick"
            >
              {{ item.text }}
            </button>
          </div>
        </footer>
      </div>
    </ex-mask>
  </transition>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, default: false },
    title: { type: String },
    clazz: { type: String },
    message: { type: String },
    dismiss: { type: Function, default: n => n },
    buttons: { type: Array, default: () => [] },
  },
  methods: {
    enter: (el, done) => done(),
  },
};
</script>
