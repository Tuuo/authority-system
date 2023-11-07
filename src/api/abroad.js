import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/abroad/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/abroad/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/abroad/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/abroad/delete", params);
    }


}