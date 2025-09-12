<template>
  <div ref="cesiumContainer" id="cesiumContainer"></div>
  <utools @compass="onCompassClick" />
</template>

<script setup lang="ts">
import utools from "./components/utools/utools.vue";
import { ref, onMounted } from "vue";
import Earth from "@/utils/CesiumUtils/actionEarth";

const cesiumContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!cesiumContainer.value) return;
  window._earth = new Earth(cesiumContainer.value);
  window._earth.initCesium();
});

// 指北按钮处理函数
const onCompassClick = () => {
  if (window._earth && window._earth.viewer) {
    // 重置相机方向到北朝上，位置为当前视点
    const currentPosition = window._earth.viewer.camera.position;
    const currentHeading = window._earth.viewer.camera.heading;
    const currentPitch = window._earth.viewer.camera.pitch;
    const currentRoll = window._earth.viewer.camera.roll;

    // 设置heading为0（北朝上），保持当前位置和俯仰角
    window._earth.viewer.camera.setView({
      position: currentPosition,
      orientation: {
        heading: 0, // 0表示北朝上
        pitch: currentPitch,
        roll: 0, // 重置翻滚角
      },
    });
  }
};
</script>

<style>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
