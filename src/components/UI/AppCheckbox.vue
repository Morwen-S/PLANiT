<template>
  <div class="app-checkbox">
    <input
      class="app-checkbox_input"
      type="checkbox"
      :checked="checked"
      @input="input"
    >
    <label
      class="app-checkbox_label"
      :class="{ 'title': title, 'headline': !title }"
      :data-content="label"
    >
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>

<script>
export default {
  name: 'AppCheckbox',
  props: {
    modelValue: Boolean,
    label: String,
    title: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  computed: {
    checked () {
      return this.modelValue
    }
  },
  methods: {
    input (el) {
      this.$emit('update:modelValue', el.target.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-checkbox {
  display:  flex;
  align-items: center;
  justify-content: flex-start;
}
.app-checkbox_input {
  flex-shrink: 0;
  position: relative;
  width: 1.5em;
  height: 1.5em;
  background-color: white;
  border: 1px solid $primary-color;
  border-radius: 4px;
  appearance: none;
  outline: 0;
  cursor: pointer;
  transition: background 175ms cubic-bezier(0.1, 0.1, 0.25, 1);

  &:hover {
    background-color: $secondary-color;
  }

  &::before {
    position: absolute;
    content: '';
    display: block;
    left: 6px;
    width: 0.5em;
    height: 1em;
    border-style: solid;
    border-color: white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    opacity: 0;
  }

  &:checked {
    color: white;
    border-color: $primary-color;
    background: $primary-color;
    &::before {
      opacity: 1;
    }
    ~ .app-checkbox_label{
      text-decoration: line-through;
      color: $primary-color, 20%;
    }
  }
}

.app-checkbox_label {
  flex: 7 0 0;
  position: relative;
  padding: 0 0.25em 0;
  user-select: none;
}

.title {
  font-size: 18px;
}

.headline {
  font-size: 16px;
  font-weight: 400;
}
</style>
