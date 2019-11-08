import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import {canTurnTo} from '@/libs/util'
import config from '@/config'

Vue.use(Router)
const router = new Router({
    routes,
    mode: 'history'
})

const turnTo = (to, access, next) => {
    if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
    else next({replace: true, name: 'error_401'}) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    const userInfo = store.getters.getUserInfo;
    var token = "";
    if (userInfo) {
        token = userInfo.token;
    }
    if (!token && to.name !== config.loginName) {
        // 未登录且要跳转的页面不是登录页
        next({
            name: config.loginName // 跳转到登录页
        })
    } else if (!token && to.name === config.loginName) {
        // 未登陆且要跳转的页面是登录页
        next() // 跳转
    } else if (token && to.name === config.loginName) {
        // 已登录且要跳转的页面是登录页
        next({
            name: config.homeName // 跳转到homeName页
        })
    } else {
        if (token) {
            // turnTo(to, store.state.user.access, next)
            if (to.path === '/wh-law-firm-pc/') {
                next({
                    name: config.homeName
                })
            } else {
                next();
            }
        } else {
            store.commit("setUserInfo", null);
            next({
                name: config.loginName
            })
        }
    }
})

router.afterEach(to => {
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

export default router
