import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/holiday/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/holiday/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/holiday/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/holiday/delete", params);
    }


}