import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/meeting/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/meeting/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/meeting/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/meeting/delete", params);
    }


}