import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/connect/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/connect/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/connect/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/connect/delete", params);
    }


}