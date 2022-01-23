<template>
  <textarea
    ref="appTextarea"
    @input="input"
    :value="modelValue"
    :placeholder="placeholder"
    v-autofocus="autofocus"
    rows="2"
    class="app-textarea body-font"
  />
</template>

<script>
export default {
  name: 'AppTextarea',
  props: {
    modelValue: String,
    placeholder: {
      type: String,
      default: ''
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.$nextTick().then(() => {
      this.autoResize(this.$refs.appTextarea)
    })
  },
  emits: ['update:modelValue'],
  methods: {
    input (el) {
      this.$emit('update:modelValue', el.target.value)
      this.autoResize(el.target)
    },
    autoResize (elm) {
      elm.style.height = 'auto'
      elm.style.height = elm.scrollHeight + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-textarea {
  display: block;
  overflow: hidden;
  resize: none;
  width: 100%;
  margin: 10px 0;
  padding: 10px 10px;

  outline-width: 0;
  border: 1px solid lighten($primary-color, 40%);
  border-radius: 5px;

  &:focus {
    border: 1px solid $primary-color;
  }

  &::placeholder {
    color: $secondary-color;
  }
}
</style>
