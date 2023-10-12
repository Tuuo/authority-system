import http from '@/utils/request'

export default {
    /**
* 添加任务
* @returns
*/
    async addMyTask(params) {
        return await http.post("/api/homePage/add", params)

    },

/**
 * 查询所有任务
 * 
 */
async getMyTaskList(params) {
    return await http.get('/api/homePage/list', params)
}
}