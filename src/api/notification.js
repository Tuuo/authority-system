import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/noti/list", param);
    },
   

  
    async addNoti(params) {
        return await http.post("/api/noti/add", params);
    },

    async updateNoti(params) {
        return await http.put("/api/noti/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/noti/delete", params);
    }


}