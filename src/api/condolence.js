import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/condolence/list", param);
    },
   

  
    async addMeeting(params) {
        return await http.post("/api/condolence/add", params);
    },

    async updateMeeting(params) {
        return await http.put("/api/condolence/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/condolence/delete", params);
    }


}