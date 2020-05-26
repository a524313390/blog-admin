import "mavon-editor/dist/css/index.css";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from "./api/axios";
import moment from "moment";
import mavonEditor from "mavon-editor";

import VueCropper from "vue-cropper";

import VueParticles from "vue-particles";

Vue.use(VueParticles);

Vue.config.productionTip = false;

Vue.use(VueCropper);
Vue.use(mavonEditor);
Vue.filter("dateformat", function(
  dataStr: any,
  pattern: string = "YYYY-MM-DD HH:mm:ss"
) {
  return moment(dataStr).format(pattern);
});
Vue.prototype.$axios = axios;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
