import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/maintain/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/maintain/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/maintain/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/maintain/delete", params);
    }


}