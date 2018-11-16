<template>
  <div class="geer-loading">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>
<style lang="less" scoped>
.geer-loading {
  position: relative;
  display: block;
  width: 64px;
  height: 64px;
  margin: auto;
}
.geer-loading div {
  position: absolute;
  top: 27px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #eee;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.geer-loading div:nth-child(1) {
  left: 6px;
  animation: geer-loading1 0.6s infinite;
}
.geer-loading div:nth-child(2) {
  left: 6px;
  animation: geer-loading2 0.6s infinite;
}
.geer-loading div:nth-child(3) {
  left: 26px;
  animation: geer-loading2 0.6s infinite;
}
.geer-loading div:nth-child(4) {
  left: 45px;
  animation: geer-loading3 0.6s infinite;
}
@keyframes geer-loading1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes geer-loading3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes geer-loading2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(19px, 0);
  }
}
</style>
