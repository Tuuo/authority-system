import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/trip/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/trip/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/trip/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/trip/delete", params);
    }


}