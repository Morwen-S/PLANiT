<template>
  <div class="divider" :class="color">
  </div>
</template>

<script>
export default {
  name: 'AppDivider',
  props: {
    color: {
      type: String,
      default: 'secondary'
    }
  }
}
</script>

<style lang="scss" scoped>
.divider {
  width: 100%;
}

.secondary {
  border-bottom: 1px solid lighten($secondary-color, 10%);
}

.primary {
  border-bottom: 1px solid $primary-color;
}
</style>
