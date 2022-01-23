<template>
  <app-dialog v-model="isOpen" :width="700">
    <template v-slot:title>
      <app-select
        v-model="currentTask.markId"
        is-search
        @update:modelValue="save"
        :items="marks"
        item-text="text" item-value="id"
      >
        <template v-slot:default="{ open }">
          <app-marked-item @click="open" :mark-id="currentTask.markId"/>
        </template>
        <template v-slot:item="{ item }">
          <app-marked-item :mark-id="item.id"/>
        </template>
      </app-select>
    </template>

    <div class="task-form">

      <div class="task-form_title">
        <app-checkbox
          v-if="!isTitleEdit"
          :label="currentTask.title"
          v-model="currentTask.isChecked"
          @update:modelValue="save"
          title style="margin-bottom: 10px"
        >
          <div @click="isTitleEdit = true" class="checkbox-title">{{ currentTask.title }}</div>
        </app-checkbox>
        <app-text-field v-else v-model="currentTask.title" @keyup.enter="clickSave" placeholder="Task title" autofocus/>
        <app-divider/>
      </div>

      <div class="task-form_description">
        <div v-if="!isDescriptionEdit" @click="isDescriptionEdit = true">
          <p v-if="currentTask.description" class="body-font">{{ currentTask.description }}</p>
          <p v-else class="body-font secondary-font">Description...</p>
        </div>
        <app-textarea v-else v-model="currentTask.description" placeholder="Description" autofocus/>
      </div>

      <div class="task-form_actions">
        <app-date-picker v-model="period" @update:modelValue="save"/>
        <div v-if="isDescriptionEdit || isTitleEdit">
          <app-btn @click="clickSave()" style="margin-right: 5px" :disabled="!currentTask.title">SAVE</app-btn>
          <app-btn @click="refresh" outlined>CLOSE</app-btn>
        </div>
        <app-delete-dialog v-else :task-title="currentTask.title" @delete="deleteCurrentTask"/>
      </div>

      <div class="task-form_sub-tasks">
        <h3 class="title sub-tasks_title">Sub-tasks</h3>
        <app-divider color="primary"/>
          <ul class="sub-tasks_list">
            <app-drag-and-drop v-model="subtasks" @update:modelValue="changePosition">
              <template v-slot:item="{ item }">
                <li :key="'subtask' + item.id">
                  <div class="sub-tasks_checkbox">
                    <app-checkbox-task
                      :title="item.title"
                      :is-checked="item.isChecked"
                      @deleteItem="deleteSubtask(item)"
                      @updateTask="editCurrentSubtask($event, item)"
                    />
                  </div>
                  <app-divider style="margin: 5px 0"/>
                </li>
              </template>
            </app-drag-and-drop>
          </ul>
        <app-add-task @addTask="addNewSubtask"/>
      </div>
    </div>
  </app-dialog>
</template>

<script>
import AppDatePicker from '@/components/UI/AppDatePicker'
import AppTextField from '@/components/UI/AppTextField'
import AppTextarea from '@/components/UI/AppTextarea'
import AppCheckbox from '@/components/UI/AppCheckbox'
import AppMarkedItem from '@/components/Marks/MarckItem'
import AppCheckboxTask from '@/components/Task/AppCheckboxTask'
import AppAddTask from '@/components/Task/AppAddTask'
import AppSelect from '@/components/UI/AppSelect'
import AppDragAndDrop from '@/components/UI/AppDragAndDrop'
import AppDeleteDialog from '@/components/Task/AppDeleteDialog'

import { getTaskById, saveChanges, addTask, deleteTask } from '@/api/tasks'
import { getSubTasksByTaskId, addSubtask, editSubtask, deleteSubtask } from '@/api/subtask'
import { getFirstMarkId, getMarks } from '@/api/marks'

export default {
  name: 'AppTaskDialog',
  components: {
    AppDeleteDialog,
    AppDragAndDrop,
    AppCheckboxTask,
    AppSelect,
    AppDatePicker,
    AppMarkedItem,
    AppCheckbox,
    AppTextarea,
    AppAddTask,
    AppTextField
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
      default () {
        return {}
      }
    },
    date: {
      type: Date
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      marks: [],
      period: { start: null, end: null },
      isTitleEdit: false,
      isDescriptionEdit: false,
      isOpen: false,
      currentTask: {},
      subtasks: []
    }
  },
  methods: {
    changePosition (items) {
      items.forEach((item, i) => {
        item.position = i
        editSubtask(item)
      })
    },
    deleteCurrentTask () {
      deleteTask(this.currentTask.id)
      this.isOpen = false
    },
    async deleteSubtask (subtask) {
      await deleteSubtask(subtask.id)
      this.subtasks = getSubTasksByTaskId(this.currentTask.id)
    },
    editCurrentSubtask ({ title, isChecked }, subtask) {
      subtask.title = title ?? subtask.title
      subtask.isChecked = isChecked ?? subtask.isChecked
      editSubtask(subtask)
    },
    async addNewSubtask ({ title }) {
      await addSubtask({
        taskId: this.currentTask.id,
        title: title,
        position: this.subtasks.length
      })
      this.subtasks = getSubTasksByTaskId(this.currentTask.id)
    },
    save () {
      if (!this.currentTask.title) {
        return
      }
      this.currentTask.startDate = new Date(this.period.start).getTime()
      this.currentTask.endDate = new Date(this.period.end).getTime()

      if (Object.prototype.hasOwnProperty.call(this.currentTask, 'id')) {
        saveChanges(this.currentTask)
      } else {
        addTask(this.currentTask)
          .then((result) => {
            this.currentTask = result
          })
      }
    },
    clickSave () {
      this.save()
      this.isDescriptionEdit = false
      this.isTitleEdit = false
    },
    refresh () {
      this.isTitleEdit = this.isDescriptionEdit = false

      this.currentTask = this.currentTask ? getTaskById(this.currentTask.id) : {}
      if (!this.currentTask) {
        this.currentTask = {
          title: '',
          description: '',
          markId: getFirstMarkId()
        }
        this.period = {
          start: this.date,
          end: this.date
        }
        this.isTitleEdit = this.isDescriptionEdit = true
      } else {
        this.subtasks = getSubTasksByTaskId(this.currentTask.id)
        this.period = {
          start: new Date(this.currentTask.startDate),
          end: new Date(this.currentTask.endDate)
        }
      }
    }
  },
  watch: {
    modelValue (val) {
      this.isOpen = val
      this.subtasks = []
      if (this.modelValue) {
        this.marks = getMarks()
        this.currentTask = this.task
        this.refresh()
      }
    },
    isOpen (val) {
      this.$emit('update:modelValue', val)
    }
  }
}
</script>

<style lang="scss" scoped>

.task-form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
  height: 80vh;
  padding: 5px 0;

  &_actions {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
  }
}

.sub-tasks_title {
  line-height: 0;
  margin-top: 30px;
}

.sub-tasks_list {
  list-style-type: none;
  padding: 0;

  li {
    margin: 0;
    transition: all 0.4s ease-out;
  }
}
.checkbox-title {
  cursor: text;
}
</style>
