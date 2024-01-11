<template>
  <div class="approval-page">
    <el-row>
      <el-col :span="6">

      </el-col>
      <el-col :span="24">
        <div class="content">
          <h2>报销管理</h2>
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="日常报销" name="approval">
              <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
                <el-form-item>
                  <el-input v-model="searchModel.name" placeholder="请输入姓名"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search"
                             @click="search(pageNo, pageSize)">查询
                  </el-button>
                  <el-button type="success" icon="el-icon-plus" @click="openAddWindow()">申请</el-button>
                </el-form-item>
              </el-form>


              <el-table :data="approvalList" style="width: 100%">
                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column prop="inDate" label="填报日期" width="125px">
                  <template slot-scope="scope">
                    {{ formatDate(scope.row.inDate) }}
                  </template>
                </el-table-column>
                <el-table-column prop="department" label="部门"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="reason" label="报销事由"></el-table-column>
                <el-table-column prop="price" label="报销金额"></el-table-column>
                <el-table-column label="操作" width="200" align="center">

                  <template slot-scope="scope">
                    <el-button icon="el-icon-edit" type="primary" size="small"
                               @click="handleEdit(scope.row)">编辑
                    </el-button>
                    <el-button icon="el-icon-delete" type="danger" size="small"
                               @click="handleDelete(scope.row)">撤销
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页工具栏 -->
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                             :current-page="pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="10"
                             layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </el-tab-pane>

          </el-tabs>
        </div>
      </el-col>
    </el-row>
    <system-dialog :title="approvalDialog.title" :visible="approvalDialog.visible" :width="approvalDialog.width"
                   :height="approvalDialog.height" @onClose="onApprovalClose" @onConfirm="onApprovalConfirm">
      <div slot="content">
        <el-form :model="group" ref="groupFrom" label-width="90px" :inline="false" size="small" :rules="rules4">

          <el-form-item label="填写日期" prop="inDate">
            <el-col :span="11">
              <el-date-picker type="datetime" placeholder="选择日期" v-model="group.inDate"
                              value-format="yyyy-MM-dd" style="width: 360px">>
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-input v-model="group.department" style="width: 360px" ></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="group.name" style="width: 360px"></el-input>
          </el-form-item>
          <el-form-item label="报销事由" prop="reason">
            <el-input v-model="group.reason" style="width: 360px"></el-input>
          </el-form-item>
          <el-form-item label="报销金额" prop="price">
            <el-input v-model="group.price" style="width: 360px"></el-input>
          </el-form-item>


        </el-form>
      </div>
    </system-dialog>

  </div>
</template>

<script>
import SystemDialog from '@/components/system/SystemDialog.vue';
import dailyApi from '@/api/daily'
import appointmentApi from '@/api/appointment'

export default {
  name: 'myApproval',
  components: {
    SystemDialog
  },
  data() {

    return {
      //查询条件
      searchModel: {
        name: '',//角色名称
        title: '',
        pageNo: 1,
        pageSize: 10,
      },
      searchNoModel: {
        title: '',
        pageNo: 1,
        pageSize: 10,
      },
      // activeTab: 'approval',
      rules4: {
        department: [{required: true, trigger: 'change', message: '请输入部门'},],
        name: [{required: true, trigger: 'change', message: '请输入姓名'},],
        inDate: [{required: true, trigger: 'change', message: '请输入填写时间'},],

        reason: [{required: true, trigger: 'change', message: '请选择原因'}],
        price: [{required: true, trigger: 'change', message: '请选择金额'}],

      },
      roleList: [], //数据列表
      tableHeight: 0, //表格高度
      pageNo: 1, //当前页码
      pageSize: 10, //每页显示数量
      total: 0, //总数量
      roleList2: [], //数据列表
      tableHeight2: 0, //表格高度
      pageNo2: 1, //当前页码
      pageSize2: 10, //每页显示数量
      total2: 0, //总数量
      handledSelectedOption: '',
      sendSelectedOption: '',
      replySelectedOption: '',
      dialogVisible: false,
      approvalDialog: {
        title: '',
        visible: false,
        height: 250,
        width: 500
      },
      handledDialog: {
        title: '',
        visible: false,
        height: 250,
        width: 400
      },
      searchKeyword: '',
      searchType: '',
      approvals: [],
      approvalsForm: {
        groupName: '',
        groupPerson: ''
      },

      group: {
        id: '',
        inDate: '',
        department: '',
        name: '',
        reason: '',
        price: ''
      },
      activeTab: 'approval',

      typeOptions: [{
        value: '1',
        label: '视频会议'
      }, {
        value: '2',
        label: '座谈'
      },
      ],

      handled: {
        id: '',
        department: '',
        title: '',
        name: '',
        start: '',
        end: '',
        meetingNumber: '',
        contain: '',
        type: '',
        applyPerson: ''
      },

      approvalValue: '',
      approvalList: [],
      handledList: [],
      handleds: [],

    };
  },
  methods: {
    handleTabClick(tab) {
      // 处理标签切换逻辑
    },
    formatDate(date) {
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
      return new Date(date).toLocaleDateString(undefined, options);
    },

    async search(pageNo = 1, pageSize = 10) {
      //修改当前页码
      this.searchModel.pageNo = pageNo;
      //修改每页显示数量
      this.searchModel.pageSize = pageSize;
      //发生查询请求
      let res = await dailyApi.getList(this.searchModel);
      // console.log(res);
      //判断是否成功
      if (res.success) {
        //赋值
        this.approvalList = res.data.records
        this.total = res.data.total

      }
    },
    async searchNO(pageNo = 1, pageSize = 10) {
      //修改当前页码
      this.searchNoModel.pageNo = pageNo;
      //修改每页显示数量
      this.searchNoModel.pageSize = pageSize;
      //发生查询请求
      let res = await appointmentApi.getList(this.searchNoModel);
      // console.log(res);
      //判断是否成功
      if (res.success) {
        //赋值
        this.handledList = res.data.records
        this.total2 = res.data.total

      }
    },
    onEducationSelectOption() {
      const selectedLabel = this.typeOptions.find(option => option.value === this.handled.type)?.label;
      console.log("selectedLabel:" + selectedLabel);
      if (selectedLabel) {
        this.handledSelectedOption = selectedLabel;
      }
    },


    openAddWindow() {


      // 清空表单数据
      this.$resetForm("groupFrom", this.group);

      this.approvalDialog.title = '申请日常报销'; // 设置窗口标题
      this.approvalDialog.visible = true; // 显示窗口
    },
    openNoAddWindow() {


      // 清空表单数据
      this.$resetForm("noFrom", this.handled);
      this.handledDialog.title = '新增通告'; // 设置窗口标题
      this.handledDialog.visible = true; // 显示窗口
    },

    onApprovalClose() {
      this.approvalDialog.visible = false
    },
    onHandledClose() {
      this.handledDialog.visible = false
    },
    onApprovalConfirm() {
      //表单验证
      this.$refs.groupFrom.validate(async (valid) => {
        if (valid) {
          let res = null;
          //发送添加请求
          // console.log(this.approvalsForm.opinion);


          if (this.group.id === "") {
            res = await dailyApi.addMeeting(this.group);

          } else {
            res = await dailyApi.updateMeeting(this.group)

          }
          // console.log(params);
          //判断是否成功
          console.log(res);
          if (res.success) {
            this.$message.success(res.message);
            this.search(this.pageNo, this.pageSize);
            //关闭窗口
            this.approvalDialog.visible = false;
          } else {
            this.$message.error(res.message);
          }
        }

      });
    },
    onHandledConfirm() {
      //表单验证
      this.$refs.noFrom.validate(async (valid) => {
        if (valid) {
          let res = null;
          //发送添加请求
          // console.log(this.approvalsForm.opinion);
          console.log(this.handled);
          this.handled.type = this.handledSelectedOption;

          console.log(this.handled);

          if (this.handled.id === "") {
            res = await appointmentApi.addMeeting(this.handled);

          } else {
            res = await appointmentApi.updateMeeting(this.handled)

          }
          // console.log(params);
          //判断是否成功
          console.log(res);
          if (res.success) {
            this.$message.success(res.message);
            this.searchNO(this.pageNo, this.pageSize);
            //关闭窗口
            this.handledDialog.visible = false;
          } else {
            this.$message.error(res.message);
          }
        }

      });
    },


    handleEdit(row) {
      //数据回显
      this.$objCopy(row, this.group);
      //设置窗口标题
      this.approvalDialog.title = "编辑日常报销"
      //显示编辑角色窗口
      this.approvalDialog.visible = true
    },

    async handleDelete(row) {
      //确认是否删除
      let confirm = await this.$myconfirm("确认要删除该数据吗？")
      if (confirm) {
        //发送删除请求
        let res = await dailyApi.deleteById({id: row.id})
        //判断是否成功
        if (res.success) {
          //成功提示
          this.$message.success(res.message)
          //刷新
          this.search(this.pageNo, this.pageSize)

        } else {
          //失败提示
          this.$message.error(res.message)
        }
      }

    },
    notiEdit(row) {
      //数据回显
      this.$objCopy(row, this.handled);
      //设置窗口标题
      this.handledDialog.title = "编辑通告"
      //显示编辑角色窗口
      this.handledDialog.visible = true
    },

    async notiDelete(row) {
      //确认是否删除
      let confirm = await this.$myconfirm("确认要删除该数据吗？")
      if (confirm) {
        //发送删除请求
        let res = await appointmentApi.deleteById({id: row.id})
        //判断是否成功
        if (res.success) {
          //成功提示
          this.$message.success(res.message)
          //刷新
          this.searchNO(this.pageNo, this.pageSize)

        } else {
          //失败提示
          this.$message.error(res.message)
        }
      }

    },
    /**
     * 当每页数量发生变化时触发该事件
     */
    handleSizeChange(size) {
      this.pageSize = size
      this.search(this.pageNo, size)
    },
    /**
     * 当页码发生变化时触发该事件
     */
    handleCurrentChange(page) {
      this.pageNo = page
      this.search(page, this.pageSize);
    },
    /**
     * 当每页数量发生变化时触发该事件
     */
    notiSizeChange(size) {
      this.pageSize2 = size
      this.searchNO(this.pageNo2, size)
    },
    /**
     * 当页码发生变化时触发该事件
     */
    notiCurrentChange(page) {
      this.pageNo2 = page
      this.searchNO(page, this.pageSize2);
    },
  },
  mounted() {
    this.search();
    this.searchNO();
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
