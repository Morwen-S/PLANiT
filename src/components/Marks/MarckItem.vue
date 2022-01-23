<template>
  <app-color-item
    :color="markColor"
    :title="marksTitle"
  />
</template>

<script>
import { getFirstMarkId, getMarkById } from '@/api/marks'
import AppColorItem from '@/components/UI/AppColorItem'

export default {
  name: 'MarkItem',
  components: { AppColorItem },
  props: {
    markId: {
      type: String,
      default: getFirstMarkId()
    }
  },
  computed: {
    mark () {
      return getMarkById(this.markId)
    },
    markColor () {
      return this.mark ? this.mark.color : '#CACACA'
    },
    marksTitle () {
      return this.mark ? this.mark.text : ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
