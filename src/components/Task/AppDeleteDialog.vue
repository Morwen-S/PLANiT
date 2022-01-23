<template>
  <div>
    <div @click="open">
      <slot name="default">
        <app-btn color="primary" icon>
          <i class="fas fa-trash-alt"></i>
        </app-btn>
      </slot>
    </div>
    <app-dialog v-model="isOpen" :width="400">
      <template v-slot:title>
        <i class="fas fa-exclamation-circle alert-icon"></i>
      </template>
      <div class="dialog-body">
        Are you sure you want to delete
        <slot name="description">
          <span class="headline">{{ taskTitle }}</span>
        </slot>
        ?
      </div>
      <div class="flex-end" style="margin-top: 10px">
        <app-btn @click="isOpen = false" style="margin-right: 5px" outlined>CLOSE</app-btn>
        <app-btn @click="deleteTask">DELETE</app-btn>
      </div>
    </app-dialog>
  </div>
</template>

<script>
import AppDialog from '@/components/UI/AppDialog'

export default {
  name: 'AppDeleteDialog',
  props: {
    taskTitle: {
      type: String,
      default: ''
    }
  },
  emits: ['delete'],
  components: { AppDialog },
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    open () {
      this.isOpen = true
    },
    deleteTask () {
      this.$emit('delete')
      this.isOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-icon {
  color: $danger-color;
}
.dialog-body {
  margin: 25px 0;
  line-height: 25px;
}
</style>
