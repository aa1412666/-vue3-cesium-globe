import * as Cesium from "cesium";
export default class Earth {
  viewer: Cesium.Viewer;
  container: HTMLElement;
  token: string;
  constructor(container: HTMLElement) {
    this.container = container;
    this.token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZjVkMGQyMC0wNzQ1LTRkNGItYjI2NC05MjkyZTBlZDc1OGIiLCJpZCI6MTI4MTAyLCJpYXQiOjE3NTY4ODMyNzV9.r2OxpNQiGvnG_9o5Cd99s7e4QclwD2Wxi-SFmlhTyk8";
    Cesium.Ion.defaultAccessToken = this.token;
  }
  async initCesium() {
    const terrainProvider = await Cesium.createWorldTerrainAsync();
    this.viewer = new Cesium.Viewer(this.container, {
      geocoder: false,
      baseLayerPicker: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      vrButton: false,
      selectionIndicator: false,
      infoBox: false,
      animation: true,
      timeline: true,
      terrainProvider,
      sceneMode: Cesium.SceneMode.SCENE3D,
    });
  // 添加光照效果
  this.viewer.scene.globe.enableLighting = true;
    this.viewer.imageryLayers.addImageryProvider(
      await Cesium.IonImageryProvider.fromAssetId(3)
    );
  }
}
