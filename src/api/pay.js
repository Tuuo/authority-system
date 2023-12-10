import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/pay/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/pay/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/pay/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/pay/delete", params);
    }


}