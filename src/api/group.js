import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/group/list", param);
    },
   

  
    async addGroup(params) {
        return await http.post("/api/group/add", params);
    },

    async updateGroup(params) {
        return await http.put("/api/group/update", params);
    },
  

    async deleteById(params) {
        return await http.delete("/api/group/delete", params);
    }


}