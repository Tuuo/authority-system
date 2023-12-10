import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/gift/list", param);
    },
    async deleteById(params) {
        return await http.delete("/api/gift/delete", params);
    },
    async addMeeting(params) {
        return await http.post("/api/gift/add", params);
    },
   


}