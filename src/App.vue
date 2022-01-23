<template>
  <div v-if="isLoading" class="loader centered">
    <app-loader/>
  </div>
   <div v-else class="container">
     <div v-if="!isAuth" class="authentication-block">
       <the-authentication @signIn="openCalendar"/>
     </div>
     <template v-else>
       <event-dialog
         :task="selectedEvent"
         :date="newEventDate"
         v-model="isEventOpen"
       />
       <mark-dialog
         v-model="isMarkOpen"
         :mark="mark"
         @update:modelValue="checkMark"
       />
       <the-sidebar
         :date="currentDate"
         :mode="mode"
         @open-event="openEventDialog"
         @open-mark-dialog="openMarkDialog"
         @open-day="openDay"
         @log-out="isAuth = false"
       />
       <main class="container__main">
         <div class="control-panel-container">
           <the-control-panel v-model="currentDate" v-model:mode="mode" @update:mode="changeMode"/>
         </div>
         <div class="content-container">
           <transition name="fade" mode="out-in">
             <the-calendar v-if="mode === 'month'" :date="currentDate" @open-task="openEventDialog" @open-day="openDay"/>
             <the-day v-else :date="currentDate"  @open-task="openEventDialog"/>
           </transition>
         </div>
       </main>
     </template>
   </div>
</template>

<script>
import TheAuthentication from '@/components/TheAuthentication'
import TheSidebar from '@/components/Navigation/TheSidebar'
import TheCalendar from '@/components/Calendar/TheCalendar'
import TheDay from '@/components/Day/TheDay'
import TheControlPanel from '@/components/Navigation/TheControlPanel'
import EventDialog from '@/components/Task/AppTaskDialog'
import MarkDialog from '@/components/Marks/MarkDialog'

import { checkIsLogged } from '@/api/authentication'
import { getTasks } from '@/api/tasks'
import { getUserSubtasks } from '@/api/subtask'
import { getUserMarks } from '@/api/marks'
import AppLoader from '@/components/UI/AppLoader'

export default {
  name: 'App',
  components: {
    AppLoader,
    TheAuthentication,
    TheControlPanel,
    TheSidebar,
    TheCalendar,
    TheDay,
    EventDialog,
    MarkDialog
  },
  data () {
    return {
      mark: {},
      isLoading: true,
      isAuth: false,
      currentDate: new Date(),
      isEventOpen: false,
      isMarkOpen: false,
      newEventDate: new Date(),
      selectedEvent: {},
      mode: 'month'
    }
  },
  created () {
    checkIsLogged((is) => {
      if (is) {
        this.openCalendar()
      } else {
        this.isLoading = false
      }
    })
  },
  methods: {
    changeMode (mode) {
      if (mode === 'day') {
        this.currentDate = new Date()
      }
    },
    checkMark (val) {
      if (!val) {
        this.isLoading = true
        this.$nextTick().then(() => {
          this.isLoading = false
          this.mark = {}
        })
      }
    },
    openMarkDialog (mark) {
      this.mark = mark
      this.isMarkOpen = true
    },
    async openCalendar () {
      this.isLoading = true
      await getTasks()
      await getUserSubtasks()
      await getUserMarks()
      this.isAuth = true
      this.isLoading = false
    },
    openDay (day) {
      this.currentDate = day
      this.mode = 'day'
    },
    openEventDialog ({ event, day }) {
      this.selectedEvent = event
      if (day) {
        this.newEventDate = day
      }
      this.isEventOpen = true
    }
  }
}
</script>

<style lang="scss">
.loader {
  height: 100vh;
}

.container {
  display: flex;
  position: relative;
  height: 100%;
  overflow: hidden;
  color: $primary-color;
}

.container__main {
  flex: 1;
  z-index: 100;
  display: flex;
  overflow: auto;
  flex-direction: column;
}
.authentication-block {
  display: flex;
  justify-content: center;
  margin: 80px 0;
  width: 100%;
}
.content-container {
  flex-grow: 1;
  overflow-x: hidden;
}

@media (max-width: 660px) {
  .content-container {
    overflow-x: auto;
  }
}
</style>
