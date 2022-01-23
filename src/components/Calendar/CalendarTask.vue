<template>
  <div class="calendar-task" :style="taskStyle" @click="$emit('openTask')">
    <div class="calendar-task-mark" :style="{ 'background-color': markColor }"></div>
    <div class="calendar-task-title">
      <span class="calendar-task-title_text body-font" :class="{'is-checked-font secondary-font': isChecked }">{{ title }}</span>
    </div>
  </div>
</template>

<script>
import { getMarkById } from '@/api/marks'

export default {
  name: 'CalendarTask',
  props: {
    title: String,
    isChecked: Boolean,
    markId: String,
    isEmpty: Boolean,
    period: [Number, String]
  },
  emits: {
    openTask: null
  },
  computed: {
    taskStyle () {
      let style = {}
      if (this.isEmpty) {
        return { visibility: 'hidden' }
      }
      style = {
        'background-color': this.markColor,
        width: 'calc(100% * ' + this.period + ')'
      }
      if (this.isChecked) {
        style['background-color'] = '#eeeeee'
      }
      return style
    },
    markColor () {
      const mark = getMarkById(this.markId)
      return mark ? mark.color : '#CACACA'
    }
  }
}
</script>

<style scoped lang="scss">
.calendar-task {
  cursor: pointer;
  display: inline-flex;
  border-radius: 3px;
  align-items: center;
  position: relative;
  transition: 0.3s;

  &:hover {
    filter: brightness(90%);
  }

  &-mark {
    display: inline-block;
    height: 10px;
    width: 10px;
    margin: 5px;
    border-radius: 50%;
  }

  &-title {
    display: table;
    table-layout: fixed;
    width: calc(100% - 10px);
    margin: 2px 0;

    &_text {
      display: table-cell;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}

</style>
