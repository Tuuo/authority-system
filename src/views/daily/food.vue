<template>
  <div class="approval-page">
    <el-row>
      <el-col :span="6">

      </el-col>
      <el-col :span="18">
        <div class="content">
          <h2>伙食管理</h2>
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="充值信息统计" name="approval">
              <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">

                <el-form-item>
                  <el-button type="success" icon="el-icon-plus" @click="exportExcel()">导出</el-button>
                </el-form-item>
              </el-form>

              <el-table ref="multipleTable" :data="approvalList" tooltip-effect="dark" style="width: 100%"
                        @selection-change="handleSelectionChange" id="tableId">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="id" label="序号"></el-table-column>
                <el-table-column prop="name" label="账号名称"></el-table-column>
                <el-table-column prop="type" label="账号类型"></el-table-column>
                <el-table-column prop="num" label="数量"></el-table-column>
                <el-table-column prop="price" label="金额"></el-table-column>
                <el-table-column prop="eatDate" label="用餐日期" width="125px">
                  <template slot-scope="scope">
                    {{ formatDate(scope.row.eatDate) }}
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>

              </el-table>
              <!-- 分页工具栏 -->
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                             :current-page="pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="10"
                             layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="汇总菜品" name="handled">
              <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
                <el-form-item>
                  <el-input v-model="searchModel.title" placeholder="请输入标题"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search"
                             @click="searchNO(pageNo, pageSize)">查询
                  </el-button>
                  <el-button type="success" icon="el-icon-plus" @click="openNoAddWindow()">新增</el-button>
                </el-form-item>
              </el-form>
              <div class="document-approval">
                <el-table :data="handledList" style="width:100%">
                  <el-table-column prop="id" label="序号" width="50px"></el-table-column>
                  <el-table-column prop="type" label="类型"></el-table-column>
                  <el-table-column prop="name" label="名称"></el-table-column>
                  <el-table-column prop="originalPrice" label="原价"></el-table-column>
                  <el-table-column prop="nowPrice" label="优惠价"></el-table-column>

                  <el-table-column label="操作" width="200" align="center">

                    <template slot-scope="scope">
                      <el-button icon="el-icon-edit" type="primary" size="small"
                                 @click="notiEdit(scope.row)">编辑
                      </el-button>
                      <el-button icon="el-icon-delete" type="danger" size="small"
                                 @click="notiDelete(scope.row)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页工具栏 -->
                <el-pagination @size-change="notiSizeChange" @current-change="notiCurrentChange"
                               :current-page="pageNo2" :page-sizes="[10, 20, 30, 40]" :page-size="10"
                               layout="total, sizes, prev, pager, next, jumper" :total="total2">
                </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>

    <system-dialog :title="handledDialog.title" :visible="handledDialog.visible" :width="handledDialog.width"
                   :height="handledDialog.height" @onClose="onHandledClose" @onConfirm="onHandledConfirm">
      <div slot="content">
        <el-form :model="handled" ref="noFrom" label-width="90px" :inline="false" size="small" :rules="rules">

          <el-form-item label="类型" prop="type">
            <el-select v-model="handled.type" placeholder="请选择" class="tasks" @change="onEducationSelectOption" style="width: 270px">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="handled.name" style="width: 270px"></el-input>
          </el-form-item>
          <el-form-item label="原价" prop="originalPrice">
            <el-input v-model="handled.originalPrice" style="width: 270px"></el-input>
          </el-form-item>

          <el-form-item label="优惠价" prop="nowPrice">
            <el-input v-model="handled.nowPrice" style="width: 270px"></el-input>
          </el-form-item>


        </el-form>
      </div>
    </system-dialog>
  </div>
</template>

<script>
import SystemDialog from '@/components/system/SystemDialog.vue';
import topUpApi from '@/api/topUp'
import eggSet from '@/api/eggSet';
import FileSaver from 'file-saver';
import XLSX from 'xlsx'

export default {
  name: 'myApproval',
  components: {
    SystemDialog
  },
  data() {

    return {
      multipleSelection: [],
      //查询条件
      searchModel: {
        name: '',//角色名称
        title: '',
        pageNo: 1,
        pageSize: 10,
      },
      rules: {
        type: [{required: true, trigger: 'change', message: '请选择类型'}],
        name: [{required: true, trigger: 'change', message: '请输入食品名'}],
        originalPrice: [{required: true, trigger: 'change', message: '请输入原价'}],
        nowPrice: [{required: true, trigger: 'change', message: '请输入优惠价'}],
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
      total2: 0,
      handledSelectedOption: '',
      sendSelectedOption: '',
      replySelectedOption: '',
      dialogVisible: false,
      approvalDialog: {
        title: '',
        visible: false,
        height: 280,
        width: 500
      },
      handledDialog: {
        title: '',
        visible: false,
        height: 205,
        width: 400
      },
      // activeTab: 'approval',

      searchKeyword: '',
      searchType: '',
      approvals: [],
      approvalsForm: {
        groupName: '',
        groupPerson: ''
      },

      group: {
        id: '',
        doorId: '',
        person: '',
        contain: '',
        mdate: ''
      },
      activeTab: 'approval',

      typeOptions: [{
        value: '1',
        label: '早餐'
      }, {
        value: '2',
        label: '午餐'
      },
        {
          value: '3',
          label: '晚餐'
        },
      ],

      handled: {
        id: '',
        type: '',
        name: '',
        originalPrice: '',
        nowPrice: ''
      },

      approvalValue: '',
      approvalList: [],
      handledList: [],
      handleds: [],

    };
  },
  methods: {
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
      let res = await topUpApi.getList(this.searchModel);
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
      this.searchModel.pageNo = pageNo;
      //修改每页显示数量
      this.searchModel.pageSize = pageSize;
      //发生查询请求
      let res = await eggSet.getList(this.searchModel);
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

    handleTabClick(tab) {
      // 处理标签切换逻辑
    },


    openAddWindow() {


      // 清空表单数据
      this.$resetForm("groupFrom", this.group);

      this.approvalDialog.title = '新增报修'; // 设置窗口标题
      this.approvalDialog.visible = true; // 显示窗口
    },
    openNoAddWindow() {


      // 清空表单数据
      this.$resetForm("noFrom", this.handled);
      this.handledDialog.title = '新增菜品'; // 设置窗口标题
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
            res = await maintainApi.addMeeting(this.group);

          } else {
            res = await maintainApi.updateMeeting(this.group)

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
            res = await eggSet.addMeeting(this.handled);

          } else {
            res = await eggSet.updateMeeting(this.handled)

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
      this.approvalDialog.title = "编辑报修"
      //显示编辑角色窗口
      this.approvalDialog.visible = true
    },

    async handleDelete(row) {
      //确认是否删除
      let confirm = await this.$myconfirm("确认要删除该数据吗？")
      if (confirm) {
        //发送删除请求
        let res = await maintainApi.deleteById({id: row.id})
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
      this.handledDialog.title = "编辑菜品"
      //显示编辑角色窗口
      this.handledDialog.visible = true
    },

    async notiDelete(row) {
      //确认是否删除
      let confirm = await this.$myconfirm("确认要删除该数据吗？")
      if (confirm) {
        //发送删除请求
        let res = await eggSet.deleteById({id: row.id})
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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    exportExcel() {
      if (this.multipleSelection.length === 0) {
        // 如果没有勾选任何项，则提示用户选择内容
        alert("请选择要导出的内容");
        return;
      }

      // 创建一个新的Workbook对象
      let wb = XLSX.utils.book_new();

      // 将数据转换为适用于导出的格式
      let formattedData = this.getFormattedData();

      // 创建一个名为 "Exported Data" 的工作表
      let ws = XLSX.utils.json_to_sheet(formattedData, {header: ['序号', '账号名称', '账号类型',
          '数量', '金额', '用餐日期', '状态']});
      XLSX.utils.book_append_sheet(wb, ws, "Exported Data");

      // 将Workbook对象转换为字节数组
      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });

      // 保存为Excel文件
      try {
        FileSaver.saveAs(
          new Blob([wbout], {type: "application/octet-stream"}),
          "导出详情单.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
    },

    getFormattedData() {
      // 对导出数据进行处理，将属性名转换为对应的中文表头
      return this.multipleSelection.map(item => ({
        '序号': item.id,
        '账号名称': item.name,
        '账号类型': item.type,
        '数量': item.num,
        '金额': item.price,
        '用餐日期': new Date(item.eatDate).toLocaleDateString(),
        '状态': item.status
      }));
    }
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
