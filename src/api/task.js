import http from '@/utils/request'

export default {
    /**
* 添加任务
* @returns
*/
    async addMyTask(data) {
        return await http.put("/api/homePage/add", data)

    },

/**
 * 查询所有任务
 * 
 */
async getMyTaskList(params) {
    return await http.get('/api/homePage/list', params)
}
}