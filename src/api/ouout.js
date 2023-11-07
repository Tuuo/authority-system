import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/ououtsouring/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/ououtsouring/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/ououtsouring/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/ououtsouring/delete", params);
    }


}