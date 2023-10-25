import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/appointment/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/appointment/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/appointment/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/appointment/delete", params);
    }


}