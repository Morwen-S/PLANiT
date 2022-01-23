<template>
  <div class="task" :style="{ backgroundColor: color, border: color + '1px solid' }">
    <app-checkbox
      :label="title"
      class="task-checkbox"
      :model-value="isChecked"
      @update:modelValue="updateChecked"
    >
      <div
        v-if="!isEditing"
        @click="this.$emit('openTask')"
        class="task-checkbox-label"
      >
        <div class="task-checkbox-label_text">{{ title }}</div>
      </div>
      <div v-else class="task-checkbox-input">
        <app-text-field
          :model-value="title"
          @keyup.enter="updateTitle($event.target.value)"
          @keyup.esc="closeEditing"
          placeholder="Event title" autofocus
        />
      </div>
    </app-checkbox>
    <app-btn v-if="isEditing" @click="closeEditing()" color="primary" style="margin: 5px" icon>
      <i class="fas fa-times"></i>
    </app-btn>

    <div v-if="!isEditing && subtaskScore" class="task-checkbox-actions task-checkbox-actions_score  body-font">
      <app-btn color="primary" icon>
        <i class="fas fa-tasks" style="margin-right: 3px"></i>
        <span style="line-height: 0">{{ subtaskScore }}</span>
      </app-btn>
    </div>

    <div v-if="!isEditing" class="task-checkbox-actions body-font">
      <app-btn @click="isEditing = true" color="primary" style="margin-right: 3px" icon>
        <i class="fas fa-pen"></i>
      </app-btn>
      <app-delete-dialog :task-title="title" @delete="$emit('deleteItem')"/>
    </div>
  </div>
</template>

<script>
import AppCheckbox from '@/components/UI/AppCheckbox'
import AppTextField from '@/components/UI/AppTextField'
import AppDeleteDialog from '@/components/Task/AppDeleteDialog'

export default {
  name: 'AppCheckboxEvent',
  components: {
    AppCheckbox,
    AppTextField,
    AppDeleteDialog
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    subtaskScore: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'transparent'
    }
  },
  emits: ['openTask', 'updateTask', 'deleteItem'],
  data () {
    return {
      isEditing: false
    }
  },
  methods: {
    closeEditing () {
      this.isEditing = false
    },
    updateTitle (val) {
      this.$emit('updateTask', { title: val })
      this.closeEditing()
    },
    updateChecked (val) {
      this.$emit('updateTask', { isChecked: val })
      this.closeEditing()
    }
  }
}
</script>

<style scoped lang="scss">
.task {
  cursor: pointer;
  width: 100%;
  flex: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  padding: 2px;

  &:hover {
    opacity: 0.9;
  }

  &-checkbox {
    flex: 7 0 0;

    &-label {
      width: 100%;
      cursor: pointer;
      display: table;
      table-layout: fixed;

      .task-checkbox-label_text {
        display: table-cell;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    &-input {
      display: flex;
      align-items: center;
    }

    &-actions {
      display: flex;
      background-color: white;
      border-radius: 4px;
      border: 1px solid $secondary-color;
      padding: 1px;
      margin-right: 2px;
    }

    &-actions_score {
      @media (max-width: 600px) {
        display: none;
      }
    }

  }
}

</style>
