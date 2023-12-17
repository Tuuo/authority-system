import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/weiwen/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/weiwen/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/weiwen/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/weiwen/delete", params);
    }


}