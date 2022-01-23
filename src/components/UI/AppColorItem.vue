<template>
  <div class="color-item">
    <div class="centered">
      <div class="color-item-circle" :style="{ 'background-color': color }"></div>
    </div>
    <div class="color-item-title body-font">
      <slot>
        {{ title }}
      </slot>
    </div>
  </div>
</template>

<script>

export default {
  name: Event,
  props: {
    title: String,
    color: String
  }
}
</script>

<style lang="scss" scoped>
.color-item {
  width: 100%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  margin: 0;
}

.color-item-circle {
  display: inline-block;
  height: 10px;
  width: 10px;
  margin: 5px 5px 5px 0;
  border-radius: 50%;
}

.color-item-title {
  width: 100%;
  margin: 2px 5px;
}
</style>
