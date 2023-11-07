import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/salary/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/salary/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/salary/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/salary/delete", params);
    }


}