<template>
  <app-dialog v-model="isOpen" :width="400">
    <template v-slot:title>
      <span class="title">{{ isCreatingNewSection ? 'Add new section' : 'Edit section'}}</span>
    </template>
    <app-divider/>
    <div class="mark-dialog-body">
      <div class="mark-dialog-input">
        <span class="headline">Name</span>
        <app-text-field class="body-font" v-model="name" autofocus/>
      </div>
      <div class="mark-dialog-input">
        <span class="headline">Color</span>
        <app-select
          v-model="color"
          is-search width="350"
          :items="colors"
          item-text="text"
        >
          <template v-slot:default="{ open }">
            <div class="mark-dialog-input-color-btn">
              <app-color-item @click="open" :title="color.text" :color="color.color"/>
            </div>
          </template>
          <template v-slot:item="{ item }">
            <app-color-item :title="item.text" :color="item.color"/>
          </template>
        </app-select>
      </div>
    </div>
    <div class="flex-end" style="margin-top: 10px">
      <app-btn @click="isOpen = false" style="margin-right: 5px" outlined>CLOSE</app-btn>
      <app-btn :disabled="!name" @click="save">SAVE</app-btn>
    </div>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/UI/AppDialog'
import AppTextField from '@/components/UI/AppTextField'
import AppSelect from '@/components/UI/AppSelect'
import AppColorItem from '@/components/UI/AppColorItem'

import { addMark, editMark } from '@/api/marks'

import SECTIONS_COLORS from '@/services/sections-colors'

export default {
  name: 'MarkDialog',
  components: {
    AppColorItem,
    AppDialog,
    AppTextField,
    AppSelect
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    mark: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      isOpen: false,
      name: '',
      color: SECTIONS_COLORS[0],
      colors: SECTIONS_COLORS
    }
  },
  computed: {
    isCreatingNewSection () {
      return !this.mark.id
    }
  },
  methods: {
    async save () {
      if (this.isCreatingNewSection) {
        await addMark({
          color: this.color.color,
          text: this.name
        })
      } else {
        await editMark({
          id: this.mark.id,
          color: this.color.color,
          text: this.name
        })
      }
      this.isOpen = false
    }
  },
  watch: {
    modelValue (val) {
      this.isOpen = val
      if (this.isCreatingNewSection) {
        this.color = this.colors[0]
        this.name = ''
      } else {
        this.color = this.colors.find(x => x.color === this.mark.color) || this.colors[0]
        this.name = this.mark.text
      }
    },
    isOpen (val) {
      this.$emit('update:modelValue', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-dialog {

  &-body {
    padding: 10px 0;
  }

  &-input {
    margin-top: 10px;

    &-color-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      height: 30px;
      margin: 5px 0;
      padding: 10px 10px;

      border: 1px solid lighten($primary-color, 40%);
      border-radius: 5px;

      &:hover {
        background: lighten($primary-color, 70%);
      }
    }
  }
}
</style>
