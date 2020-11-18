import Vue from 'vue'
import App from './App'
import store from './store'
import LayzImage from './common/LazyImage/LazyImage'
import Empty from './common/Empty/Empty'
import { getAction, postAction, fileAction } from './utils/api'
import { showToast, showModal} from './utils/commonJs'

Vue.config.productionTip = false
Vue.component('LayzImage', LayzImage)
Vue.component('CommonEmpty', Empty)

Vue.prototype.$get = getAction
Vue.prototype.$post = postAction
Vue.prototype.$file = fileAction
Vue.prototype.$showToast = showToast
Vue.prototype.$showModal = showModal

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
