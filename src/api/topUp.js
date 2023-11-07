import http from '@/utils/request';
export default {
  
    async getList(param) {
        return await http.get("/api/topUp/list", param);
    },
   


}