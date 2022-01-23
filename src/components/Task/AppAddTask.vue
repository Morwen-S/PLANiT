<template>
  <div>
    <app-btn v-if="!isAddNewTask" @click="isAddNewTask = true" outlined color="secondary">
      + Add task
    </app-btn>
    <div v-if="isAddNewTask">
      <div class="centered">
        <app-text-field
          style="margin-right: 5px"
          v-model="newTaskTitle"
          @keyup.enter="addNewTask"
          placeholder="Task title"
          autofocus
        />
        <app-select v-if="isMarkSelect" v-model="newTaskMark" :items="marks" item-text="title" item-value="id">
          <template v-slot:default="{ open }">
            <app-btn outlined width="130px">
              <app-marcked-item app-marked-item @click="open" :mark-id="newTaskMark"/>
            </app-btn>
          </template>
          <template v-slot:item="{ item }">
            <app-marcked-item :mark-id="item.id"/>
          </template>
        </app-select>
      </div>
      <div class="flex-end" style="margin-top: 5px">
        <app-btn @click="addNewTask" :disabled="!newTaskTitle" style="margin-right: 5px">SAVE</app-btn>
        <app-btn @click="closeAdding" outlined>CLOSE</app-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { getMarks, getFirstMarkId } from '@/api/marks'

import AppTextField from '@/components/UI/AppTextField'
import AppSelect from '@/components/UI/AppSelect'
import AppMarckedItem from '@/components/Marks/MarckItem'

export default {
  name: 'AppAddTask',
  components: {
    AppTextField,
    AppMarckedItem,
    AppSelect
  },
  props: {
    isMarkSelect: {
      type: Boolean,
      default: false
    }
  },
  emits: ['addTask'],
  data () {
    return {
      isAddNewTask: false,
      newTaskTitle: '',
      newTaskMark: getFirstMarkId()
    }
  },
  computed: {
    marks () {
      return getMarks()
    }
  },
  methods: {
    markColor () {
      const mark = this.marks.find(x => x.id === this.markId)
      return mark ? mark.color : '#CACACA'
    },
    closeAdding () {
      this.isAddNewTask = false
      this.newTaskTitle = ''
    },
    addNewTask () {
      this.$emit('addTask', { title: this.newTaskTitle, markId: this.newTaskMark })
      this.closeAdding()
    }
  }
}
</script>

<style scoped>

</style>
