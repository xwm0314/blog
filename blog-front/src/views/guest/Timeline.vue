<template>
  <div class="timeline-page">
    <div class="page-header">
      <span class="page-eyebrow">MEMORIES</span>
      <h1 class="page-title">成长时间线</h1>
      <p class="page-desc">记录一路走来的点点滴滴</p>
    </div>
    <div class="timeline-list">
      <p class="empty-text">暂无记录</p>
    </div>
  </div>
</template>

<script setup>
// TODO: 对接时间线 API
</script>

<style lang="scss" scoped>
.timeline-page {
  padding-top: 60px;
  padding-bottom: $spacing-3xl;
}

.page-header {
  text-align: center;
  padding: $spacing-2xl 0 $spacing-xl;
}

.page-eyebrow {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  letter-spacing: $tracking-wider;
  color: $pink-400;
  display: block;
  margin-bottom: $spacing-sm;
}

.page-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text;
  letter-spacing: $tracking-tight;
  margin-bottom: $spacing-sm;
}

.page-desc {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.timeline-list {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}

.empty-text {
  text-align: center;
  color: $color-text-secondary;
  padding: $spacing-3xl 0;
}
</style>
