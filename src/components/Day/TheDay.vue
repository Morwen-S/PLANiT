<template>
  <div class="day">
    <div v-for="(_, category) in tasks" class="day-task-list" :key="category">
      <div class="day-task-list-title">
        <h2 class="title">{{ category === 'today' ? dayMainTitle : 'Long-term tasks' }}</h2>
        <h3 v-if="category === 'today'" class="secondary-font headline">{{ daySecondaryTitle }}</h3>
      </div>
      <app-divider/>

      <ul class="task-list">
        <li v-for="task in tasks[category]" :key="task.id">
          <div class="task-list-item">
            <div class="task-list-item-open">
              <app-btn
                v-if="task.subtasks && task.subtasks.length > 0"
                @click="openSubtask(task)"
                color="secondary" style="margin-left: 5px" icon
              >
                <i v-if="!openedSubtask.includes(task.id)" class="fas fa-angle-right"></i>
                <i v-else class="fas fa-angle-down"></i>
              </app-btn>
            </div>
            <app-checkbox-task
              :title="task.title"
              :is-checked="task.isChecked"
              :color="markColor(task.markId)"
              :subtask-score="getSubtasksScore(task)"
              @deleteItem="deleteCurrentTask(task)"
              @open-task="openCurrentTask(task)"
              @update-task="changeCurrentTask($event, task)"
            />
          </div>
          <transition name="app-slide-fade">
            <ul
              v-if="task.subtasks"
              class="task-list-item-subtasks"
              :style="subtaskListStyle(openedSubtask.includes(task.id), task.subtasks.length)"
            >
              <li
                v-for="subtask in task.subtasks" :key="subtask.id"
                :style="{ border: '1px solid' + markColor(task.markId) }"
                class="task-list-item"
              >
                <app-checkbox-task
                  :title="subtask.title"
                  :is-checked="subtask.isChecked"
                  color="#fafafa"
                  @deleteItem="deleteSubtask(subtask)"
                  @open-task="openCurrentTask(task)"
                  @update-task="changeSubtask($event, subtask)"
                />
              </li>
            </ul>
          </transition>
        </li>
      </ul>
      <app-add-task v-if="category === 'today'" is-mark-select @addTask="addNewTask"/>
    </div>
  </div>
</template>

<script>
import { getNameWeekday, getShortMonthName, parseToString } from '@/services/date-services'
import { getSubTasksByTaskId, editSubtask, deleteSubtask } from '@/api/subtask'
import { getMarks } from '@/api/marks'
import { addTask, deleteTask, saveChanges } from '@/api/tasks'
import { subscribeOnTasks, unsubscribeOnTasks } from '@/services/tasks-service'

import AppCheckboxTask from '@/components/Task/AppCheckboxTask'
import AppAddTask from '@/components/Task/AppAddTask'

export default {
  name: 'TheDay',
  components: {
    AppAddTask,
    AppCheckboxTask
  },
  props: {
    date: {
      type: Date,
      default: () => new Date()
    }
  },
  emits: ['openTask'],
  data () {
    return {
      openedSubtask: [],
      tasks: {
        today: [],
        period: []
      }
    }
  },
  computed: {
    marks () {
      return getMarks()
    },
    isCurrentDay () {
      const currentDate = (new Date()).toString()
      const propDate = this.date.toString()
      return propDate.slice(0, 15) === currentDate.slice(0, 15)
    },
    dayMainTitle () {
      if (this.isCurrentDay) {
        return 'Today'
      }
      return getNameWeekday(this.date)
    },
    daySecondaryTitle () {
      let title = ''
      title += this.date.getDate() + ' ' + getShortMonthName(this.date)
      return title
    }
  },
  created () {
    this.getTasks()
  },
  methods: {
    subtaskListStyle (isOpen, subtaskLength) {
      if (isOpen) {
        return { maxHeight: `calc(${subtaskLength} * 60px)` }
      }
    },
    getTasks () {
      subscribeOnTasks({ from: this.date }, 'TheDay', (val) => {
        const key = parseToString(this.date)
        let list = []
        if (val[key]) {
          list = val[key].map(task => {
            task.subtasks = getSubTasksByTaskId(task.id)
            return task
          })
        }
        this.tasks.today = list.filter(x => !x.isEmpty && x.period < 2)
        this.tasks.period = list.filter(x => x.isEmpty || x.period > 1)
      })
    },
    deleteSubtask (subtask) {
      deleteSubtask(subtask.id)
    },
    deleteCurrentTask (task) {
      deleteTask(task.id)
    },
    openSubtask (subtask) {
      if (this.openedSubtask.includes(subtask.id)) {
        this.openedSubtask = this.openedSubtask.filter(x => x !== subtask.id)
      } else {
        this.openedSubtask.push(subtask.id)
      }
    },
    markColor (markId) {
      const mark = this.marks.find(x => x.id === markId)
      return mark ? mark.color : '#CACACA'
    },
    changeSubtask ({ title, isChecked }, subtask) {
      subtask.title = title ?? subtask.title
      subtask.isChecked = isChecked ?? subtask.isChecked
      editSubtask(subtask)
    },
    openCurrentTask (task) {
      this.$emit('openTask', { event: task })
    },
    getSubtasksScore (task) {
      const subtasks = getSubTasksByTaskId(task.id)
      if (subtasks.length < 1) {
        return ''
      }
      const checkedTasksCount = subtasks.filter(subtask => subtask.isChecked).length
      return checkedTasksCount + '/' + subtasks.length
    },
    changeCurrentTask ({ title, isChecked }, task) {
      task.title = title ?? task.title
      task.isChecked = isChecked ?? task.isChecked
      saveChanges(task)
    },
    addNewTask ({ title, markId }) {
      addTask({
        startDate: new Date(this.date.setHours(0, 0, 0, 0)).getTime(),
        endDate: this.date.getTime(),
        title,
        markId,
        description: ''
      })
    }
  },
  watch: {
    date (newValue, oldValue) {
      this.openedSubtask = []
      unsubscribeOnTasks(oldValue, 'TheDay')
      this.getTasks()
    }
  }
}
</script>

<style lang="scss" scoped>
.day {
  margin: 20px 10%;

  &-task-list {
    margin-bottom: 20px;

    &-title {
      display: flex;
      margin: 0;
      justify-content: space-between;

      h2, h3 {
        margin: 0 10px 10px 0;
        align-self: flex-end;
      }
    }
  }
}

.task-list {
  li {
    margin: 5px 0;
    transition: all 0.4s ease-out;
  }

  &-item {
    display: flex;
    border-radius: 5px;

    &-open {
      width: 40px;
      margin-left: -30px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 5px;
    }

    &-subtasks {
      padding: 0 0 0 30px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.2s ease-out
    }
  }
}
</style>
