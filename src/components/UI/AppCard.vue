<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'AppCard',
  props: {
  }
}
</script>

<style scoped lang="scss">
.card {
  background-color: white;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
  border-radius: 10px;
}
</style>
