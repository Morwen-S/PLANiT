
export const autofocus = {
  mounted (el, binding) {
    if (binding.value) {
      el.focus()
    }
  }
}
