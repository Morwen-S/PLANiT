<template>
  <table class="calendar-table title">
    <tr>
      <th v-for="weekday in weekdays" :key="weekday">
        {{ weekday }}
      </th>
    </tr>
    <tr v-for="(week, i) in dayList" :key="'week' + i">
      <td v-for="day in week" :key="day.timestamp">
        <div class="calendar-day">
          <div class="calendar-day-title">
            <app-btn @click="openTask({}, day)" icon color="primary">
              <i class='fas fa-plus-circle'></i>
            </app-btn>
            <div
              @click="$emit('openDay', day.timestamp)"
              :class="{ 'secondary-font': day.date.length > 2, 'calendar-day-title-text_current': day.isCurrent }"
              class="calendar-day-title-text centered"
            >
              {{ day.date }}
            </div>
          </div>
          <calendar-daily-tasks
            v-if="tasks[day.dateKey]"
            :tasks="tasks[day.dateKey]"
            :date="day.timestamp"
            :week-count="weekCountOnMonth"
            @open-task="openTask"
            @open-day="$emit('openDay', day.timestamp)"
          />
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
import CalendarDailyTasks from './CalendarDailyTasks'

import { getDayListForMonth } from './util/calendar-constructor'
import { subscribeOnTasks, unsubscribeOnTasks } from '@/services/tasks-service'
import { weekCount, WEEKDAY_SHORT_NAME } from '@/services/date-services'

export default {
  name: 'Calendar',
  components: {
    CalendarDailyTasks
  },
  props: {
    date: {
      type: Date,
      default: () => new Date()
    }
  },
  emits: ['openTask', 'openDay'],
  data () {
    return {
      weekdays: WEEKDAY_SHORT_NAME,
      tasks: {}
    }
  },
  created () {
    this.getTasks()
  },
  computed: {
    weekCountOnMonth () {
      return weekCount(this.date)
    },
    dayList () {
      return getDayListForMonth(this.date)
    }
  },
  methods: {
    getTasks () {
      unsubscribeOnTasks('TheCalendar')
      const from = this.dayList[0]
      const to = this.dayList[this.dayList.length - 1]
      const period = { from: from[0].timestamp, to: to[to.length - 1].timestamp }
      subscribeOnTasks(period, 'TheCalendar', (val) => { this.tasks = val })
    },
    openTask (task, day) {
      this.$emit('openTask', { event: task, day: day?.timestamp })
    }
  },
  watch: {
    dayList () {
      this.getTasks()
    }
  }
}

</script>

<style lang="scss" scoped>

.calendar {

  &-table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    border-top: none;

    td {
      border: 1px solid $secondary-color;
      min-height: calc(100% / 6);
      width: calc(100% / 7);
      vertical-align: top;

      &:first-child, &:last-child {
        background-color: $light-grey-color;
      }
    }

    th {
      height: 40px;
      text-align: end;
      vertical-align: bottom;
      padding-right: 15px;
      padding-bottom: 5px;

      &:first-child, &:last-child {
        color: $secondary-color;
      }
    }
  }

  &-day {
    height: 100%;
    min-height: 120px;

    &:hover {
      i { visibility: visible; }
    }

    &-title {
      padding: 0.3rem 0.5rem 0 ;
      display: flex;
      align-items: center;
      justify-content: space-between;

      i {
        cursor: pointer;
        color: $secondary-color;
        visibility: hidden;
      }

      &-text {
        transition: 0.2s;
        height: 30px;

        &:hover {
          cursor: pointer;
          color: $accent-color
        }
      }
      &-text_current {
        width: 30px;
        height: 30px;
        background-color: $primary-color;
        border-radius: 50%;
        color: white;
      }
    }
  }
}

</style>
