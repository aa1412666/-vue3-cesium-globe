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
      creditContainer: document.createElement('div'), // 隐藏版权信息
    });
    
    // 天地图token
    const tdtKey = "3be4f683aa97741583a90ca02be19f64";
    
    // 使用Cesium默认底图（Bing Maps），无需额外配置
    // Cesium.Viewer默认会使用Cesium Ion提供的Bing Maps卫星影像
    
    // 加载天地图地理标签（叠加在Cesium底图之上）
    const tdtLabelLayer = new Cesium.ImageryLayer(new Cesium.WebMapTileServiceImageryProvider({
      url: `http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${tdtKey}`,
      layer: "tdtAnnoLayer",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",
    }));

    // 只添加天地图标签图层，底图使用Cesium默认的
    this.viewer.imageryLayers.add(tdtLabelLayer);
    
    // 调整 Cesium 控件的 z-index 层级
    setTimeout(() => {
      // 调整 animation 控件的 z-index
      const animationContainer = this.container.querySelector('.cesium-viewer-animationContainer') as HTMLElement;
      if (animationContainer) {
        animationContainer.style.zIndex = '20';
      }
      
      // 调整 timeline 控件的 z-index
      const timelineContainer = this.container.querySelector('.cesium-viewer-timelineContainer') as HTMLElement;
      if (timelineContainer) {
        timelineContainer.style.zIndex = '20';
      }
    }, 100); // 延迟确保DOM已渲染
  }
}
