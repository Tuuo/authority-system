<template>
    <div>
      <!-- 显示所有消息通告 -->
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
        <el-link v-for="attachment in currentMessage.attachments" :key="attachment.id" :href="attachment.url" target="_blank">
          {{ attachment.name }}
        </el-link>
      </el-dialog>
  
      <!-- 更多按钮 -->
      <el-button @click="goToMessageList">更多</el-button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        messages: [], // 存储消息通告
        currentMessage: null, // 当前查看的消息
        dialogVisible: false, // 是否显示详细信息对话框
        replyContent: '', // 回复内容
      };
    },
    methods: {
      // 模拟数据加载
      fetchData() {
        // 这里应该从后端获取消息通告数据
        // 示例数据
        this.messages = [
          {
            id: 1,
            timestamp: 1633819200000, // 时间戳
            title: "任务通告 1",
            content: "这是任务通告的内容 1",
            replied: false, // 是否已回复
            attachments: [
              { id: 1, name: "附件1", url: "附件1的URL" },
              { id: 2, name: "附件2", url: "附件2的URL" }
            ]
          },
          // 更多消息通告...
        ];
      },
      // 格式化时间戳为可读时间
      formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
      },
      // 查看消息详细信息
      viewMessage(message) {
        this.currentMessage = message;
        this.dialogVisible = true;
        if (!message.replied) {
          // 标记消息为已读
          message.replied = true;
        }
      },
      // 回复已读消息
      replyToMessage() {
        // 处理回复逻辑，发送回复内容
        // 示例：发送回复后，更新界面
        this.currentMessage.replied = true;
        this.dialogVisible = false;
        this.replyContent = '';
      },
      // 自动已读
      markAsRead() {
        // 处理自动已读逻辑
        // 示例：标记消息为已读，不显示回复区域
        this.currentMessage.replied = true;
        this.dialogVisible = false;
      },
      // 前往消息通知公告列表
      goToMessageList() {
        // 导航到消息通知公告列表页面
        // 示例：使用Vue Router导航
        this.$router.push('/message-list');
      }
    },
    mounted() {
      // 加载消息通告数据
      this.fetchData();
    }
  };
  </script>
  