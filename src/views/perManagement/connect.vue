<template>
    <div class="approval-page">
        <el-row>
            <el-col :span="6">

            </el-col>
            <el-col :span="18">
                <div class="content">
                    <h2>交接管理</h2>
                    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                        <el-tab-pane label="交接管理" name="approval">
                            <el-form :model="searchModel" ref="searchForm" label-width="90px" :inline="true" size="small">
                                <el-form-item>
                                    <el-input v-model="searchModel.name" placeholder="请输入姓名" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="search(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openAddWindow()">申请</el-button>
                                </el-form-item>
                            </el-form>


                            <el-table :data="approvalList" style="width: 100%">
                                <el-table-column prop="id" label="编号"></el-table-column>
                                <el-table-column prop="name" label="姓名"></el-table-column>
                                <el-table-column prop="department" label="所在部门"></el-table-column>
                                <el-table-column prop="job" label="职务"></el-table-column>
                                <el-table-column prop="personType" label="人员类别"></el-table-column>
                                <el-table-column prop="leftType" label="离岗类别"></el-table-column>
                                <el-table-column prop="status" label="交接状态"></el-table-column>
                                <el-table-column label="操作" width="200" align="center">

                                    <template slot-scope="scope">
                                        <el-button icon="el-icon-edit" type="primary" size="small"
                                            @click="handleEdit(scope.row)">编辑
                                        </el-button>
                                        <el-button icon="el-icon-delete" type="danger" size="small"
                                            @click="handleDelete(scope.row)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 分页工具栏 -->
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :current-page="pageNo" :page-sizes="[2, 4, 10, 20, 30]" :page-size="2"
                                layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                        </el-tab-pane>
                        
                        <el-tab-pane label="离职管理" name="handled">
                            <el-form :model="searchNoModel" ref="searchNoForm" label-width="80px" :inline="true"
                                size="small">
                                <el-form-item>
                                    <el-input v-model="searchNoModel.name" placeholder="请输入姓名" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="searchNO(pageNo2, pageSize2)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openNoAddWindow()">新增</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="exportExcel()">导出</el-button>

                                </el-form-item>
                            </el-form>
                            <div class="document-approval">
                                <el-table ref="multipleTable" :data="handledList" tooltip-effect="dark" style="width: 100%"
                                @selection-change="handleSelectionChange" id="tableId">
                                    <el-table-column type="selection" width="55">
                                </el-table-column>
                                    <el-table-column prop="id" label="编号"></el-table-column>
                                    <el-table-column prop="department" label="部门"></el-table-column>
                                    <el-table-column prop="name" label="姓名"></el-table-column>
                                    <el-table-column prop="cardId" label="身份证号"></el-table-column>
                                    <el-table-column prop="specialty" label="专业"></el-table-column>
                                    <el-table-column prop="gender" label="性别"></el-table-column>
                                    <el-table-column prop="startDate" label="入职日期" width="125px">
                                        <template slot-scope="scope">
                                            {{ formatDate(scope.row.startDate) }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="endDate" label="离岗日期" width="125px">
                                        <template slot-scope="scope">
                                            {{ formatDate(scope.row.endDate) }}
                                        </template>
                                    </el-table-column>
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
                                    :current-page="pageNo2" :page-sizes="[2, 4, 10, 20, 30]" :page-size="2"
                                    layout="total, sizes, prev, pager, next, jumper" :total="total2">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
        </el-row>
        <system-dialog :title="approvalDialog.title" :visible="approvalDialog.visible" :width="approvalDialog.width"
            :height="approvalDialog.height" @onClose="onApprovalClose" @onConfirm="onApprovalConfirm">
            <div slot="content">
                <el-form :model="group" ref="groupFrom" label-width="90px" :inline="false" size="small">

                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="group.name"></el-input>
                    </el-form-item>

                    <el-form-item label="所在部门" prop="department">
                        <el-input v-model="group.department"></el-input>
                    </el-form-item>
                    <el-form-item label="职务" prop="job">
                        <el-input v-model="group.job"></el-input>
                    </el-form-item>
                   
                    <el-form-item label="人员类别" prop="personType">
                        <el-select v-model="group.personType" placeholder="请选择" class="tasks" @change="onEducationSelectOption">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="离岗类别" prop="leftType">
                        <el-select v-model="group.leftType" placeholder="请选择" class="tasks" @change="onLeftSelectOption">
                            <el-option v-for="item in leftTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交接状态" prop="status">
                        <el-input v-model="group.status"></el-input>
                    </el-form-item>

                </el-form>
            </div>
        </system-dialog>
        <system-dialog :title="handledDialog.title" :visible="handledDialog.visible" :width="handledDialog.width"
            :height="handledDialog.height" @onClose="onHandledClose" @onConfirm="onHandledConfirm">
            <div slot="content">
                <el-form :model="handled" ref="noFrom" label-width="100px" :inline="false" size="small">
                    <el-form-item label="部门" prop="department">
                        <el-input v-model="handled.department"></el-input>
                    </el-form-item>
                    <el-form-item label="人员" prop="name">
                        <el-input v-model="handled.name"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="cardId">
                        <el-input v-model="handled.cardId"></el-input>
                    </el-form-item>
                    <el-form-item label="专业" prop="specialty">
                        <el-input v-model="handled.specialty"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-input v-model="handled.gender"></el-input>
                    </el-form-item>

                    
                    
                    <el-form-item label="入职时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="handled.startDate"
                                value-format="yyyy-MM-dd">></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="离岗日期">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="handled.endDate"
                                value-format="yyyy-MM-dd">></el-date-picker>
                        </el-col>
                    </el-form-item>
                    




                </el-form>
            </div>
        </system-dialog>
    </div>
</template>
    
<script>
import SystemDialog from '@/components/system/SystemDialog.vue';
import connectApi from '@/api/connect';
import FileSaver from 'file-saver';
import XLSX from 'xlsx'
import dimissionApi from '@/api/dimission'
export default {
    name: 'myApproval',
    components: {
        SystemDialog
    },
    data() {

        return {
            //查询条件
            searchModel: {
                name: '',
                pageNo: 1,
                pageSize: 2,
            },
            searchNoModel: {
                name: '',
                pageNo: 1,
                pageSize: 2,
            },
            activeTab: 'approval',

            roleList: [], //数据列表
            tableHeight: 0, //表格高度
            pageNo: 1, //当前页码
            pageSize: 2, //每页显示数量
            total: 0, //总数量
            roleList2: [], //数据列表
            tableHeight2: 0, //表格高度
            pageNo2: 1, //当前页码
            pageSize2: 2, //每页显示数量
            total2: 0, //总数量
            handledSelectedOption: '',
            leftSelectedOption: '',
            replySelectedOption: '',
            dialogVisible: false,
            approvalDialog: {
                title: '',
                visible: false,
                height: 250,
                width: 400
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


            group: {
                id: '',
                name: '',
                department:'',
                job:'',
                personType:'',
                leftType:'',
                status:''
            },
            activeTab: 'approval',

            typeOptions: [{
                value: '1',
                label: '在编'
            }, {
                value: '2',
                label: '外聘'
            }
            ],
            leftTypeOptions: [{
                value: '1',
                label: '退休'
            }, {
                value: '2',
                label: '调动'
            }, {
                value: '3',
                label: '辞职'
            }
            ],

            handled: {
                id: '',
                department:'',
                name:'',
                cardId:'',
                specialty:'',
                gender:'',
                startDate:'',
                endDate:''
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
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString(undefined, options);
        },

        async search(pageNo = 1, pageSize = 2) {
            //修改当前页码
            this.searchModel.pageNo = pageNo;
            //修改每页显示数量
            this.searchModel.pageSize = pageSize;
            //发生查询请求
            let res = await connectApi.getList(this.searchModel);
            // console.log(res);
            //判断是否成功
            if (res.success) {
                //赋值
                this.approvalList = res.data.records
                this.total = res.data.total

            }
        },
        async searchNO(pageNo = 1, pageSize = 2) {
            //修改当前页码
            this.searchNoModel.pageNo = pageNo;
            // console.log(this.searchNoModel.pageNo2);
            //修改每页显示数量
            this.searchNoModel.pageSize = pageSize;
            //发生查询请求
            let res = await dimissionApi.getList(this.searchNoModel);
            // console.log(res);
            //判断是否成功
            if (res.success) {
                //赋值
                this.handledList = res.data.records
                this.total2 = res.data.total

            }
        },
        onEducationSelectOption() {
            const selectedLabel = this.typeOptions.find(option => option.value === this.group.personType)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.handledSelectedOption = selectedLabel;
            }
        },
        onLeftSelectOption() {
            console.log(this.leftTypeOptions);
            const selectedLabel = this.leftTypeOptions.find(option => option.value === this.group.leftType)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.leftSelectedOption = selectedLabel;
            }
        },



        openAddWindow() {


            // 清空表单数据
            this.$resetForm("groupFrom", this.group);

            this.approvalDialog.title = '新增交接管理'; // 设置窗口标题
            this.approvalDialog.visible = true; // 显示窗口
        },
        openNoAddWindow() {


            // 清空表单数据
            this.$resetForm("noFrom", this.handled);
            this.handledDialog.title = '新增离岗申请'; // 设置窗口标题
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
                    this.group.personType = this.handledSelectedOption;
                    this.group.leftType = this.leftSelectedOption;
                    console.log(this.group);

                    if (this.group.id === "") {
                        res = await connectApi.addMeeting(this.group);

                    } else {
                        res = await connectApi.updateMeeting(this.group)

                    }
                    // console.log(params);
                    //判断是否成功
                    // console.log(res);
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
                    // console.log(this.handled);
                    // this.handled.type = this.handledSelectedOption;


                    // console.log(this.handled);

                    if (this.handled.id === "") {
                        res = await dimissionApi.addMeeting(this.handled);

                    } else {
                        res = await dimissionApi.updateMeeting(this.handled)

                    }
                    // console.log(params);
                    //判断是否成功
                    console.log(res);
                    if (res.success) {
                        this.$message.success(res.message);
                        this.searchNO(this.pageNo2, this.pageSize2);
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
            this.approvalDialog.title = "编辑交接管理"
            //显示编辑角色窗口
            this.approvalDialog.visible = true
        },

        async handleDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
            if (confirm) {
                //发送删除请求
                let res = await connectApi.deleteById({ id: row.id })
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
            this.handledDialog.title = "编辑离岗申请"
            //显示编辑角色窗口
            this.handledDialog.visible = true
        },

        async notiDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
            if (confirm) {
                //发送删除请求
                let res = await dimissionApi.deleteById({ id: row.id })
                //判断是否成功
                if (res.success) {
                    //成功提示
                    this.$message.success(res.message)
                    //刷新
                    this.searchNO(this.pageNo2, this.pageSize2)

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
            this.pageSize2 = size; // 更新每页显示数量
            // this.pageNo2 = 1; // 重置当前页码为第一页
            this.searchNO(this.pageNo2, size); // 执行搜索方法
        },
        notiCurrentChange(page) {
            this.pageNo2 = page; // 更新当前页码
            // console.log(page);
            // console.log(this.pageSize2);
            this.searchNO(page, this.pageSize2); // 执行搜索方法
            // console.log(this.pageNo2);

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
                    new Blob([wbout], { type: "application/octet-stream" }),
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