import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";

import './assets/main.css'



axios.get("http://localhost:3000/api")
.then((res) => {
    const app = createApp(App)
        app.config.globalProperties.axios = axios; //app.provide('$axios', axios);
        app.provide("couponAvailables", res.data.couponAvailables);
        app.provide("couponTypes", res.data.couponTypes);
        app.use(router)
        app.mount('#app')
    })
    .catch((err) => {alert("서버에 문제가 발생하였습니다.")})