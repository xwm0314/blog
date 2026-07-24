<template>
  <section class="hero-cover">
    <div class="hero-bg">
      <div class="hero-gradient"></div>
      <div class="hero-mesh"></div>
      <div class="hero-ambient"></div>
    </div>

    <div class="hero-layout">
      <div class="hero-text-col">
        <div class="hero-eyebrow">PERSONAL SPACE</div>
        <h1 class="hero-nickname">{{ siteConfig.nickname }}</h1>
        <p class="hero-slogan">{{ siteConfig.slogan }}</p>
      </div>
      <div class="hero-visual-col">
        <div class="hero-avatar-ring">
          <img
            :src="siteConfig.avatar || '/src/assets/images/default-avatar.png'"
            alt="avatar"
            class="hero-avatar-img"
          />
        </div>
      </div>
    </div>

    <div class="scroll-indicator" @click="scrollDown">
      <span class="scroll-hint">滚动查看更多</span>
      <span class="scroll-arrow">&darr;</span>
    </div>
  </section>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const siteConfig = appStore.siteConfig

function scrollDown() {
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.hero-cover {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse 80% 60% at 20% 20%, rgba($pink-200, 0.8) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 80% 30%, rgba($purple-pink-200, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse 60% 70% at 50% 90%, rgba($pink-100, 0.9) 0%, transparent 60%),
    linear-gradient(180deg, #fef5f8 0%, #fde8ef 30%, #f9d4e0 60%, #f4b8ca 100%);
}

.hero-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 10% 80%, rgba($rose-200, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse 40% 50% at 90% 70%, rgba($purple-pink-300, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 30% 50%, rgba($pink-200, 0.3) 0%, transparent 55%);
  animation: heroMeshFloat 20s ease-in-out infinite alternate;
}

@keyframes heroMeshFloat {
  0% { background-position: 10% 80%, 90% 70%, 30% 50%; }
  50% { background-position: 20% 70%, 80% 60%, 40% 40%; }
  100% { background-position: 15% 75%, 85% 65%, 35% 45%; }
}

.hero-ambient {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

.hero-layout {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-xl;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-2xl;
  align-items: center;
}

.hero-text-col {
  animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.hero-eyebrow {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  letter-spacing: $tracking-wider;
  color: rgba($pink-600, 0.6);
  margin-bottom: $spacing-lg;
}

.hero-nickname {
  font-size: $font-size-hero;
  font-weight: $font-weight-bold;
  background: linear-gradient(135deg, $pink-600 0%, $purple-pink-500 50%, $pink-500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: $tracking-tight;
  line-height: 1.1;
  margin-bottom: $spacing-md;
  filter: drop-shadow(0 4px 20px rgba($pink-400, 0.3));
}

.hero-slogan {
  font-size: $font-size-lg;
  color: rgba($pink-700, 0.7);
  font-weight: $font-weight-normal;
  line-height: 1.5;
  max-width: 28rem;
  text-wrap: balance;
  margin-bottom: 0;
}

.hero-visual-col {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-avatar-ring {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 6s ease-in-out infinite;

  &::before {
    content: "";
    position: absolute;
    inset: -30px;
    border-radius: 50%;
    background: 
      radial-gradient(circle, rgba($pink-300, 0.4) 0%, rgba($purple-pink-300, 0.2) 40%, transparent 70%);
    animation: float 8s ease-in-out infinite reverse;
  }

  &::after {
    content: "";
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      $pink-300,
      $purple-pink-300,
      $rose-300,
      $pink-400,
      $purple-pink-400,
      $pink-300
    );
    animation: rotate-glow 10s linear infinite;
    opacity: 0.6;
    filter: blur(2px);
  }
}

@keyframes rotate-glow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    0 0 0 4px rgba($pink-300, 0.5),
    0 0 30px rgba($pink-400, 0.3),
    0 8px 32px rgba($pink-500, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 1;
}

// 中间下方箭头指示器
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  cursor: pointer;
  animation: fadeIn 1.5s ease 0.5s both;
  transition: all $transition-fast;
  padding: $spacing-sm $spacing-lg;

  &:hover {
    transform: translateX(-50%) translateY(-2px);
    
    .scroll-hint {
      color: $pink-600;
    }
    
    .scroll-arrow {
      color: $pink-600;
    }
  }
}

.scroll-hint {
  font-size: $font-size-xs;
  color: rgba($pink-600, 0.7);
  letter-spacing: $tracking-wide;
  font-weight: $font-weight-medium;
}

.scroll-arrow {
  font-size: 20px;
  color: $pink-500;
  display: inline-block;
  animation: bounceDown 2s ease-in-out infinite;
}

@media (max-width: 768px) {
  .hero-layout {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-visual-col {
    display: none;
  }

  .hero-nickname {
    font-size: 2.5rem;
  }

  .hero-slogan {
    font-size: $font-size-md;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
