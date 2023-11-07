import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/dimission/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/dimission/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/dimission/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/dimission/delete", params);
    }


}