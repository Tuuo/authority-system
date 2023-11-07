<template>
    <div class="approval-page">
        <el-row>
            <el-col :span="18">
                <div class="content">
                    <h2>出境管理</h2>
                    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                        <el-tab-pane label="证件借还" name="approval">

                            <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
                                <el-form-item>
                                    <el-input v-model="searchModel.person" placeholder="请输入领取人" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="search(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openAddWindow()">新增</el-button>
                                </el-form-item>
                            </el-form>


                            <el-table :data="approvalList" style="width: 100%">
                                <el-table-column prop="id" label="编号"></el-table-column>
                                <el-table-column prop="getDate" label="领取日期" width="125px">
                                    <template slot-scope="scope">
                                        {{ formatDate(scope.row.getDate) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="person" label="申请人"></el-table-column>
                                <el-table-column prop="contain" label="备注"></el-table-column>
                                <el-table-column prop="returnDate" label="归还日期" width="125px">
                                    <template slot-scope="scope">
                                        {{ formatDate(scope.row.returnDate) }}
                                    </template>
                                </el-table-column>
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
                        <el-tab-pane label="单据审批" name="handled">
                            <el-form :model="searchNoModel" ref="searchNoForm" label-width="100px" :inline="true"
                                size="small">
                                <el-form-item>
                                    <el-input v-model="searchNoModel.title" placeholder="请输入标题" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="searchNO(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openNoAddWindow()">新增</el-button>
                                </el-form-item>
                            </el-form>
                            <div class="document-approval">
                                <el-table :data="handledList" style="width:100%">
                                    <el-table-column prop="id" label="编号" ></el-table-column>
                                    <el-table-column prop="title" label="标题" ></el-table-column>

                                    <el-table-column prop="start" label="开始时间">
                                        <template slot-scope="scope">
                                            {{ formatDate(scope.row.start) }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="upEnd" label="上报截止时间" >
                                        <template slot-scope="scope">
                                            {{ formatDate(scope.row.upEnd) }}
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


                        <el-tab-pane label="礼品管理" name="gift">
                            <el-form :model="searchHoModel" ref="searchHoForm" label-width="100px" :inline="true"
                                size="small">
                                <el-form-item>
                                    <el-input v-model="searchHoModel.name" placeholder="请输入礼品名称" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="searchNO(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openNoAddWindow()">新增</el-button>
                                </el-form-item>
                            </el-form>
                            <div class="document-approval">
                                <el-table :data="giftList" style="width:100%">
                                    <el-table-column prop="id" label="编号" ></el-table-column>
                                    <el-table-column prop="name" label="礼品名称"></el-table-column>

                                    <el-table-column prop="giftDate" label="礼品期" >
                                        <template slot-scope="scope">
                                            {{ formatDate(scope.row.giftDate) }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="person" label="历史未领取人"></el-table-column>



                                    <el-table-column label="操作" width="200" align="center">

                                        <template slot-scope="scope">

                                            <el-button icon="el-icon-delete" type="danger" size="small"
                                                @click="yitiDelete(scope.row)">已领
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!-- 分页工具栏 -->
                                <el-pagination @size-change="notiSizeChange2" @current-change="notiCurrentChange2"
                                    :current-page="pageNo3" :page-sizes="[2, 4, 10, 20, 30]" :page-size="2"
                                    layout="total, sizes, prev, pager, next, jumper" :total="total3">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="出境申请" name="abroad">
                            <el-form :model="searchAoModel" ref="searchAoForm" label-width="100px" :inline="true"
                                size="small">
                                <el-form-item>
                                    <el-input v-model="searchAoModel.name" placeholder="请输入姓名" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="searchAO(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openAoAddWindow()">新增</el-button>
                                </el-form-item>
                            </el-form>
                            <div class="document-approval">
                                <el-table :data="abroadList" style="width:100%">
                                    <el-table-column prop="id" label="编号" width="50px"></el-table-column>
                                    <el-table-column prop="name" label="姓名"></el-table-column>
                                    <el-table-column prop="type" label="类型"></el-table-column>

                                    <el-table-column prop="start" label="开始时间" width="125px">
                                        <template slot-scope="scope">
                                            {{ formatDate(scope.row.start) }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="end" label="结束时间" width="125px">
                                        <template slot-scope="scope">
                                            {{ formatDate(scope.row.end) }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="reason" label="原因"></el-table-column>
                                    <el-table-column prop="location" label="目的地"></el-table-column>
                                    <el-table-column label="操作" width="200" align="center">

                                        <template slot-scope="scope">
                                            <el-button icon="el-icon-edit" type="primary" size="small"
                                                @click="AotiEdit(scope.row)">编辑
                                            </el-button>
                                            <el-button icon="el-icon-delete" type="danger" size="small"
                                                @click="AotiDelete(scope.row)">删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-pagination @size-change="notiSizeChange3" @current-change="notiCurrentChange3"
                                    :current-page="pageNo4" :page-sizes="[2, 4, 10, 20, 30]" :page-size="2"
                                    layout="total, sizes, prev, pager, next, jumper" :total="total4">
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

                    <el-form-item label="领取日期">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="group.getDate"
                                value-format="yyyy-MM-dd">></el-date-picker>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="领取人" prop="person">
                        <el-input v-model="group.person"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="contain">
                        <el-input v-model="group.contain"></el-input>
                    </el-form-item>
                    <el-form-item label="归还日期">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="group.returnDate"
                                value-format="yyyy-MM-dd">></el-date-picker>
                        </el-col>
                    </el-form-item>


                </el-form>
            </div>
        </system-dialog>
        <system-dialog :title="handledDialog.title" :visible="handledDialog.visible" :width="handledDialog.width"
            :height="handledDialog.height" @onClose="onHandledClose" @onConfirm="onHandledConfirm">
            <div slot="content">
                <el-form :model="handled" ref="noFrom" label-width="110px" :inline="false" size="small">

                    <el-form-item label="标题" prop="title">
                        <el-input v-model="handled.title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="handled.start"
                                value-format="yyyy-MM-dd">></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="上报截止时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="handled.upEnd"
                                value-format="yyyy-MM-dd">></el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>
        <system-dialog :title="abroadDialog.title" :visible="abroadDialog.visible" :width="abroadDialog.width"
            :height="abroadDialog.height" @onClose="onAbroadClose" @onConfirm="onAbroadConfirm">
            <div slot="content">
                <el-form :model="abroad" ref="aoFrom" label-width="110px" :inline="false" size="small">

                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="abroad.name"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="abroad.type" placeholder="请选择" class="tasks" @change="onEducationSelectOption">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="abroad.start"
                                value-format="yyyy-MM-dd">></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="abroad.end"
                                value-format="yyyy-MM-dd">></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="原因" prop="reason">
                        <el-input v-model="abroad.reason"></el-input>
                    </el-form-item>
                    <el-form-item label="目的地" prop="location">
                        <el-input v-model="abroad.location"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>
    </div>
</template>
    
<script>
import SystemDialog from '@/components/system/SystemDialog.vue';
import summaryApi from '@/api/summary';
import returnApi from '@/api/return'
import giftApi from '@/api/gift'
import abroadApi from '@/api/abroad'
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
                pageNo: 1,
                pageSize: 2,
            },
            searchNoModel: {
                title: '',//角色名称
                pageNo: 1,
                pageSize: 2,
            },
            searchHoModel: {
                name: '',//角色名称
                pageNo: 1,
                pageSize: 2,
            },
            searchAoModel: {
                name: '',//角色名称
                pageNo: 1,
                pageSize: 2,
            },
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

            roleList3: [], //数据列表
            tableHeight3: 0, //表格高度
            pageNo3: 1, //当前页码
            pageSize3: 2, //每页显示数量
            total3: 0, //总数量

            roleList4: [], //数据列表
            tableHeight4: 0, //表格高度
            pageNo4: 1, //当前页码
            pageSize4: 2, //每页显示数量
            total4: 0, //总数量
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
            abroadDialog: {
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
                getDate: '',
                person: '',
                contain: '',
                returnDate: ''
            },
            abroad: {
                id: '',
                name: '',
                type: '',
                start: '',
                end: '',
                reason: '',
                location: '',
            },
            activeTab: 'approval',

            typeOptions: [{
                value: '1',
                label: '登记备案人员'
            }, {
                value: '2',
                label: '非登记备案人员'
            },
            ],

            handled: {
                id: '',
                title: '',
                start: '',
                upEnd: ''
            },

            approvalValue: '',
            approvalList: [],
            abroadList: [],
            giftList: [],

            handledList: [],
            handleds: [],
            activeTab: 'approval',


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
            let res = await returnApi.getList(this.searchModel);
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
            //修改每页显示数量
            this.searchNoModel.pageSize = pageSize;
            //发生查询请求
            let res = await summaryApi.getList(this.searchNoModel);
            // console.log(res);
            //判断是否成功
            if (res.success) {
                //赋值
                this.handledList = res.data.records
                this.total2 = res.data.total

            }
        },
        async searchHO(pageNo = 1, pageSize = 2) {
            //修改当前页码
            this.searchHoModel.pageNo = pageNo;
            //修改每页显示数量
            this.searchHoModel.pageSize = pageSize;
            //发生查询请求
            let res = await giftApi.getList(this.searchHoModel);
            // console.log(res);
            //判断是否成功
            if (res.success) {
                //赋值
                this.giftList = res.data.records
                this.total3 = res.data.total

            }
        },
        async searchAO(pageNo = 1, pageSize = 2) {
            //修改当前页码
            this.searchAoModel.pageNo = pageNo;
            //修改每页显示数量
            this.searchAoModel.pageSize = pageSize;
            //发生查询请求
            let res = await abroadApi.getList(this.searchAoModel);
            // console.log(res);
            //判断是否成功
            if (res.success) {
                //赋值
                this.abroadList = res.data.records
                this.total4 = res.data.total

            }
        },
        onEducationSelectOption() {
            const selectedLabel = this.typeOptions.find(option => option.value === this.abroad.type)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.handledSelectedOption = selectedLabel;
            }
        },



        openAddWindow() {


            // 清空表单数据
            this.$resetForm("groupFrom", this.group);

            this.approvalDialog.title = '新增证件'; // 设置窗口标题
            this.approvalDialog.visible = true; // 显示窗口
        },
        openNoAddWindow() {


            // 清空表单数据
            this.$resetForm("noFrom", this.handled);
            this.handledDialog.title = '新增汇总'; // 设置窗口标题
            this.handledDialog.visible = true; // 显示窗口
        },
        openAoAddWindow() {


            // 清空表单数据
            this.$resetForm("aoFrom", this.abroad);
            this.abroadDialog.title = '新增出境申请'; // 设置窗口标题
            this.abroadDialog.visible = true; // 显示窗口
        },

        onApprovalClose() {
            this.approvalDialog.visible = false
        },
        onAbroadClose() {
            this.abroadDialog.visible = false
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
                        res = await returnApi.addMeeting(this.group);

                    } else {
                        res = await returnApi.updateMeeting(this.group)

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
                    // console.log(this.handled);
                    // this.handled.result = this.handledSelectedOption;

                    // console.log(this.handled);

                    if (this.handled.id === "") {
                        res = await summaryApi.addMeeting(this.handled);

                    } else {
                        res = await summaryApi.updateMeeting(this.handled)

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
        onAbroadConfirm() {
            //表单验证
            this.$refs.aoFrom.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    //发送添加请求
                    // console.log(this.approvalsForm.opinion);
                    // console.log(this.handled);
                    this.abroad.type = this.handledSelectedOption;

                    // console.log(this.handled);

                    if (this.abroad.id === "") {
                        res = await abroadApi.addMeeting(this.abroad);

                    } else {
                        res = await abroadApi.updateMeeting(this.abroad)

                    }
                    // console.log(params);
                    //判断是否成功
                    console.log(res);
                    if (res.success) {
                        this.$message.success(res.message);
                        this.searchAO(this.pageNo, this.pageSize);
                        //关闭窗口
                        this.abroadDialog.visible = false;
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
                let res = await returnApi.deleteById({ id: row.id })
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
            this.handledDialog.title = "编辑结果"
            //显示编辑角色窗口
            this.handledDialog.visible = true
        },

        async notiDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
            if (confirm) {
                //发送删除请求
                let res = await summaryApi.deleteById({ id: row.id })
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
        AotiEdit(row) {
            //数据回显
            this.$objCopy(row, this.abroad);
            //设置窗口标题
            this.abroadDialog.title = "编辑结果"
            //显示编辑角色窗口
            this.abroadDialog.visible = true
        },

        async AotiDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
            if (confirm) {
                //发送删除请求
                let res = await abroadApi.deleteById({ id: row.id })
                //判断是否成功
                if (res.success) {
                    //成功提示
                    this.$message.success(res.message)
                    //刷新
                    this.searchAO(this.pageNo, this.pageSize)

                } else {
                    //失败提示
                    this.$message.error(res.message)
                }
            }

        },
        async yitiDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要领取礼品吗？")
            if (confirm) {
                //发送删除请求
                let res = await giftApi.deleteById({ id: row.id })
                //判断是否成功
                if (res.success) {
                    //成功提示
                    this.$message.success(res.message)
                    //刷新
                    this.searchHO(this.pageNo, this.pageSize)

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
        /**
     * 当每页数量发生变化时触发该事件
     */
        notiSizeChange2(size) {
            this.pageSize3 = size
            this.searchHO(this.pageNo3, size)
        },
        /**
        * 当页码发生变化时触发该事件
        */
        notiCurrentChange2(page) {
            this.pageNo3 = page
            this.searchHO(page, this.pageSize3);
        },
        /**
    * 当每页数量发生变化时触发该事件
    */
        notiSizeChange3(size) {
            this.pageSize4 = size
            this.searchAO(this.pageNo4, size)
        },
        /**
        * 当页码发生变化时触发该事件
        */
        notiCurrentChange3(page) {
            this.pageNo4 = page
            this.searchAO(page, this.pageSize4);
        },
        handleTabClick(tab) {
      // 处理标签切换逻辑
    },
    },
    mounted() {
        this.search();
        this.searchNO();
        this.searchHO();
        this.searchAO();

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
}</style>