import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/family/list", param);
    },
   

  
    async addFamily(params) {
        return await http.post("/api/family/add", params);
    },

    async updateFamily(params) {
        return await http.put("/api/family/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/family/delete", params);
    }


}