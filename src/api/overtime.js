import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/overtime/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/overtime/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/overtime/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/overtime/delete", params);
    }


}