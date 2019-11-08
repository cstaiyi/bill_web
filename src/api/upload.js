import axios from '@/libs/api.request'
import api from './interface.js'

export const uploadFile = ({formdata}) => {
    return axios.uploadFile({
        url: api.ali.upLoad,
        formdata,
    })
}
