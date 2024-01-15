<template>
  <div class="approval-page">
    <el-row>
      <el-col :span="6">

      </el-col>
      <el-col :span="18">
        <div class="content">
          <h2>我的审批</h2>
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="待审批" name="approval">
              <div class="search-bar">
                <div slot="content">
                  <el-form :model="approvalsForm" ref="approvalsForm" label-width="80px" :inline="false" size="small">
                    <el-select v-model="approvalsForm.name" placeholder="请选择" class="tasks"
                      @change="onApprovalSelectOption">
                      <el-option v-for="item in approvalOptions" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form>
                </div>
                <el-button class="search" type="primary" icon="el-icon-search" @click="handleSearch()">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>

              </div>

              <div>
                <el-button type="primary" @click="handleProcess">办理</el-button>
              </div>
              <el-table :data="approvalList" style="width: 100%">
                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column prop="name" label="单据"></el-table-column>
                <el-table-column prop="opinion" label="意见"></el-table-column>
                <el-table-column prop="status" label="审批状态"></el-table-column>
                <el-table-column label="操作" width="200" align="center">

                  <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleEdit(scope.row)">
                      审批
                    </el-button>
                    <el-dialog :visible.sync="dialogVisible" title="审批操作">
                      <el-button ref="approveButton" type="success" @click="approve">通过</el-button>
                      <el-button ref="rejectButton" type="warning" @click="reject">驳回</el-button>
                      <el-button ref="denyButton" type="danger" @click="denyOrComplete">拒绝</el-button>
                    </el-dialog>
                  </template>


                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="单据审批" name="handled">
              <div class="document-approval">
                <el-table :data="handledList" style="width: 100%">
                  <el-table-column prop="id" label="编号"></el-table-column>
                  <el-table-column prop="name" label="单据"></el-table-column>
                  <el-table-column prop="opinion" label="意见"></el-table-column>
                  <el-table-column prop="status" label="审批状态"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
    <system-dialog :title="approvalDialog.title" :visible="approvalDialog.visible" :width="approvalDialog.width"
      :height="approvalDialog.height" @onClose="onApprovalClose" @onConfirm="onApprovalConfirm">
      <div slot="content">
        <el-form :model="approvalsForm" ref="approvalsForm" label-width="80px" :rules="rules" :inline="false"
          size="small">
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
  </div>
</template>

<script>
import approvalApi from "@/api/approval"
import SystemDialog from '@/components/system/SystemDialog.vue';
import handledApi from '@/api/handled'

export default {
  name: 'myApproval',
  components: {
    SystemDialog
  },
  data() {

    return {
      searchModel: {
        name: "",
      },
      approval: {
        id: '',
        name: '',
        opinion: '',
        status: ''
      },
      dialogVisible: false,
      approvalDialog: {
        title: '',
        visible: false,
        height: 120,
        width: 400
      },
      searchKeyword: '',
      searchType: '',
      approvalSelectedOption: '',
      approvals: [],
      approvalsForm: {
        name: '',
        opinion: ''
      },
      rules: {
        name: [{ required: true, trigger: 'change', message: '请选择单据' }],
        opinion: [{ required: true, trigger: 'change', message: '请输入意见' }],
      },
      activeTab: 'approval',

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
      handledList: [],
      handleds: [],

    };
  },
  methods: {
    async handleSearch() {
      // const selectedLabel = this.approvalOptions.find(option => option.value === this.approvalsForm.name)?.label;
      // this.approvalSelectedOption = selectedLabel;
      console.log(this.approvalSelectedOption);
      let params = {
        name: this.approvalSelectedOption
      }
      let res = await approvalApi.getApproval(params);
      console.log(res);
      //判断是否存在数据
      if (res.success) {
        //获取数据
        this.approvalList = res.data;
      }
    },

    onApprovalSelectOption() {
      console.log(this.approvalOptions);
      const selectedLabel = this.approvalOptions.find(option => option.value === this.approvalsForm.name)?.label;
      console.log("selectedLabel:" + selectedLabel);
      if (selectedLabel) {
        this.approvalSelectedOption = selectedLabel;
      }
    },
    async myhandled() {
      let res = await handledApi.getHandledList(this.handleds.name)
      // console.log(res);
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
          opinion: approval.opinion,
          status: approval.status,
          date: approval.date
        }))
      }
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
            opinion: this.approvalsForm.opinion
          }
          // console.log(params);
          res = await approvalApi.addApproval(params);
          //判断是否成功
          console.log(res);
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
    handleTabClick(tab) {
      // 处理标签切换逻辑
    },
    /**
     * 重置查询条件
     */
    resetValue() {
      //清空查询条件
      this.approvalsForm = {};
      //重新查询
      this.myapproval();
      //
    },
    handleEdit(row) {
      this.approval = row
      // console.log(this.approval);
      this.dialogVisible = true;
    },
    async approve() {
      let buttonText = this.$refs.approveButton.$el.textContent;
      // console.log(buttonText); // 输出：通过
      let params = {
        id: this.approval.id,
        name: this.approval.name,
        opinion: this.approval.opinion,
        status: buttonText

      }
      // console.log(params);
      let res = await approvalApi.updateApproval(params);

      let obj = await handledApi.addHandled(params)

      await approvalApi.deleteApproval({ id: params.id })
      // console.log(res);
      // console.log(obj);

      if (res.success) {
        this.$message.success(res.message);
        this.myapproval();
        this.myhandled();

        //关闭窗口
        this.dialogVisible = false;
      } else {
        this.$message.error(res.message);
      }
      // 处理“通过”逻辑
    },
    async reject() {
      let buttonText = this.$refs.rejectButton.$el.textContent;
      // console.log(buttonText); // 输出：驳回
      let params = {
        id: this.approval.id,
        name: this.approval.name,
        opinion: this.approval.opinion,
        status: buttonText
      }
      // console.log(params);
      let res = await approvalApi.updateApproval(params);
      let obj = await handledApi.addHandled(params)

      await approvalApi.deleteApproval({ id: params.id })
      // console.log(res);
      if (res.success) {
        this.$message.success(res.message);
        this.myapproval();
        this.myhandled();
        //关闭窗口
        this.dialogVisible = false;
      } else {
        this.$message.error(res.message);
      }
      // 处理“驳回”逻辑
    },
    async denyOrComplete() {
      let buttonText = this.$refs.denyButton.$el.textContent;
      let params = {
        id: this.approval.id,
        name: this.approval.name,
        opinion: this.approval.opinion,
        status: buttonText

      }
      // console.log(params);
      let res = await approvalApi.updateApproval(params);
      let obj = await handledApi.addHandled(params)

      await approvalApi.deleteApproval({ id: params.id })
      // console.log(res);
      if (res.success) {
        this.$message.success(res.message);
        this.myapproval();
        this.myhandled();

        //关闭窗口
        this.dialogVisible = false;
      } else {
        this.$message.error(res.message);
      }
      // 处理“拒绝或完成”逻辑
    },
  },
  mounted() {
    this.myapproval();
    this.myhandled();
  },
};
</script>

<style>
.approval-page {
  padding: 20px;
}

.menu {
  height: 100%;
}

.content {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.search {
  margin-left: 30px;
}
</style>
