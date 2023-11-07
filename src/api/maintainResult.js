import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/maintainResult/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/maintainResult/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/maintainResult/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/maintainResult/delete", params);
    }


}