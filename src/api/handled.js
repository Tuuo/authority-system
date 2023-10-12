import http from '@/utils/request'

export default {


/**
 * 查询所有任务
 * 
 */
async getHandledList(params) {
    return await http.get('/api/myHandled/list',params)
},

async addHandled(params){
    return await http.post('/api/myHandled/add',params)
},

}