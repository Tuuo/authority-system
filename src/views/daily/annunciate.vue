<template>
    <div class="approval-page">
        <el-row>
            <el-col :span="6">

            </el-col>
            <el-col :span="18">
                <div class="content">
                    <h2>分组设置</h2>
                    <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
                        <el-form-item>
                            <el-input v-model="searchModel.roleName" placeholder="请输入角色名称" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
                            <el-button type="success" icon="el-icon-plus" @click="openAddWindow()">新增</el-button>
                        </el-form-item>
                    </el-form>


                    <el-table :data="approvalList" style="width: 100%">
                        <el-table-column prop="id" label="编号"></el-table-column>
                        <el-table-column prop="groupName" label="分组名"></el-table-column>
                        <el-table-column prop="groupPerson" label="分组人员"></el-table-column>
                        <el-table-column label="操作" width="200" align="center">

                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="small" @click="editFamily(scope.row)">编辑
                                </el-button>
                                <el-button type="danger" size="small" icon="el-icon-delete"
                                    @click="deleteFamily(scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页工具栏 -->
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                    <h2>分组设置</h2>
                    <div class="document-approval">
                        <el-table :data="handledList" style="width: 100%">
                            <el-table-column prop="id" label="编号"></el-table-column>
                            <el-table-column prop="name" label="单据"></el-table-column>
                            <el-table-column prop="opinion" label="意见"></el-table-column>
                            <el-table-column prop="status" label="审批状态"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-col>
        </el-row>
        <system-dialog :title="approvalDialog.title" :visible="approvalDialog.visible" :width="approvalDialog.width"
            :height="approvalDialog.height" @onClose="onApprovalClose" @onConfirm="onApprovalConfirm">
            <div slot="content">
                <el-form :model="group" ref="groupForm" label-width="80px"  :inline="false" size="small">

                    <el-form-item label="分组名称" prop="groupName">
                        <el-input v-model="group.name"></el-input>
                    </el-form-item>

                    <el-form-item label="分组人员" prop="groupPerson">
                        <el-input v-model="group.person"></el-input>
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
import groupApi from '@/api/group'
export default {
    name: 'myApproval',
    components: {
        SystemDialog
    },
    data() {

        return {
            //查询条件
            searchModel: {
                roleName: '',//角色名称
                pageNo: 1,
                pageSize: 2,
                userId: this.$store.getters.userId//当前登录用户id
            },
            roleList: [], //数据列表
            tableHeight: 0, //表格高度
            pageNo: 1, //当前页码
            pageSize: 2, //每页显示数量
            total: 0, //总数量
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
                height: 250,
                width: 400
            },
            searchKeyword: '',
            searchType: '',
            approvalSelectedOption: '',
            approvals: [],
            approvalsForm: {
                groupName: '',
                groupPerson: ''
            },
            
            group: {
                id: '',
                groupName: '',
                groupPerson: ''
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
        async search(pageNo = 1, pageSize = 2) {
            //修改当前页码
            this.searchModel.pageNo = pageNo;
            //修改每页显示数量
            this.searchModel.pageSize = pageSize;
            //发生查询请求
            let res = await groupApi.getList(this.searchModel)
            //判断是否成功
            if (res.success) {
                //赋值
                this.roleList = res.data.records
                this.total = res.data.total

            }
        },

        onApprovalSelectOption() {
            const selectedLabel = this.approvalOptions.find(option => option.value === this.approvalsForm.name)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.approvalSelectedOption = selectedLabel;
            }
        },
        
        openAddWindow() {
        

            // 清空表单数据
            this.$resetForm("roleForm", this.role);

            // 将createUser字段重新赋值
            this.role.createUser = createUser;

            this.roleDialog.title = '新增角色'; // 设置窗口标题
            this.roleDialog.visible = true; // 显示窗口
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

        handleEdit(row) {
            this.approval = row
            // console.log(this.approval);
            this.dialogVisible = true;
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