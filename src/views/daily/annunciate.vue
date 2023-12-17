<template>
    <div class="approval-page">
        <el-row>
            <el-col :span="6">

            </el-col>
            <el-col :span="18">
                <div class="content">
                    <h2>通告管理</h2>
                    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                        <el-tab-pane label="分组管理" name="approval">
                            <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
                                <el-form-item>
                                    <el-input v-model="searchModel.groupName" placeholder="请输入分组名称" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="search(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openAddWindow()">新增</el-button>
                                </el-form-item>
                            </el-form>


                            <el-table :data="approvalList" style="width: 100%">
                                <el-table-column prop="id" label="编号"></el-table-column>
                                <el-table-column prop="groupName" label="分组名"></el-table-column>
                                <el-table-column prop="groupPerson" label="分组人员"></el-table-column>
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
                                :current-page="pageNo" :page-sizes="[5, 10, 20, 30, 40]" :page-size="5"
                                layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                        </el-tab-pane>
                        <el-tab-pane label="通告管理" name="handled">
                            <el-form :model="searchNoModel" ref="searchNoForm" label-width="80px" :inline="true"
                                size="small">
                                <el-form-item>
                                    <el-input v-model="searchNoModel.title" placeholder="请输入标题" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="searchNO(pageNo2, pageSize2)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openNoAddWindow()">新增</el-button>
                                </el-form-item>
                            </el-form>
                            <div class="document-approval">
                                <el-table :data="handledList" style="width: 100%">
                                    <el-table-column prop="id" label="编号"></el-table-column>
                                    <el-table-column prop="name" label="接收人"></el-table-column>
                                    <el-table-column prop="title" label="标题"></el-table-column>
                                    <el-table-column prop="type" label="类型"></el-table-column>
                                    <el-table-column prop="content" label="内容"></el-table-column>
                                    <el-table-column prop="send" label="发送方式"></el-table-column>
                                    <el-table-column prop="reply" label="回复方式"></el-table-column>
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
                                    :current-page="pageNo2" :page-sizes="[5, 10, 20, 30, 40]" :page-size="5"
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
                <el-form :model="group" ref="groupFrom" label-width="80px" :inline="false" size="small">

                    <el-form-item label="分组名称" prop="groupName">
                        <el-input v-model="group.groupName"></el-input>
                    </el-form-item>

                    <el-form-item label="分组人员" prop="groupPerson">
                        <el-input v-model="group.groupPerson"></el-input>
                    </el-form-item>

                </el-form>
            </div>
        </system-dialog>
        <system-dialog :title="handledDialog.title" :visible="handledDialog.visible" :width="handledDialog.width"
            :height="handledDialog.height" @onClose="onHandledClose" @onConfirm="onHandledConfirm">
            <div slot="content">
                <el-form :model="handled" ref="noFrom" label-width="80px" :inline="false" size="small">

                    <el-form-item label="接收人" prop="name">
                        <el-input v-model="handled.name"></el-input>
                    </el-form-item>

                    <el-form-item label="标题" prop="title">
                        <el-input v-model="handled.title"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="handled.type" placeholder="请选择" class="tasks" @change="onEducationSelectOption">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <el-input v-model="handled.content"></el-input>
                    </el-form-item>
                    <el-form-item label="发送方式" prop="send">
                        <el-select v-model="handled.send" placeholder="请选择" class="tasks" @change="onSendSelectOption">
                            <el-option v-for="item in sendOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="回复方式" prop="reply">
                        <el-select v-model="handled.reply" placeholder="请选择" class="tasks" @change="onReplySelectOption">
                            <el-option v-for="item in replyOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>



                </el-form>
            </div>
        </system-dialog>
    </div>
</template>
    
<script>
import SystemDialog from '@/components/system/SystemDialog.vue';
import groupApi from '@/api/group'
import notiApi from '@/api/notification'
export default {
    name: 'myApproval',
    components: {
        SystemDialog
    },
    data() {

        return {
            //查询条件
            searchModel: {
                groupName: '',//角色名称
                title: '',
                pageNo: 1,
                pageSize: 5,
            },
            searchNoModel: {
                title: '',
                pageNo: 1,
                pageSize: 5,
            },
            roleList: [], //数据列表
            tableHeight: 0, //表格高度
            pageNo: 1, //当前页码
            pageSize: 5, //每页显示数量
            total: 0, //总数量
            roleList2: [], //数据列表
            tableHeight2: 0, //表格高度
            pageNo2: 1, //当前页码
            pageSize2: 5, //每页显示数量
            total2: 0, //总数量
            handledSelectedOption: '',
            sendSelectedOption: '',
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
            approvalsForm: {
                groupName: '',
                groupPerson: ''
            },
            activeTab: 'approval',


            group: {
                id: '',
                groupName: '',
                groupPerson: ''
            },
            activeTab: 'approval',

            typeOptions: [{
                value: '1',
                label: '通知'
            }, {
                value: '2',
                label: '公告'
            },
            ],
            sendOptions: [{
                value: '1',
                label: '邮件'
            }, {
                value: '2',
                label: '站内'
            },
            ],
            replyOptions: [{
                value: '1',
                label: '自动已读'
            }, {
                value: '2',
                label: '回复已读'
            },
            ],
            handled: {
                id: '',
                name: '',
                title: '',
                type: '',
                content: '',
                send: '',
                reply: ''
            },

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
            let res = await groupApi.getList(this.searchModel);
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
            let res = await notiApi.getList(this.searchNoModel);
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
        onSendSelectOption() {
            const selectedLabel = this.sendOptions.find(option => option.value === this.handled.send)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.sendSelectedOption = selectedLabel;
            }
        },
        onReplySelectOption() {
            const selectedLabel = this.replyOptions.find(option => option.value === this.handled.reply)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.replySelectedOption = selectedLabel;
            }
        },
        handleTabClick(tab) {
            // 处理标签切换逻辑
        },


        openAddWindow() {


            // 清空表单数据
            this.$resetForm("groupFrom", this.group);

            this.approvalDialog.title = '新增分组'; // 设置窗口标题
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
                        res = await groupApi.addGroup(this.group);

                    } else {
                        res = await groupApi.updateGroup(this.group)

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
                    this.handled.send = this.sendSelectedOption
                    this.handled.reply = this.replySelectedOption

                    console.log(this.handled);

                    if (this.handled.id === "") {
                        res = await notiApi.addNoti(this.handled);

                    } else {
                        res = await notiApi.updateNoti(this.handled)

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
            this.approvalDialog.title = "编辑分组"
            //显示编辑角色窗口
            this.approvalDialog.visible = true
        },

        async handleDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
            if (confirm) {
                //发送删除请求
                let res = await groupApi.deleteById({ id: row.id })
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
                let res = await notiApi.deleteById({ id: row.id })
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
            console.log(this.pageNo2);

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