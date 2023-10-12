<template>
  <div>
    <h2 class="h">我的任务</h2>
    <el-card>
      <el-row>
        <el-col v-for="task in tasks" :key="task.id" :span="4">
          <el-card class="card">
            <p>{{ task.name }}</p>
          </el-card>
        </el-col>
        <el-button class="plus" icon="el-icon-circle-plus-outline" @click="openAddWindow()" circle></el-button>
      </el-row>
    </el-card>
    <system-dialog :title="taskDialog.title" :visible="taskDialog.visible" :width="taskDialog.width"
      :height="taskDialog.height" @onClose="onClose" @onConfirm="onConfirm">
      <div slot="content">
        <el-form :model="taskForm" ref="taskForm" label-width="80px" :inline="false" size="small">
          <el-select v-model="value" placeholder="请选择" class="tasks" @change="onSelectOption">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form>
      </div>
    </system-dialog>

    <h2 class="h">任务通告</h2>
    <el-card>
      <el-row>
        <el-table :data="messages" style="width: 100%">
          <el-table-column label="时间" prop="timestamp" sortable="custom">
            <template slot-scope="scope">
              {{ formatDate(scope.row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="title">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="viewMessage(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 信息详细界面 -->
        <el-dialog v-if="currentMessage" :visible.sync="dialogVisible">
          <h2>{{ currentMessage.title }}</h2>
          <p>{{ currentMessage.content }}</p>


          <!-- 回复区域 -->
          <div v-if="!currentMessage.replied">
            <el-input v-model="replyContent" placeholder="回复内容"></el-input>
            <el-button @click="replyToMessage">回复已读</el-button>
            <el-button @click="markAsRead">自动已读</el-button>
          </div>


          <!-- 附件 -->
          <!-- <el-link v-for="attachment in currentMessage.attachments" :key="attachment.id" :href="attachment.url"
            target="_blank">
            {{ attachment.name }}
          </el-link> -->
        </el-dialog>

        <!-- 更多按钮 -->
        <!-- <el-button @click="goToMessageList">更多</el-button> -->
      </el-row>
    </el-card>

    <h2 class="h">我的审批</h2>
    <el-card>
      <el-row>
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="审批" name="approval">
            <div>
              <el-button type="primary" @click="handleProcess">办理</el-button>
            </div>
            <el-table :data="approvalList" style="width: 100%" stripe>
              <el-table-column prop="name" label="单据名称"></el-table-column>
              <el-table-column prop="date" label="提交日期"></el-table-column>
              <!-- 其他列 -->
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="已办" name="handled">
              <div class="document-approval">
                <el-table :data="handledList" style="width: 100%">
                  <el-table-column prop="name" label="单据名称"></el-table-column>
                  <el-table-column prop="date" label="审批日期"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
        </el-tabs>
        <!-- <el-button @click="showMoreOptions">更多</el-button> -->
      </el-row>
    </el-card>
    <system-dialog :title="approvalDialog.title" :visible="approvalDialog.visible" :width="approvalDialog.width"
    :height="approvalDialog.height" @onClose="onApprovalClose" @onConfirm="onApprovalConfirm">
    <div slot="content">
      <el-form :model="approvalsForm" ref="approvalsForm" label-width="80px" :rules="rules" :inline="false" size="small">
        <el-form-item label="单据" prop="name">
          <el-select v-model="approvalsForm.name" placeholder="请选择" class="tasks" @change="onApprovalSelectOption">
            <el-option v-for="item in approvalOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="意见" prop="opinion">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="approvalsForm.opinion"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </system-dialog>


    <h2 class="h">我的汇总</h2>
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
import annoApi from "@/api/announcement";
import approvalApi from "@/api/approval"
import handledApi from '@/api/handled'


export default {
  name: 'myTask',
  components: {
    SystemDialog
  },
  data() {
    return {
      textarea: '',
      tasks: [],
      taskForm: {
        name: '' // Add other form fields here
      },
      selectedOption: '',
      approvalSelectedOption: '',
      taskDialog: {
        title: '',
        visible: false,
        height: 100,
        width: 300
      },
      approvals: [],
      activeTab: 'approval',
      approval: {
        id: '',
        name: '',
        opinion: '',
        status: '',
        date:''
      },
      approvalDialog: {
        title: '',
        visible: false,
        height: 250,
        width: 400
      },
      approvalsForm: {
        name: '',
        opinion: ''
      },
      rules: {
        name: [{ required: true, trigger: 'change', message: '请选择单据' }],
        opinion: [{ required: true, trigger: 'change', message: '请输入意见' }],
      },
      approvalOptions: [{
        value: '1',
        label: '请假申请'
      }, {
        value: '2',
        label: '加班申请'
      }, {
        value: '3',
        label: '出警申请'
      }, {
        value: '4',
        label: '出差申请'
      }, {
        value: '5',
        label: '销假申请'
      }, {
        value: '6',
        label: '个人出国申请'
      }, {
        value: '7',
        label: '离岗申请'
      }, {
        value: '8',
        label: '交接申请'
      }
      ],
      approvalValue: '',
      approvalList: [],
      handleds:[],
      handledList: [],
      options: [{
        value: '1',
        label: '出勤类表单'
      }, {
        value: '2',
        label: '餐饮类表单'
      }, {
        value: '3',
        label: '报销补助类表单'
      }, {
        value: '4',
        label: '维修类表单'
      }, {
        value: '5',
        label: '办公用品表单'
      }],
      value: '',
      messages: [], // 存储消息通告
      currentMessage: null, // 当前查看的消息
      dialogVisible: false, // 是否显示详细信息对话框
      replyContent: '', // 回复内容

    };
  },
  mounted() {
    this.mytaskList()
    // 加载消息通告数据
    this.fetchData();
    this.myapproval();
    this.myhandled();
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
    },
    async myhandled() {
      let res = await handledApi.getHandledList(this.handleds.name)
      console.log(res);
      if (res.success) {
        this.handledList = res.data.map(approval => ({
          id: approval.id,
          name: approval.name,
          opinion: approval.opinion,
          status: approval.status,
          date: approval.date
        }))
      }
    },
    async myapproval() {
      let res = await approvalApi.getApprovalList(this.approvals.name)
      // console.log(res);
      if (res.success) {
        this.approvalList = res.data.map(approval => ({
          id: approval.id,
          name: approval.name,
          date: approval.date
        }))
      }
    },
    /**
        * 打开添加窗口
        */
    openAddWindow() {
      this.taskDialog.title = '新增任务'; // 设置窗口标题
      this.taskDialog.visible = true; // 显示窗口
    },
    /**
    * 窗口取消事件
    */
    onClose() {
      this.taskDialog.visible = false
    },
    /**
    * 窗口确认事件
    */
    onConfirm() {
      //表单验证
      this.$refs.taskForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          //发送添加请求
          let params = {
            name: this.selectedOption
          }
          console.log(params);
          res = await taskApi.addMyTask(params);
          //判断是否成功
          if (res.success) {
            this.$message.success(res.message);
            this.mytaskList();
            //关闭窗口
            this.taskDialog.visible = false;
          } else {
            this.$message.error(res.message);
          }
        }

      });
    },
    onSelectOption() {
      const selectedLabel = this.options.find(option => option.value === this.value)?.label;
      if (selectedLabel) {
        this.selectedOption = selectedLabel;
      }
    },
    onApprovalSelectOption() {
      const selectedLabel = this.approvalOptions.find(option => option.value === this.approvalsForm.name)?.label;
      // console.log("selectedLabel:"+selectedLabel);
      if (selectedLabel) {
        this.approvalSelectedOption = selectedLabel;
      }
    },
    // 模拟数据加载
    async fetchData() {
      // 这里应该从后端获取消息通告数据
      // 示例数据
      let res = await annoApi.getTaskList()
      if (res.success) {
        //获取数据
        this.messages = res.data.map(task => ({
          id: task.id,
          timestamp: task.timestamp, // 时间戳
          title: task.title,
          content: task.content,
          replied: task.replied, // 是否已回复
        }));
      }
      // console.log(res);
    },
    // 格式化时间戳为可读时间
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    // 查看消息详细信息
    // 当用户点击查看通告时，标记通告为已读
    async viewMessage(message) {
      this.currentMessage = message;
      // console.log(message.id);
      if (!message.replied) {
        // 标记通告为已读
        // message.replied = true;

        // 发送请求到后端，告知后端该通告已读
        // console.log(message);
        let res = await annoApi.markMessageAsRead(message);
        // alert(res.message)
        // message.replied = true;

        console.log(res);
      }

      this.dialogVisible = true;
    },
    // 回复已读消息
    // 回复已读消息
    async replyToMessage() {
      // 处理回复逻辑，发送回复内容
      // 示例：发送回复后，更新界面
      console.log('this.replyContent' + this.replyContent);
      const response = await annoApi.markMessageAsRead(this.currentMessage);

      if (response.success) {
        // 回复成功，更新界面
        this.currentMessage.replied = true;
        this.dialogVisible = false;
        this.replyContent = '';
        this.$message.success('回复成功！');
      } else {
        // 回复失败，显示错误提示
        this.$message.error('回复失败，请重试。');
      }
    },

    // 自动已读
    // 自动已读
    async markAsRead() {
      // 处理自动已读逻辑
      // 示例：标记消息为已读，不显示回复区域
      console.log(this.currentMessage)
      const response = await annoApi.markMessageAsRead(this.currentMessage);

      if (response.success) {
        // 标记已读成功，更新界面
        this.currentMessage.replied = true;
        this.dialogVisible = false;
        this.replyContent = '';
        this.$message.success('已自动回复');

      } else {
        // 标记已读失败，显示错误提示
        this.$message.error('标记已读失败，请重试。');
      }
    },

    // 前往消息通知公告列表
    // goToMessageList() {
    //   // 导航到消息通知公告列表页面
    //   // 示例：使用Vue Router导航
    //   this.$router.push('/message-list');
    // },
    handleTabClick(tab) {
      // 处理标签切换逻辑
    },
    handleProcess() {
      // 处理办理按钮点击逻辑
      this.approvalDialog.title = '办理审批'; // 设置窗口标题
      this.approvalDialog.visible = true; // 显示窗口
    },
    onApprovalClose() {
      this.approvalDialog.visible = false
    },
    onApprovalConfirm() {
      //表单验证
      this.$refs.approvalsForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          //发送添加请求
          // console.log(this.approvalsForm.opinion);
          let params = {
            name: this.approvalSelectedOption,
            opinion:this.approvalsForm.opinion
          }
          // console.log(params.opinion);
          res = await approvalApi.addApproval(params);
          //判断是否成功
          // console.log(res);
          if (res.success) {
            this.$message.success(res.message);
            this.myapproval();
            //关闭窗口
            this.approvalDialog.visible = false;
          } else {
            this.$message.error(res.message);
          }
        }

      });
    },
    handleView() {
      // 处理查看按钮点击逻辑
    },
  
  },



};
</script>
<style scoped>
.plus {
  margin-left: 30px;
  margin-top: 30px;
}

.card {
  margin: 0 10px;
}

/* .tasks {
  margin-left: 30px;
} */

.h {
  margin-left: 20px;
}
</style>