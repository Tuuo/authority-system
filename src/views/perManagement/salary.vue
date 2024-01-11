<template>
  <div class="approval-page">
    <el-row>
      <el-col :span="6">

      </el-col>
      <el-col :span="18">
        <div class="content">
          <h2>工资统计</h2>

          <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">

            <el-form-item>
              <!-- <el-upload class="upload-demo" action="http://localhost:9001/api/salary/add"
                  :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple
                  :limit="3" :on-exceed="handleExceed" :file-list="fileList" :on-change="handleFileUpload">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload> -->
              导入： <input type="file" @change="handleFileUpload"/>
            </el-form-item>
          </el-form>

          <el-table ref="multipleTable" :data="approvalList" tooltip-effect="dark" style="width: 100%"
                    @selection-change="handleSelectionChange" id="tableId">

            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="cardId" label="身份证号"></el-table-column>
            <el-table-column prop="moon" label="月份"></el-table-column>
            <el-table-column prop="money" label="应发工资"></el-table-column>
            <el-table-column prop="reMoney" label="实发工资"></el-table-column>
          </el-table>
          <!-- 分页工具栏 -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="10"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>

        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import SystemDialog from '@/components/system/SystemDialog.vue';
import eggSet from '@/api/eggSet';
import FileSaver from 'file-saver';
import XLSX from 'xlsx'
import salaryApi from '@/api/salary';

export default {
  name: 'myApproval',
  components: {
    SystemDialog
  },
  data() {

    return {
      fileList: [],
      multipleSelection: [],
      //查询条件
      searchModel: {
        name: '',//角色名称
        title: '',
        pageNo: 1,
        pageSize: 10,
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
        height: 250,
        width: 400
      },
      activeTab: 'approval',

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
      // activeTab: 'approval',

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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    handleFileUpload(event) {
      const fileList = event.target.files;
      const file = fileList[0];
      // const file = event.target.files[0];
      const reader = new FileReader();
      let tableData = null;

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        const headers = jsonData.shift();
        tableData = jsonData.map((row) => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });

        this.approvalList = tableData;
        console.log(this.approvalList);
        this.saveToDatabase(this.approvalList); // 调用保存到数据库的方法
      };

      reader.readAsArrayBuffer(file);
    },
    async saveToDatabase(data) {
      console.log(data);
      try {
        const promises = data.map(async (item) => {
          const res = await salaryApi.addMeeting(item);
          console.log(res);
          return res;
        });

        const results = await Promise.all(promises);
        console.log(results);
      } catch (error) {
        console.error(error);
      }
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
      let res = await salaryApi.getList(this.searchModel);
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
      this.$objCopy(row, this.group);
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

      // 创建一个名为 "Exported Data" 的工作表
      let ws = XLSX.utils.json_to_sheet(this.multipleSelection);
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
