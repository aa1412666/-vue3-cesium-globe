<template>
  <div v-if="visible" class="circle-ring-overlay">
    <div class="circle-ring">
      <!-- 外圆 -->
      <div class="outer-circle"></div>
      <!-- 环形毛玻璃区域 -->
      <div class="ring-area"></div>
      <!-- 内圆 -->
      <div class="inner-circle"></div>
      <!-- 中心框 -->
      <div class="center-bar"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

// Props
interface Props {
  visible: boolean;
}

const props = defineProps<Props>();

// 环形界面管理类
class CircleRingManager {
  private isVisible: boolean = false;
  private animationId: number | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // 初始化逻辑
    console.log('CircleRingManager initialized');
  }

  public show() {
    this.isVisible = true;
    this.startAnimation();
  }

  public hide() {
    this.isVisible = false;
    this.stopAnimation();
  }

  public toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  private startAnimation() {
    // 可以在这里添加动画逻辑
    console.log('Starting circle ring animation');
  }

  private stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    console.log('Stopping circle ring animation');
  }

  public destroy() {
    this.stopAnimation();
    console.log('CircleRingManager destroyed');
  }

  get visible() {
    return this.isVisible;
  }
}

// 创建管理器实例
const ringManager = new CircleRingManager();

// 监听props变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    ringManager.show();
  } else {
    ringManager.hide();
  }
}, { immediate: true });

// 生命周期
onMounted(() => {
  console.log('CircleRingOverlay mounted');
});

onUnmounted(() => {
  ringManager.destroy();
});
</script>

<style scoped lang="scss">
/* 大圆环覆盖层 */
.circle-ring-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10; /* 降低z-index，避免遮挡Cesium控件 */
  pointer-events: none; /* 改为none，不阻挡任何点击事件 */
  background: rgba(0, 0, 0, 0.1);
}

.circle-ring {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 内圆：从顶部到底部，占据左侧四分之一区域的内侧 */
.inner-circle {
  position: absolute;
  width: 100vh; /* 使用视窗高度作为直径，确保圆足够大 */
  height: 100vh;
  border: none; /* 移除边框 */
  border-radius: 50%;
  background: transparent;
  /* 圆心位置：使圆弧覆盖左侧1/4区域的内侧 */
  left: calc(-100vh + 25vw - 50px); /* 圆心在左侧，右边缘到达25%位置内侧 */
  top: 0;
}

/* 外圆：从顶部到底部，占据左侧四分之一区域的外侧 */
.outer-circle {
  position: absolute;
  width: calc(100vh + 400px); /* 比内圆大400px，进一步扩大环形面积 */
  height: calc(100vh + 400px);
  border: none; /* 移除边框 */
  border-radius: 50%;
  background: transparent;
  /* 圆心位置：使圆弧覆盖左侧1/4区域的外侧 */
  left: calc(-100vh - 200px + 25vw - 50px); /* 调整位置以保持同心圆 */
  top: -200px; /* 调整位置以保持同心圆 */
}

/* 环形毛玻璃区域 */
.ring-area {
  position: absolute;
  width: calc(100vh + 400px); /* 与外圆相同 */
  height: calc(100vh + 400px);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1); /* 半透明白色背景 */
  backdrop-filter: blur(10px); /* 毛玻璃模糊效果 */
  /* 使用mask创建环形形状 */
  mask: radial-gradient(circle at center, transparent 50vh, black calc(50vh + 1px), black calc(50vh + 200px - 1px), transparent calc(50vh + 200px));
  -webkit-mask: radial-gradient(circle at center, transparent 50vh, black calc(50vh + 1px), black calc(50vh + 200px - 1px), transparent calc(50vh + 200px));
  /* 与外圆相同的定位 */
  left: calc(-100vh - 200px + 25vw - 50px);
  top: -200px;
}

/* 圆环中心框 */
.center-bar {
  width: 210px;
  height: 60px;
  background: transparent; /* 改为透明背景 */
  border: 2px solid rgba(255, 255, 255, 0.9); /* 添加白色边框 */
  /* 定位在圆环的中心 */
  position: fixed; /* 保持fixed定位，相对于视窗 */
  top: 47%; 
  left: 277px; 
  border-radius: 5px; /* 稍微圆角 */
}
</style>
