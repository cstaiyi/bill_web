import Main from '@/components/main'

/**
 * wh-law-firm-pc中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/view/login/login.vue')
    },
    {
        path: '/',
        name: '_home',
        redirect: '/home',
        component: Main,
        meta: {
            icon: "md-apps",
            hideInMenu: false,
            title: "功能菜单",
            notCache: true
        },
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    hideInMenu: true,
                    title: '首页',
                    notCache: true,
                    icon: 'md-home'
                },
                component: () => import('@/view/single-page/home')
            },
            {
                path: '/account',
                name: 'account',
                meta: {
                    icon: 'logo-buffer',
                    title: '账本管理',
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/account/account.vue')
            },
            {
                path: '/member',
                name: 'member',
                meta: {
                    icon: 'ios-people',
                    title: '成员管理',
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/member/member.vue')
            }, 
            {
                path: '/consumption',
                name: 'consumption',
                meta: {
                    icon: 'md-funnel',
                    title: '消费类型',
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/consumption/consumption.vue')
            }, 
            {
                path: '/bill',
                name: 'bill',
                meta: {
                    icon: 'md-list',
                    title: '流水管理',
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/bill/bill.vue')
            },
            {
                path: '/qb',
                name: 'qb',
                meta: {
                    icon: 'md-list',
                    title: '金额消费',
                    beforeCloseName: 'before_close_normal'
                },
                component: () => import('@/view/qb/qb.vue')
            },
        ]
    },
    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/404.vue')
    }
]
