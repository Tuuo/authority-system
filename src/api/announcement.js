import http from '@/utils/request'

export default {


/**
 * 查询所有任务
 * 
 */
async getTaskList(params) {
    return await http.get('/api/tasks/all',params)
},

async markMessageAsRead(params){
    return await http.put('/api/tasks/update',params)
}
}