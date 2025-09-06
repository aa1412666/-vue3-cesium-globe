<template>
  <div ref="cesiumContainer" id="cesiumContainer"></div>
  <utools />
</template>

<script setup lang="ts">
import utools from "./components/utools/utools.vue";
import { ref, onMounted } from "vue";
import Earth from "@/utils/CesiumUtils/actionEarth";
const cesiumContainer = ref<HTMLDivElement | null>(null);
onMounted(() => {
  if (!cesiumContainer.value) return;
  const earth = new Earth(cesiumContainer.value);
  earth.initCesium();
});
</script>

<style>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
