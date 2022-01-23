<template>
  <div class="overlay" @click="isOpen = false" :class="{ 'close': !isOpen, 'open': isOpen }"></div>

  <aside class="sidebar" :class="{ 'close': !isOpen, 'open': isOpen }">

    <div class="sidebar-logo">
      <span class="sidebar-logo-text">PLANiT</span>
      <app-btn @click="logOut" icon color="secondary">
        <i class="fas fa-sign-out-alt"></i>
      </app-btn>
    </div>

    <div class="sidebar-menu-btn centered">
      <app-btn @click="isOpen = true" icon color="secondary">
        <i class="fas fa-bars"></i>
      </app-btn>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="mode === 'day'" class="sidebar-calendar">
        <calendar
          ref="calendar"
          is-expanded locale="en"
          @update:to-page="getTasksForCalendar"
          @dayclick="openDay"
          :first-day-of-week="0"
          :attributes="calendarAttr"
        />
      </div>

      <app-card v-else class="sidebar-tasks">
        <div class="sidebar-tasks-title headline">
          TODAY
        </div>
        <app-divider/>
        <div class="sidebar-tasks-list body-font">
          <ul v-if="currentDayTasks.length > 0">
            <li
              v-for="task in currentDayTasks"
              :key="task.id"
              :style="{ backgroundColor: markColor(task.markId) }"
            >
              <app-checkbox
                :label="task.title"
                v-model="task.isChecked"
                @update:modelValue="save(task)"
              >
                <div @click="openTask(task)">
                  <span class="sidebar-tasks-list-title">{{ task.title }}</span>
                </div>
              </app-checkbox>
            </li>
          </ul>
          <div class="no-task-img-content sidebar-tasks-list-empty centered headline secondary-font" v-else>
            <img src="@/assets/task.svg" alt="Kiwi standing on oval ">
            NO TASKS
          </div>
        </div>
        <app-btn @click="openTask({})" width="100%">
          + Add task
        </app-btn>
      </app-card>
    </transition>

    <div class="sidebar-marks">
      <div class="sidebar-marks-title">
        <app-btn @click="isMarkListOpen = !isMarkListOpen" color="secondary" style="margin-right: 5px; width: 20px " icon>
          <i v-if="!isMarkListOpen" class="fas fa-angle-right"></i>
          <i v-else class="fas fa-angle-down"></i>
        </app-btn>
        <span class="headline">My Marks</span>
        <app-btn @click="openMarkDialog({})" color="secondary" style="float: right; margin-right: 5px" icon>
          <i class="fas fa-plus"></i>
        </app-btn>
      </div>

      <transition name="app-slide-fade">
        <div v-if="isMarkListOpen" class="sidebar-marks-list">
          <app-divider/>
          <div v-for="mark in marks" :key="mark.id" class="sidebar-marks-list-item" :class="{'sidebar-marks-list-item__active': activeMarks.includes(mark)}">

            <div class="sidebar-marks-list-item-title" @click="filterTickets(mark)">
              <app-marcked-item :mark-id="mark.id">
                <span>{{ mark.title }}</span>
              </app-marcked-item>
            </div>

            <div class="sidebar-marks-list-item-actions">
              <app-btn color="secondary" @click="editMark(mark)" icon>
                <i class="fas fa-pen"></i>
              </app-btn>
              <app-delete-dialog v-if="marks.length > 1" @delete="deleteMarkAndTask(mark)">
                <template v-slot:default="{ open }">
                  <app-btn color="secondary" @click="open" style="margin-left: 4px" icon>
                    <i class="fas fa-trash-alt"></i>
                  </app-btn>
                </template>
                <template v-slot:description>
                  section <span class="headline">{{ mark.text }}</span> and all it's tasks
                </template>
              </app-delete-dialog>
            </div>
          </div>
          <app-divider/>
        </div>
      </transition>
    </div>
  </aside>
</template>

<script>
import { addMarkFilters, subscribeOnTasks, unsubscribeOnTasks } from '@/services/tasks-service'
import { saveChanges } from '@/api/tasks'
import { getStartOfMonth, getEndOfMonth, parseToString } from '@/services/date-services'
import { getMarks, deleteMark } from '@/api/marks'
import { logOut } from '@/api/authentication'

import AppCheckbox from '@/components/UI/AppCheckbox'
import AppMarckedItem from '@/components/Marks/MarckItem'
import AppDeleteDialog from '@/components/Task/AppDeleteDialog'
import { Calendar } from 'v-calendar'

export default {
  name: 'TheSidebar',
  components: {
    AppDeleteDialog,
    AppMarckedItem,
    AppCheckbox,
    Calendar
  },
  props: {
    mode: {
      type: String,
      default: 'month'
    },
    date: [String, Date]
  },
  emits: ['openEvent', 'openDay', 'logOut', 'openMarkDialog'],
  data () {
    return {
      marks: [],
      activeMarks: [],
      isMarkListOpen: true,
      isOpen: false,
      currentDay: {
        key: 'today',
        highlight: {
          fillMode: 'light'
        },
        dates: new Date()
      },
      currentDayTasks: [],
      monthTasks: []
    }
  },
  computed: {
    calendarAttr () {
      const date = new Date(this.date.toString())
      const selectedDate = {
        highlight: true,
        dates: date.setHours(0, 0, 0, 0)
      }
      return [this.currentDay, ...this.monthTasks, selectedDate]
    }
  },
  created () {
    const currentDate = new Date()
    this.getTasksForCalendar(this.date)
    subscribeOnTasks({ from: currentDate }, 'theSidebarDay', (val) => {
      const key = parseToString(currentDate)
      this.currentDayTasks = val[key] ?? []
    })
    this.marks = getMarks()
    this.activeMarks = this.marks
  },
  methods: {
    filterTickets (mark) {
      if (this.activeMarks.includes(mark)) {
        this.activeMarks = this.activeMarks.filter(x => x !== mark)
      } else {
        this.activeMarks.push(mark)
      }
      const filters = this.marks.filter(mark => !this.activeMarks.includes(mark))
      addMarkFilters(filters.map(x => x.id))
    },
    async deleteMarkAndTask (mark) {
      await deleteMark(mark.id)
      this.marks = getMarks()
    },
    editMark (mark) {
      this.openMarkDialog(mark)
    },
    openMarkDialog (mark) {
      this.$emit('openMarkDialog', mark)
    },
    logOut () {
      logOut()
      this.$emit('logOut')
    },
    openDay (day) {
      this.$emit('openDay', day.date)
    },
    openTask (task) {
      this.$emit('openEvent', { event: task, day: new Date() })
    },
    markColor (markId) {
      const mark = this.marks.find(x => x.id === markId)
      return mark ? mark.color : '#CACACA'
    },
    save (task) {
      saveChanges(task)
    },
    getTasksForCalendar (newDate) {
      if (!(newDate instanceof Date)) {
        newDate = new Date(newDate.year, newDate.month - 1, 1)
      }
      const from = getStartOfMonth(newDate)
      const to = getEndOfMonth(newDate)
      unsubscribeOnTasks('TheSidebarCalendar')
      subscribeOnTasks({ from, to }, 'TheSidebarCalendar', (val) => {
        this.monthTasks = Object.entries(val).reduce((acc, val) => {
          const data = val[0].split('-').map(x => +x).reverse()
          const list = val[1].map(todo => {
            return { dates: new Date(...data), bar: { style: { backgroundColor: this.markColor(todo.markId) } } }
          })
          acc.push(...list)
          return acc
        }, [])
      })
    }
  },
  watch: {
    date (newVal) {
      this.$nextTick(() => {
        const calendar = this.$refs.calendar
        if (calendar) {
          calendar.move(newVal)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  display: none;
}

.sidebar {
  background-color: $primary-color;
  width: 300px;
  padding: 20px 10px;
  transition: width 0.5s;

  &-logo {
    margin: 0 0 20px;
    display: flex;
    justify-content: space-between;

    &-text {
      font-size: 24px;
      font-weight: bold;
      color: white;
    }
  }

  &-menu-btn {
    display: none;
  }

  &-calendar {
    margin: 0 0 20px;
  }

  &-tasks {
    padding: 10px;
    margin: 0 0 20px;

    &-title {
      margin: 0 10px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-list {
      height: 190px;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      ul {
        list-style-type: none;
      }

      li {
        cursor: pointer;
        margin: 3px 0;
        transition: all 0.4s ease-out;
        border-radius: 5px;

        &:hover {
          filter: brightness(90%);
        }
      }

      &-title {
        cursor: pointer;
        width: 100%;
        display: table-cell;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      &-empty {
        width: 100%;
        height: 100%;
        flex-direction: column;

        img {
          height: 60%;
          width: 60%;
          margin-bottom: 10px;
        }
      }
    }
  }

  &-marks {
    color: white;

    &-title {
      margin: 10px 5px;
    }

    &-list {
      max-height: 400px;

      &-item {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        margin: 3px 0;

        div {
          padding: 2px 5px;
          border-radius: 5px;
          background-color: lighten($primary-color, 2);
          transition: all ease-out 100ms;

          &:active {
            transform: translateY(1px);
          }
        }

        &-title {
          border-radius: 5px;
          flex-grow: 1;
          margin-right: 5px;
        }

        &-actions {
          display: flex;
          float: right;
        }

        &:hover {
          div {
            background-color: lighten($primary-color, 5);
          }
        }

      }

      &-item__active {
        div {
          background-color: lighten($primary-color, 10);
        }
        &:hover {
          div {
            background-color: lighten($primary-color, 15);
          }
        }
      }

    }
  }
}

@media (max-width: 1100px) {

  .close {
    &.sidebar {
      width: 40px;
      transition: none !important;
    }

    .sidebar-menu-btn {
      display: flex;
    }

    .sidebar-calendar, .sidebar-tasks, .sidebar-marks, .sidebar-logo-text {
      display: none;
    }
  }

  .open {
    &.sidebar {
      position: fixed;
      height: 100vh;
      top: 0;
      left: 0;
      overflow-x: hidden;
      z-index: 900;
    }

    .sidebar-calendar, .sidebar-tasks, .sidebar-marks {
      display: block;
    }

    .sidebar-logo-text {
      display: flex;
    }

    &.overlay {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.9);
      height: 100vh;
      width: 100vw;
      z-index: 800;
    }
  }
}

</style>
