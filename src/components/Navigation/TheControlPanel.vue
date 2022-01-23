<template>
  <div class="control-panel">
    <app-month-selector v-model="currentDate" :mode="mode"/>
    <div class="control-panel-mode-selector headline">
      <div @click="changeMode('day')" class="centered" :class="{ 'active': mode === 'day' }">DAY</div>
      <div @click="changeMode('month')" class="centered" :class="{ 'active': mode === 'month' }">MONTH</div>
    </div>
  </div>
</template>

<script>
import AppMonthSelector from '@/components/UI/AppMonthSelector'

export default {
  name: 'TheControlPanel',
  components: { AppMonthSelector },
  emits: ['update:modelValue', 'update:mode'],
  props: {
    modelValue: {
      type: Date,
      default: () => new Date()
    },
    mode: {
      type: String,
      default: 'month'
    }
  },
  data () {
    return {
      currentDate: this.modelValue
    }
  },
  methods: {
    changeMode (mode) {
      this.$emit('update:mode', mode)
    }
  },
  watch: {
    modelValue (val) {
      this.currentDate = val
    },
    currentDate (val) {
      this.$emit('update:modelValue', val)
    }
  }
}
</script>

<style scoped lang="scss">
.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 5px;

  &-mode-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 600px) {
      width: 100%;
      margin-top: 10px;
    }

    div {
      cursor: pointer;
      width: 100px;
      margin-left: 5px;
      transition: 0.3s;

      border-radius: 3px;
      border: 1px solid $primary-color;
      padding: 5px;

      @media (max-width: 600px) {
        width: 50%;
      }

      &:hover {
        background-color: $secondary-color;
      }
    }
    .active {
      background-color: $primary-color;
      color: white;

      &:hover {
        background-color: $primary-color;
      }
    }
  }
}

@media (max-width: 600px) {
  .control-panel {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
