<template>
  <input
    :placeholder="placeholder"
    v-autofocus="autofocus"
    @input="$emit('update:modelValue', $event.target.value)"
    :value="modelValue"
    class="app-text-field main-font"
    :class="{ 'is-error': error }"
    :type="type" autocomplete="off"
  >
</template>

<script>
export default {
  name: 'AppTextField',
  emits: ['update:modelValue'],
  props: {
    modelValue: [String, Number],
    placeholder: {
      type: String,
      default: ''
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    error: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-text-field {
  width: 100%;
  height: 30px;
  margin: 5px 0;
  padding: 10px 10px;

  border: 1px solid lighten($primary-color, 40%);
  border-radius: 5px;

  &:focus {
    outline-width: 0;
    border: 1px solid $primary-color;
  }

  &::placeholder {
    color: $secondary-color;
  }
}

.is-error {
  border: 2px solid lighten($danger-color, 10%);

  &:focus {
    border: 2px solid $danger-color;
  }
}
</style>
