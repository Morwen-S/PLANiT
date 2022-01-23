<template>
  <div class="app-select">
    <div @click="open" class="app-select-activator">
      <slot></slot>
    </div>
    <transition name="app-slide-fade">
      <div v-if="isOpen" v-click-outside="close" class="app-select-content" :style="{ width: width + 'px' }">
        <div v-if="isSearch" class="app-select-search">
          <input
            v-model="search"
            class="app-select-input"
            placeholder="Type a label"
            type="text" autofocus
          >
        </div>
        <app-divider/>
        <div class="app-select-list">
          <div v-for="(item, i) in currentList" :key="i" @click="selectItem(item)" class="app-select-list-element">
            <slot name="item" :item="item">{{ itemText ? item[itemText] : item }}</slot>
          </div>
          <div class="app-select-list_empty body-font" v-if="currentList.length === 0">
            Not found "{{ search }}"...
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppSelect',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    width: {
      type: [String, Number],
      default: 250
    },
    itemText: {
      type: String,
      default: ''
    },
    itemValue: {
      type: String,
      default: ''
    },
    isSearch: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isOpen: false,
      search: ''
    }
  },
  computed: {
    currentList () {
      if (this.search.length > 0) {
        const searchLower = this.search.toLowerCase()
        return this.items.filter(x => {
          const value = x[this.itemText].toLowerCase()
          return value.search(searchLower) !== -1
        })
      }
      return this.items
    }
  },
  methods: {
    open () {
      this.isOpen = true
    },
    close () {
      this.search = ''
      this.isOpen = false
    },
    selectItem (item) {
      const value = this.itemValue ? item[this.itemValue] : item
      this.$emit('update:modelValue', value)
      this.close()
    }
  }
}
</script>

<style scoped lang="scss">
.app-select-content {
  position: absolute;
  z-index: 206;
  padding-bottom: 5px;

  background-color: white;
  border-radius: 5px;
  border: 1px solid $secondary-color;
  box-shadow: 2px 2px 10px rgba(0, 0, 255, .1);
}

.app-select-activator {
  width: 100%;
}

.app-select-input {
  width: 100%;
  font-size: 14px;
  padding: 3% 16px;
  margin: 5px 0;
  outline: none;
  border: none;

  &:focus {
    outline: none;
  }
}

.app-select-list {
  list-style-type: none;
  max-height: 200px;
  overflow-y: auto;
  padding: 0;
}

.app-select-list-element {
  cursor: pointer;
  padding: 8px 16px;

  &:hover {
    background-color: $light-grey-color;
  }
}

.app-select-list_empty {
  width: 100%;
  cursor: pointer;
  padding: 10px;

  &:hover {
    background-color: $light-grey-color;
  }

  i {
    margin-right: 10px;
  }
}
</style>
