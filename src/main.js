// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import VuexI18n from 'vuex-i18n'
import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css'
import './assets/style/index.scss'
import languageDataList from './utils/locale'
import { $getLanguage, isAuth } from './utils/index'
import './utils/directives'
import '../element-variables.scss'
import './style/index.scss'

Vue.use(VuexI18n.plugin, store)
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });
Vue.config.productionTip = false
Vue.prototype.isAuth = isAuth
// translations can be kept in separate files for each language
for(let v of languageDataList){
  Vue.i18n.add(v.language, v.data)
}

// add translations directly to the application
Vue.i18n.set($getLanguage())

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
