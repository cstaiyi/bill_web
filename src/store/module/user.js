import {login} from '@/api/user'

const key = "pc_user"
export default {
    state: {
        access: [],
        userInfo: {},
    },
    getters: {
        getUserInfo: function(state) {
            state.userInfo = JSON.parse(localStorage.getItem(key));
            return state.userInfo;
        }
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
            localStorage.setItem(key, JSON.stringify(userInfo));
        },
        setAccess(state, access) {
            state.access = access
        },
    },
    save(item){
        let localArr={};
        //获取此时本地LocalStorage的所有信息
        localArr=ORDER_CACHE.get();
        //注意参数的先后顺序，后面一个obj会覆盖前一个。
        localArr=Object.assign({},localArr,item);
        //将新的object传到LocalStorage里
        ORDER_CACHE.set(localArr);
        //
    },
    actions: {
        // 登录
        handleLogin({commit}, {user, password}) {
            user = user.trim()
            return new Promise((resolve, reject) => {
                login({
                    user,
                    password
                }).then(res => {
                    const data = res.data
                    if (data.code !== 200) {
                        reject(data)
                        return;
                    }
                    //把账号信息存入缓存
                    localStorage.setItem('userInfo', JSON.stringify(data.data));
                    
                    commit('setUserInfo', data.data)
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 退出登录
        handleLogOut({state, commit}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('setUserInfo', {})
                    commit('setAccess', [])
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
    }
}
