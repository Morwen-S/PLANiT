<template>
  <div class="daily-tasks">
    <ul class="daily-tasks-list">
      <transition-group name="list-complete" tag="div">
        <li v-for="event in currentList" :key="event.id" class="list-complete-item">
          <task v-bind="event" @open-task="$emit('openTask', event)"/>
        </li>
      </transition-group>
      <li
        v-if="isMoreThanFour"
        @click="$emit('openDay')"
        class="daily-tasks-link body-font secondary-font"
      >
        {{ tasks.length - this.tasksOnDay }} more...
      </li>
    </ul>
  </div>
</template>

<script>
import Task from '@/components/Calendar/CalendarTask'

export default {
  name: 'CalendarDailyTasks',
  components: { Task },
  props: {
    tasks: {
      type: Array,
      default: () => []
    },
    date: Date,
    weekCount: {
      type: Number,
      default: 5
    }
  },
  emits: {
    openDay: () => {
      return true
    },
    openTask: (task) => {
      if (task && task.id) {
        return true
      } else {
        console.warn('Invalid openEvent payload!')
        return false
      }
    }
  },
  computed: {
    tasksOnDay () {
      return this.weekCount === 5 ? 4 : 3
    },
    currentList () {
      return this.tasks.slice(0, this.tasksOnDay)
    },
    isMoreThanFour () {
      return this.tasks.length > this.tasksOnDay
    }
  }
}
</script>

<style lang="scss">

.daily-tasks {

  &-list {
    list-style-type: none;
    margin: 0;

    li {
      justify-content: left;
      margin-top: 2px;
    }
  }

  &-link {
    cursor: pointer;
    padding: 1px 18px;
    border-radius: 2px;

    &:hover {
      background-color: $light-grey-color;
    }
  }
}

</style>
