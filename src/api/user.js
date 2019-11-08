import axios from '@/libs/api.request'
import api from './interface.js'

export const login = ({user, password}) => {
    const data = {
        user,
        password
    }
    return axios.request({
        url: api.register.login,
        data,
        method: 'post'
    })
}
