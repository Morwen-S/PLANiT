<template>
  <div class="app-month-selector headline">
    <div class="app-month-selector_left-control" @click="toPrevious">
      <i class="fa fa-angle-left" aria-hidden="true"></i>
    </div>
    <div class="app-month-selector_text centered">{{ text }}</div>
    <div class="app-month-selector_right-control" @click="toNext">
      <i class="fa fa-angle-right" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script>
import { getMonthName, getNextMonth, getPreviousMonth, getNextDay, getPreviousDay } from '@/services/date-services'

export default {
  name: 'AppMonthSelector',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Date,
      default: () => new Date()
    },
    mode: {
      type: String
    }
  },
  computed: {
    text () {
      let text = ''
      if (this.mode === 'day') {
        text += this.modelValue.getDate()
      }
      return text + ' ' + getMonthName(this.modelValue).slice(0, 3) + ' ' + this.modelValue.getFullYear()
    }
  },
  methods: {
    toPrevious () {
      if (this.mode === 'month') {
        this.$emit('update:modelValue', getPreviousMonth(this.modelValue))
      } else {
        this.$emit('update:modelValue', getPreviousDay(this.modelValue))
      }
    },
    toNext () {
      if (this.mode === 'month') {
        this.$emit('update:modelValue', getNextMonth(this.modelValue))
      } else {
        this.$emit('update:modelValue', getNextDay(this.modelValue))
      }
    }
  }
}
</script>

<style scoped lang="scss">
.app-month-selector {
  display: flex;
  width: 100%;
  align-items: center;

  div {
    border: 1px solid $primary-color;
    border-radius: 3px;
      padding: 5px 10px;
    height: 30px;
    transition: 0.3s;
  }

  .app-month-selector_right-control, .app-month-selector_left-control {
    cursor: pointer;
    &:hover {
      background-color: $secondary-color;
    }
  }

  .app-month-selector_text {
    margin: 0 5px;
    width: 115px;
  }
  @media (max-width: 600px) {
    .app-month-selector_text {
      width: 90%;
    }
  }
}
</style>
