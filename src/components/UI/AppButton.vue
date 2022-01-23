<template>
  <button class="app-btn" :style="{ minWidth: width }" :class="btnClass" :disabled="disabled">
    <span class="centered">
      <slot>OK</slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '10px'
    }
  },
  computed: {
    btnClass () {
      let btnClass = ''
      if (this.outlined) {
        btnClass += ' app-btn_outlined'
      }
      if (this.icon) {
        btnClass += ' app-btn_icon'
      }
      if (btnClass.length === 0) {
        btnClass = 'app-btn_usual'
      }
      btnClass += ' ' + this.color
      return btnClass
    }
  }
}
</script>

<style lang="scss" scoped>
.app-btn {
  border: none;
  cursor: pointer;
  padding: 4px 20px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.2;
  font-weight: bold;
  transition: 0.3s;
  min-height: 30px;
  white-space: nowrap;
}

.app-btn_usual {
  color: white;
  transition: opacity 0.2s ease;

  &:hover, &:focus{
    opacity: 0.9;
  }

  &.primary {
    background-color: $primary-color;
    border: 1px solid $primary-color;
  }
  &.secondary {
    background-color: $secondary-color;
    border: 1px solid $secondary-color;
  }

  &:disabled {
    cursor: default;
    background-color: $secondary-color;
    border: 1px solid $secondary-color;

    &:hover, &:focus {
      opacity: 1;
    }
  }
}

.app-btn_icon {
  padding: 2px;
  background-color: transparent;
  border: 1px solid transparent;
  transition: background-color 0.2s ease;
  min-height: 20px;

  &.primary {
    color: $primary-color;
    &:hover {
      color: lighten($primary-color, 30%);
    }
  }
  &.secondary {
    color: $secondary-color;
    &:hover {
      color: darken($secondary-color, 30%);
    }
  }

  &:disabled {
    cursor: default;
    color: $light-grey-color;

    &:hover, &:focus {
      color: $light-grey-color;
    }
  }
}

.app-btn_outlined {
  background-color: transparent;

  &.primary {
    border: 1px solid $primary-color;
    color: $primary-color;
    &:hover {
      background-color: lighten($primary-color, 70%);
    }
  }
  &.secondary {
    border: 1px solid $secondary-color;
    color: $secondary-color;
    &:hover {
      background-color: lighten($secondary-color, 15%);
    }
  }

  &:disabled {
    cursor: default;
    background-color: $secondary-color;
    border: 1px solid $secondary-color;
    color: white;

    &:hover, &:focus {
      background-color: $secondary-color;
    }
  }
}

</style>
