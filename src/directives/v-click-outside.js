const clickEventType = document.ontouchstart !== null ? 'click' : 'touchstart'

export const clickOutside = {
  mounted: function (el, binding, vnode) {
    const vm = vnode.context
    const callback = binding.value

    let nextTick = false
    setTimeout(function () {
      nextTick = true
    }, 0)

    el.vue_click_away = (event) => {
      if (
        (!el || !el.contains(event.target)) &&
        callback &&
        nextTick &&
        typeof callback === 'function'
      ) {
        return callback.call(vm, event)
      }
    }

    document.addEventListener(clickEventType, el.vue_click_away, false)
  },
  unmounted: function (el) {
    document.removeEventListener(clickEventType, el.vue_click_away, false)
    delete el.vue_click_away
  }
}
