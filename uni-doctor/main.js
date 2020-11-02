import Vue from 'vue'
import App from './App'
import store from './store'
import LayzImage from './common/LazyImage/LazyImage'
import Empty from './common/Empty/Empty'
import { getAction, postAction } from './utils/api'

Vue.config.productionTip = false
Vue.component('LayzImage', LayzImage)
Vue.component('Empty', Empty)

Vue.prototype.$get = getAction
Vue.prototype.$post = postAction

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
