<template>
  <teleport to="body">
    <transition name="fade">
      <div v-show="isOpen" class="app-dialog centered">
        <div class="app-dialog_overlay" @click="isOpen = false"></div>

        <app-card class="app-dialog_body" :style="{ width: width + 'px' }">
          <div class="app-dialog_title">
            <div class="centered"><slot name="title"> </slot></div>
            <app-btn class="app-dialog_close" color="secondary" @click="isOpen = false" icon>
              <i class="fas fa-times"></i>
            </app-btn>
          </div>

          <div class="app-dialog_main-content">
            <slot></slot>
          </div>
        </app-card>

      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'AppDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String],
      default: 600
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      isOpen: false
    }
  },
  watch: {
    modelValue (val) {
      this.isOpen = val
    },
    isOpen (val) {
      this.$emit('update:modelValue', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-dialog, .app-dialog_overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}

.app-dialog_overlay {
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 4;
}

.app-dialog_body {
  position: relative;
  padding: 20px;
  margin: 10px;
  z-index: 5;
}
.app-dialog_title {
  width: 100%;
  margin-bottom: 5px;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
}

.app-dialog_main-content {
  width: 100%;
}

.app-dialog_close {
  i {
    font-size: 18px;
  }
}

</style>
