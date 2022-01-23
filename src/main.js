import { createApp } from 'vue'
import App from './App.vue'

import AppCard from './components/UI/AppCard'
import AppDivider from './components/UI/AppDivider'
import AppDialog from './components/UI/AppDialog'
import AppButton from './components/UI/AppButton'

import { autofocus } from './directives/v-autofocus'
import { clickOutside } from './directives/v-click-outside'

const app = createApp(App)

app.component('app-card', AppCard)
app.component('app-divider', AppDivider)
app.component('app-dialog', AppDialog)
app.component('app-btn', AppButton)

app.directive('autofocus', autofocus)
app.directive('click-outside', clickOutside)

app.mount('#app')
