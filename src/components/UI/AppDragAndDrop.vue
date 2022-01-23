<template>
  <transition-group name="flip-list" tag="div">
    <div
      v-for="(item, i) in items"
      :key="item.id"
      @drop='onDrop($event, i)'
      @dragstart='startDrag($event, i)'
      @dragover.prevent
      @dragenter.prevent
      :draggable="!disabled"
    >
      <slot name="item" :item="item"/>
    </div>
  </transition-group>
</template>

<script>

export default {
  name: 'AppDragAndDrop',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      items: this.modelValue
    }
  },
  methods: {
    startDrag: (evt, index) => {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('index', index)
    },
    onDrop (evt, index) {
      const indexMoved = +evt.dataTransfer.getData('index')
      this.items.splice(index, 0, this.items.splice(indexMoved, 1)[0])
      this.$emit('update:modelValue', this.items)
    }
  },
  watch: {
    modelValue (val) {
      this.items = val
    }
  }
}

</script>

<style scoped>

</style>
