import http from '@/utils/request'

export default {

async getList(params) {
    return await http.get('/api/basic/list',params)
},


async addBasic(params){
    return await http.post('/api/basic/add',params)
},
async updateBasic(params){
    return await http.put('/api/basic/update',params)
},

}