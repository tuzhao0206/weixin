<template>
  <img ref="image" :src="source" />
</template>
<script>
import { getOffset } from '../utils/helper';
export default {
  props: {
    src: { type: String, required: true },
    mark: {
      type: String,
      default: require('../assets/images/image-13.png'),
    },
  },
  data() {
    return {
      source: this.mark,
    };
  },
  mounted() {
    // TODO: 每个元素都绑定时间 效率比较低 考虑批量处理
    window.addEventListener('scroll', this.handler);
    this.handler();
  },
  destroyed() {
    this.release();
  },
  methods: {
    release() {
      clearTimeout(this.timer);
      window.removeEventListener('scroll', this.handler);
    },

    // 缩减帧率
    frameReduce(fn) {
      clearTimeout(this.timer);
      this.timer = setTimeout(fn, 300);
    },

    handler() {
      this.frameReduce(() => {
        const TH = 300; // 阈值
        const image = this.$refs.image;
        const BD = document.body;
        const DE = document.documentElement;
        const ST = Math.max(BD.scrollTop, DE.scrollTop); // scrollTop
        const CH = Math.min(BD.clientHeight, DE.clientHeight); // clientHeight
        const ET = getOffset(image, BD).top; // 图片上边缘坐标
        const EB = ET + image.offsetHeight; // 图片下边缘坐标
        // 图片需要刚好落在视口范围内(这里有个假定是图片不会比容器的可视高度还高)
        // 图片上沿 <= 滚动距离 + 容器可视高度 + 阈值 && 图片下沿 >= 滚动距离 - 阈值
        if (ET <= ST + CH + TH && EB >= ST - TH) {
          // 先清理监听
          this.release();

          // 立即切换
          let preload = new Image();
          preload.onload = () => {
            this.source = this.src;
          };
          preload.src = this.src;
        }
      });
    },
  },
};
</script>
