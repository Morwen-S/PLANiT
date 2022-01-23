<template>
  <div>
    <date-picker
      v-model="range"
      :first-day-of-week="0"
      locale="en"
      @update:modelValue="$emit('update:modelValue', range)"
      :masks="{ input: ['DD MMM'] }"
      is-range color="blue"
    >
      <template v-slot="{ inputValue, togglePopover }">
        <app-btn  @click="togglePopover" outlined color="secondary">
          <i class="fas fa-calendar-day"></i>
          <span style="margin-left: 5px">{{ getInputsPeriod(inputValue) }}</span>
        </app-btn>
      </template>
    </date-picker>
  </div>
</template>

<script>
import { DatePicker } from 'v-calendar'

export default {
  name: 'AppDatePicker',
  emits: ['update:modelValue'],
  props: {
    modelValue: Object
  },
  components: {
    DatePicker
  },
  data () {
    return {
      range: {
        start: new Date(2020, 0, 1),
        end: new Date(2020, 0, 5)
      }
    }
  },
  methods: {
    getInputsPeriod (inputValue) {
      if (inputValue.start === inputValue.end) {
        return inputValue.start
      }
      return inputValue.start + ' - ' + inputValue.end
    }
  },
  watch: {
    modelValue (val) {
      if (val.start !== this.range.start || val.end !== this.range.end) {
        this.range = {
          start: val.start,
          end: val.end
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
