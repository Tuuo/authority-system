import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/summaryTime/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/summaryTime/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/summaryTime/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/summaryTime/delete", params);
    }


}