import Vue from 'vue'
import BRouter from './b-router'
import Home from '@/views/Home.vue'
import About from "@/views/About.vue"

Vue.use(BRouter)

// 路由基本配置
export default new BRouter({
    routes: [{
            path: '/',
            name: 'Home',
            component: Home,
            beforeEnter: (from, to, next) => {
                console.log(`from ${from} to => ${to}`)
                next()
            }
        },
        {
            path: '/about',
            name: "About",
            component: About,
        },
    ]
})