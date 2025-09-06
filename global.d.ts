// src/global.d.ts
import * as _Cesium from "cesium";
import Vue from "vue";

declare global {
  const Cesium: typeof _Cesium;
  const Vue: typeof Vue;
  interface Window {
    Cesium: typeof _Cesium;
  }
}
