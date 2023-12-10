import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/overtimeMoney/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/overtimeMoney/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/overtimeMoney/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/overtimeMoney/delete", params);
    }


}