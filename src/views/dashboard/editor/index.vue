<template>
  <div>
    <h2>我的任务</h2>
    <el-card>
      <el-row>
        <el-col v-for="task in tasks" :key="task.id" :span="4">
          <el-card class="card">
            <p>{{ task.name }}</p>
          </el-card>
        </el-col>
        <el-button class="plus" icon="el-icon-circle-plus-outline" circle></el-button>
      </el-row>
    </el-card>

    <h2>任务通告</h2>
    <el-card>
      <el-row>
        <el-col v-for="notice in notices" :key="notice.id" :span="4">
          <el-card>
            <p>{{ notice.title }}</p>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <h2>我的审批</h2>
    <el-card>
      <el-row>
        <el-col v-for="approval in approvals" :key="approval.id" :span="8">
          <el-card>
            <p>{{ approval.title }}</p>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <h2>我的汇总</h2>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-card>
            <p>出勤汇总</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <p>维修</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <p>用餐金额统计</p>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
import taskApi from "@/api/task";

export default {
  name: 'myTask',
  components: {
    SystemDialog
  },
  data() {
    return {
      tasks: [],
      notices: [
        { id: 1, title: '通告1' },
        { id: 2, title: '通告2' },
        { id: 3, title: '通告3' }
      ],
      approvals: [
        { id: 1, title: '审批1' },
        { id: 2, title: '审批2' },
        { id: 3, title: '审批3' }
      ]
    };
  },
  mounted() {
    this.mytaskList()
  },
  methods: {
    /**
     * 查询我的任务
     */
    async mytaskList() {
      let res = await taskApi.getMyTaskList(this.tasks.name)
      //判断是否存在数据
      if (res.success) {
        //获取数据
        this.tasks = res.data.map(task => ({
          id: task.id,
          name: task.name
        }));
      }
    }
  }
};
</script>
<style scoped>
.plus {
  margin-left: 100px;
  margin-top: 30px;
}

.card {
  margin: 0 10px;
}
</style>