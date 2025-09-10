<template>
  <div v-if="visible" class="circle-ring-overlay">
    <div class="circle-ring">
      <!-- 外圆 -->
      <div class="outer-circle"></div>
      <!-- 环形毛玻璃区域 -->
      <div class="ring-area" @wheel.prevent="handleWheel">
        <!-- 滚轮选择器区域 -->
        <div class="scroll-picker-container">
          <div 
            v-for="(item, index) in visibleItems" 
            :key="index"
            :class="['picker-item', { 'active': index === centerIndex }]"
            :style="{ transform: `translateY(${(index - centerIndex) * 80}px)` }"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <!-- 内圆 -->
      <div class="inner-circle"></div>
      <!-- 中心框 -->
      <div class="center-bar" @click="handleButtonClick" @wheel.prevent="handleWheel">
        <div class="selected-item">{{ selectedItem.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue";

// Props
interface Props {
  visible: boolean;
}

const props = defineProps<Props>();

// 按钮配置接口
interface ButtonConfig {
  id: string;
  label: string;
  action: () => void;
  icon?: string;
  description?: string;
}

// 滚轮选择器数据 - 为每个按钮预留功能插口
const buttonConfigs: ButtonConfig[] = [
  { id: 'A', label: 'A.红蓝双方病逝概览', action: () => handleActionA(), description: '功能A' },
  { id: 'B', label: 'B.蓝方兵力部署', action: () => handleActionB(), description: '功能B' },
  { id: 'C', label: 'C.蓝方J15作战机', action: () => handleActionC(), description: '功能C' },
  { id: 'D', label: 'D.蓝方KJ200作战机', action: () => handleActionD(), description: '功能D' },
  { id: 'E', label: 'E.蓝方基站雷达', action: () => handleActionE(), description: '功能E' },
  { id: 'F', label: 'F.红方兵力部署', action: () => handleActionF(), description: '功能F' },
  { id: 'G', label: 'G.红方KJ200作战机', action: () => handleActionG(), description: '功能G' },
  { id: 'H', label: 'H.红方兵力-J20作战机', action: () => handleActionH(), description: '功能H' },
  { id: 'I', label: 'I.红方指挥所', action: () => handleActionI(), description: '功能I' },
  { id: 'J', label: 'J.红方红旗16', action: () => handleActionJ(), description: '功能J' },
  { id: 'K', label: 'K', action: () => handleActionK(), description: '功能K' },
  { id: 'L', label: 'L', action: () => handleActionL(), description: '功能L' },
  { id: 'M', label: 'M', action: () => handleActionM(), description: '功能M' },
  { id: 'N', label: 'N', action: () => handleActionN(), description: '功能N' },
  { id: 'O', label: 'O', action: () => handleActionO(), description: '功能O' },
  { id: 'P', label: 'P', action: () => handleActionP(), description: '功能P' },
  { id: 'Q', label: 'Q', action: () => handleActionQ(), description: '功能Q' },
  { id: 'R', label: 'R', action: () => handleActionR(), description: '功能R' },
  { id: 'S', label: 'S', action: () => handleActionS(), description: '功能S' },
  { id: 'T', label: 'T', action: () => handleActionT(), description: '功能T' }
];

const currentIndex = ref(0);
const centerIndex = 2; // 中心位置索引（显示5个项目，中心是第3个）

// 功能处理函数 - 为每个按钮预留的功能插口
const handleActionA = () => console.log('执行功能A');
const handleActionB = () => console.log('执行功能B');
const handleActionC = () => console.log('执行功能C');
const handleActionD = () => console.log('执行功能D');
const handleActionE = () => console.log('执行功能E');
const handleActionF = () => console.log('执行功能F');
const handleActionG = () => console.log('执行功能G');
const handleActionH = () => console.log('执行功能H');
const handleActionI = () => console.log('执行功能I');
const handleActionJ = () => console.log('执行功能J');
const handleActionK = () => console.log('执行功能K');
const handleActionL = () => console.log('执行功能L');
const handleActionM = () => console.log('执行功能M');
const handleActionN = () => console.log('执行功能N');
const handleActionO = () => console.log('执行功能O');
const handleActionP = () => console.log('执行功能P');
const handleActionQ = () => console.log('执行功能Q');
const handleActionR = () => console.log('执行功能R');
const handleActionS = () => console.log('执行功能S');
const handleActionT = () => console.log('执行功能T');

// 计算可见项目（显示5个项目，首尾相连）
const visibleItems = computed(() => {
  const result: string[] = [];
  for (let i = -2; i <= 2; i++) {
    const index = (currentIndex.value + i + buttonConfigs.length) % buttonConfigs.length;
    result.push(buttonConfigs[index].label);
  }
  return result;
});

// 当前选中的按钮配置
const selectedItem = computed(() => buttonConfigs[currentIndex.value]);

// 处理中心框按钮点击事件
const handleButtonClick = () => {
  const currentButton = selectedItem.value;
  console.log(`点击了按钮: ${currentButton.label} (${currentButton.description})`);
  // 执行当前选中按钮的功能
  currentButton.action();
};

// 处理滚轮事件
const handleWheel = (event: WheelEvent) => {
  // 阻止事件冒泡，避免影响 Cesium 地图
  event.stopPropagation();
  
  if (event.deltaY > 0) {
    // 向下滚动
    currentIndex.value = (currentIndex.value + 1) % buttonConfigs.length;
  } else {
    // 向上滚动
    currentIndex.value = (currentIndex.value - 1 + buttonConfigs.length) % buttonConfigs.length;
  }
};

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
  /* 启用滚轮交互，但不能点击 */
  pointer-events: auto;
  cursor: default; /* 改为默认光标，表示不可点击 */
}

/* 滚轮选择器容器 */
.scroll-picker-container {
  position: absolute;
  top: 50%;
  left: calc(100vh + 200px - 25vw + 50px - 150px); /* 相对于环形区域定位 */
  transform: translateY(-50%);
  width: 300px;
  height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 选择器项目 */
.picker-item {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  margin: 10px 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* 选择器项目不可点击，只是视觉显示 */
  pointer-events: none;
  cursor: default;
}

.picker-item.active {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

/* 圆环中心框 */
.center-bar {
  width: 210px;
  height: 60px;
  background: transparent; /* 改为透明背景 */
  border: 2px solid rgba(255, 255, 255, 0.9); /* 添加白色边框 */
  /* 定位在页面垂直中心与环形毛玻璃的交汇处 */
  position: absolute;
  top: 50%; /* 页面垂直中心 */
  left: calc(25vw - 58px); /* 在25vw位置，减去自身宽度的一半来居中 */
  transform: translateY(-50%); /* 垂直居中 */
  border-radius: 5px; /* 稍微圆角 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 只有中心框可以点击 */
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
}

.center-bar:hover {
  border-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.center-bar:active {
  transform: translateY(-50%) scale(0.95);
}

/* 选中项目显示 */
.selected-item {
  font-size: 16px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
}
</style>
