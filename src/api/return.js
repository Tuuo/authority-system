import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/return/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/return/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/return/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/return/delete", params);
    }


}