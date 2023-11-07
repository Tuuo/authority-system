<template>
    <div class="approval-page">
        <el-row>
            <el-col :span="6">

            </el-col>
            <el-col :span="18">
                <div class="content">
                    <h2>办公用品申领</h2>
                    <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
                        <el-form-item>
                            <el-input v-model="searchModel.person" placeholder="请输入申请人" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
                            <el-button type="success" icon="el-icon-plus" @click="openAddWindow()">新增</el-button>
                        </el-form-item>
                    </el-form>


                    <el-table :data="approvalList" style="width: 100%">
                        <el-table-column prop="id" label="编号"></el-table-column>
                        <el-table-column prop="department" label="申请部门"></el-table-column>
                        <el-table-column prop="person" label="经办人"></el-table-column>
                        <el-table-column prop="applyDate" label="申请时间" width="125px">
                            <template slot-scope="scope">
                                {{ formatDate(scope.row.applyDate) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" label="申请类型"></el-table-column>
                        <el-table-column prop="status" label="审核状态"></el-table-column>

                        <el-table-column label="操作" width="200" align="center">

                            <template slot-scope="scope">
                                <el-button icon="el-icon-edit" type="primary" size="small" @click="handleEdit(scope.row)">编辑
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
                    
                    </div>
            </el-col>
        </el-row>
        <system-dialog :title="approvalDialog.title" :visible="approvalDialog.visible" :width="approvalDialog.width"
            :height="approvalDialog.height" @onClose="onApprovalClose" @onConfirm="onApprovalConfirm">
            <div slot="content">
                <el-form :model="group" ref="groupFrom" label-width="90px" :inline="false" size="small">

                    <el-form-item label="申请部门" prop="department">
                        <el-input v-model="group.department"></el-input>
                    </el-form-item>

                    <el-form-item label="经办人" prop="person">
                        <el-input v-model="group.person"></el-input>
                    </el-form-item>
                   
                    <el-form-item label="申请时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="group.applyDate"
                                value-format="yyyy-MM-dd">></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="申请类型" prop="type">
                        <el-select v-model="group.type" placeholder="请选择" class="tasks" @change="onEducationSelectOption">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核状态" prop="status">
                        <el-input v-model="group.status"></el-input>
                    </el-form-item>


                </el-form>
            </div>
        </system-dialog>
        
    </div>
</template>
    
<script>
import SystemDialog from '@/components/system/SystemDialog.vue';
import workApi from '@/api/work'
export default {
    name: 'myApproval',
    components: {
        SystemDialog
    },
    data() {

        return {
            //查询条件
            searchModel: {
                person: '',//角色名称
                title: '',
                pageNo: 1,
                pageSize: 2,
            },
            roleList: [], //数据列表
            tableHeight: 0, //表格高度
            pageNo: 1, //当前页码
            pageSize: 2, //每页显示数量
            total: 0, //总数量
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
            searchKeyword: '',
            searchType: '',
            approvals: [],
            approvalsForm: {
                groupName: '',
                groupPerson: ''
            },

            group: {
                id: '',
                department:'',
                person:'',
                applyDate:'',
                type:'',
                status:''
            },
            activeTab: 'approval',

            typeOptions: [{
                value: '1',
                label: '文具'
            }, {
                value: '2',
                label: '书本'
            },
            ],

            handled: {
                id: '',
                mdate:'',
                person:'',
                result:'',
                illustrate:''
            },

            approvalValue: '',
            approvalList: [],
            handledList: [],
            handleds: [],

        };
    },
    methods: {
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
            let res = await workApi.getList(this.searchModel);
            // console.log(res);
            //判断是否成功
            if (res.success) {
                //赋值
                this.approvalList = res.data.records
                this.total = res.data.total

            }
        },
        
        onEducationSelectOption() {
            const selectedLabel = this.typeOptions.find(option => option.value === this.group.type)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.handledSelectedOption = selectedLabel;
            }
        },



        openAddWindow() {


            // 清空表单数据
            this.$resetForm("groupFrom", this.group);

            this.approvalDialog.title = '新增报修'; // 设置窗口标题
            this.approvalDialog.visible = true; // 显示窗口
        },
        

        onApprovalClose() {
            this.approvalDialog.visible = false
        },
       
        onApprovalConfirm() {
            //表单验证
            this.$refs.groupFrom.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    //发送添加请求
                    // console.log(this.approvalsForm.opinion);
                    this.handled.type = this.handledSelectedOption;


                    if (this.group.id === "") {
                        res = await workApi.addMeeting(this.group);

                    } else {
                        res = await workApi.updateMeeting(this.group)

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
        


        handleEdit(row) {
            //数据回显
            this.$objCopy(row, this.group);
            //设置窗口标题
            this.approvalDialog.title = "编辑办公用品申请"
            //显示编辑角色窗口
            this.approvalDialog.visible = true
        },

        async handleDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
            if (confirm) {
                //发送删除请求
                let res = await workApi.deleteById({ id: row.id })
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
        this.search();
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
