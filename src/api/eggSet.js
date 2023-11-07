import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/eggSet/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/eggSet/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/eggSet/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/eggSet/delete", params);
    }


}