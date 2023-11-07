import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/work/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/work/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/work/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/work/delete", params);
    }


}