import http from '@/utils/request'

export default {


/**
 * 查询所有任务
 * 
 */
async getApprovalList(params) {
    return await http.get('/api/myApproval/list',params)
},
async getApproval(params) {
    return await http.get('/api/myApproval/get',params)
},

async addApproval(params){
    return await http.post('/api/myApproval/add',params)
},
async updateApproval(params){
    return await http.put('/api/myApproval/update',params)
},
async deleteApproval(params){
    return await http.delete('/api/myApproval/delete',params)
}
}