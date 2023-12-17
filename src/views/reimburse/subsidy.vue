<template>
    <div class="approval-page">
        <el-row>
            <el-col :span="18">
                <div class="content">
                    <h2>补助管理</h2>
                    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                        <el-tab-pane label="支付申请" name="approval">

                            <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
                                <el-form-item>
                                    <el-input v-model="searchModel.person" placeholder="请输入收款人" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="search(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openAddWindow()">申请</el-button>
                                </el-form-item>
                            </el-form>


                            <el-table :data="approvalList" style="width: 100%">
                                <el-table-column prop="id" label="编号"></el-table-column>
                                <el-table-column prop="department" label="申请部门"></el-table-column>
                                <el-table-column prop="person" label="收款人"></el-table-column>
                                <el-table-column prop="money" label="付款金额"></el-table-column>
                                <el-table-column prop="reason" label="付款事由"></el-table-column>
                                <el-table-column prop="type" label="类型"></el-table-column>
                                <el-table-column prop="month" label="月份" width="125px">
                                    <template slot-scope="scope">
                                        {{ formatDate2(scope.row.month) }}
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
                                :current-page="pageNo" :page-sizes="[5, 10, 20, 30, 40]" :page-size="5"
                                layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                        </el-tab-pane>
                        <el-tab-pane label="员工加班费补贴申请" name="handled">
                            <el-form :model="searchNoModel" ref="searchNoForm" label-width="100px" :inline="true"
                                size="small">
                                <el-form-item>
                                    <el-input v-model="searchNoModel.name" placeholder="请输入姓名" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="searchNO(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openNoAddWindow()">申请</el-button>
                                </el-form-item>
                            </el-form>
                            <div class="document-approval">
                                <el-table :data="handledList" style="width:100%">
                                    <el-table-column prop="id" label="编号"></el-table-column>
                                    <el-table-column prop="name" label="姓名"></el-table-column>
                                    <el-table-column prop="time" label="加班时长"></el-table-column>
                                    <el-table-column prop="type" label="加班类型"></el-table-column>
                                    <el-table-column prop="money" label="加班补助"></el-table-column>
                                    <el-table-column prop="num" label="在岗人数"></el-table-column>
                                    <el-table-column prop="opinion" label="意见"></el-table-column>

                                    
                                    <el-table-column prop="month" label="加班月份">
                                        <template slot-scope="scope">
                                            {{ formatDate2(scope.row.month) }}
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
                                    :current-page="pageNo2" :page-sizes="[5, 10, 20, 30, 40]" :page-size="5"
                                    layout="total, sizes, prev, pager, next, jumper" :total="total2">
                                </el-pagination>
                            </div>
                        </el-tab-pane>


                        <el-tab-pane label="外聘费申请" name="gift">
                            <el-form :model="searchHoModel" ref="searchHoForm" label-width="100px" :inline="true"
                                size="small">
                                <el-form-item>
                                    <el-input v-model="searchHoModel.name" placeholder="请输入姓名" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="searchHO(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openHoAddWindow()">申请</el-button>
                                </el-form-item>
                            </el-form>
                            <div class="document-approval">
                                <el-table :data="giftList" style="width:100%">
                                    <el-table-column prop="id" label="编号"></el-table-column>
                                    <el-table-column prop="name" label="姓名"></el-table-column>
                                    <el-table-column prop="money" label="费用"></el-table-column>
                                    <el-table-column prop="signature" label="签领人签名"></el-table-column>



                                    <el-table-column label="操作" width="200" align="center">

                                        <template slot-scope="scope">
                                            <el-button icon="el-icon-edit" type="primary" size="small"
                                                @click="hotiEdit(scope.row)">编辑
                                            </el-button>
                                            <el-button icon="el-icon-delete" type="danger" size="small"
                                                @click="hotiDelete(scope.row)">删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!-- 分页工具栏 -->
                                <el-pagination @size-change="notiSizeChange2" @current-change="notiCurrentChange2"
                                    :current-page="pageNo3" :page-sizes="[5, 10, 20, 30, 40]" :page-size="5"
                                    layout="total, sizes, prev, pager, next, jumper" :total="total3">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="慰问金申请" name="abroad">
                            <el-form :model="searchAoModel" ref="searchAoForm" label-width="100px" :inline="true"
                                size="small">
                                <el-form-item>
                                    <el-input v-model="searchAoModel.name" placeholder="请输入姓名" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="searchAO(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openAoAddWindow()">申请</el-button>
                                </el-form-item>
                            </el-form>
                            <div class="document-approval">
                                <el-table :data="abroadList" style="width:100%">
                                    <el-table-column prop="id" label="编号" width="50px"></el-table-column>
                                    <el-table-column prop="person" label="经办人"></el-table-column>
                                    <el-table-column prop="name" label="收款人"></el-table-column>
                                    <el-table-column prop="username" label="账号"></el-table-column>
                                    <el-table-column prop="money" label="付款金额"></el-table-column>

                                    <el-table-column prop="reason" label="原因"></el-table-column>
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
                                    :current-page="pageNo4" :page-sizes="[5, 10, 20, 30, 40]" :page-size="5"
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


                    <el-form-item label="申请部门" prop="department">
                        <el-input v-model="group.department"></el-input>
                    </el-form-item>
                    <el-form-item label="收款人" prop="person">
                        <el-input v-model="group.person"></el-input>
                    </el-form-item>
                    <el-form-item label="付款金额" prop="money">
                        <el-input v-model="group.money"></el-input>
                    </el-form-item>
                    <el-form-item label="付款事由" prop="reason">
                        <el-input v-model="group.reason"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="group.type" placeholder="请选择" class="tasks" @change="onPaySelectOption">
                            <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="月份">
                        <el-col :span="11">
                            <el-date-picker v-model="group.month" type="month" placeholder="选择月" value-format="yyyy-MM">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>


                </el-form>
            </div>
        </system-dialog>
        <system-dialog :title="handledDialog.title" :visible="handledDialog.visible" :width="handledDialog.width"
            :height="handledDialog.height" @onClose="onHandledClose" @onConfirm="onHandledConfirm">
            <div slot="content">
                <el-form :model="handled" ref="noFrom" label-width="110px" :inline="false" size="small">

                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="handled.name"></el-input>
                    </el-form-item>
                    <el-form-item label="加班时长" prop="time">
                        <el-input v-model="handled.time"></el-input>
                    </el-form-item>
                    <el-form-item label="加班类型" prop="type">
                        <el-select v-model="handled.type" placeholder="请选择" class="tasks" @change="onOvertimeSelectOption">
                            <el-option v-for="item in overtimeOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="加班补助" prop="money">
                        <el-input v-model="handled.money"></el-input>
                    </el-form-item>
                    <el-form-item label="在岗人数" prop="num">
                        <el-input v-model="handled.num"></el-input>
                    </el-form-item>
                    <el-form-item label="意见" prop="opinion">
                        <el-input v-model="handled.opinion"></el-input>
                    </el-form-item>
                    <el-form-item label="月份">
                        <el-col :span="11">
                            <el-date-picker v-model="handled.month" type="month" placeholder="选择月" value-format="yyyy-MM">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>
        <system-dialog :title="giftDialog.title" :visible="giftDialog.visible" :width="giftDialog.width"
            :height="giftDialog.height" @onClose="ongiftClose" @onConfirm="ongiftConfirm">
            <div slot="content">
                <el-form :model="gift" ref="hoFrom" label-width="110px" :inline="false" size="small">

                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="gift.name"></el-input>
                    </el-form-item>
                    <el-form-item label="费用" prop="money">
                        <el-input v-model="gift.money"></el-input>
                    </el-form-item>
                
                    <el-form-item label="签领人签名" prop="signature">
                        <el-select v-model="group.signature" placeholder="请选择" class="tasks" @change="onSignatureSelectOption">
                            <el-option v-for="item in SignatureOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
            </div>
        </system-dialog>
        <system-dialog :title="abroadDialog.title" :visible="abroadDialog.visible" :width="abroadDialog.width"
            :height="abroadDialog.height" @onClose="onAbroadClose" @onConfirm="onAbroadConfirm">
            <div slot="content">
                <el-form :model="abroad" ref="aoFrom" label-width="110px" :inline="false" size="small">

                    <el-form-item label="经办人" prop="person">
                        <el-input v-model="abroad.person"></el-input>
                    </el-form-item>
                    <el-form-item label="收款人" prop="name">
                        <el-input v-model="abroad.name"></el-input>
                    </el-form-item>
                    <el-form-item label="账号">
                        <el-input v-model="abroad.username"></el-input>

                    </el-form-item>
                    <el-form-item label="付款金额">
                        <el-input v-model="abroad.money"></el-input>

                    </el-form-item>
                    <el-form-item label="付款事由" prop="reason">
                        <el-input v-model="abroad.reason"></el-input>
                    </el-form-item>
    
                </el-form>
            </div>
        </system-dialog>
    </div>
</template>
    
<script>
import SystemDialog from '@/components/system/SystemDialog.vue';
import overtimeMoneyApi from '@/api/overtimeMoney';
import payApi from '@/api/pay'
import giftApi from '@/api/condolence'
import abroadApi from '@/api/Weiwen'
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
                pageSize: 5,
            },
            searchNoModel: {
                name: '',//角色名称
                pageNo: 1,
                pageSize: 5,
            },
            searchHoModel: {
                name: '',//角色名称
                pageNo: 1,
                pageSize: 5,
            },
            searchAoModel: {
                name: '',//角色名称
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

            roleList3: [], //数据列表
            tableHeight3: 0, //表格高度
            pageNo3: 1, //当前页码
            pageSize3: 5, //每页显示数量
            total3: 0, //总数量

            roleList4: [], //数据列表
            tableHeight4: 0, //表格高度
            pageNo4: 1, //当前页码
            pageSize4: 5, //每页显示数量
            total4: 0, //总数量
            handledSelectedOption: '',
            paySelectedOption: '',
            overtimeSelectedOption: '',
            SignatureSelectedOption:'',
            
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
            giftDialog: {
                title: '',
                visible: false,
                height: 250,
                width: 400
            },

            group: {
                id: '',
                department: '',
                person: '',
                money: '',
                reason: '',
                type: '',
                month: ''
            },
            abroad: {
                id: '',
                person:'',
                name:'',
                username:'',
                money:'',
                reason:''
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
            payOptions: [{
                value: '1',
                label: '员工加班补助'
            }, {
                value: '2',
                label: '人民陪审补助'
            },
            ],
            overtimeOptions: [{
                value: '1',
                label: '工作日'
            }, {
                value: '2',
                label: '休息'
            },{
                value: '3',
                label: '节假日'
            },
            ],
            SignatureOptions: [{
                value: '1',
                label: '是'
            }, {
                value: '2',
                label: '否'
            }
            ],

            handled: {
                id: '',
                name:'',
                time:'',
                type:'',
                money:'',
                num:'',
                opinion:'',
                month:''
            },
            gift: {
                id: '',
                name:'',
                money:'',
                signature:''
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
        formatDate2(date) {
            const options = { year: 'numeric', month: 'long' };
            return new Date(date).toLocaleDateString(undefined, options);
        },

        async search(pageNo = 1, pageSize = 2) {
            //修改当前页码
            this.searchModel.pageNo = pageNo;
            //修改每页显示数量
            this.searchModel.pageSize = pageSize;
            //发生查询请求
            let res = await payApi.getList(this.searchModel);
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
            let res = await overtimeMoneyApi.getList(this.searchNoModel);
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
        onPaySelectOption() {
            const selectedLabel = this.payOptions.find(option => option.value === this.group.type)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.paySelectedOption = selectedLabel;
            }
        },
        onOvertimeSelectOption() {
            const selectedLabel = this.overtimeOptions.find(option => option.value === this.handled.type)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.overtimeSelectedOption = selectedLabel;
            }
        },
        onSignatureSelectOption() {
            const selectedLabel = this.SignatureOptions.find(option => option.value === this.gift.signature)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.SignatureSelectedOption = selectedLabel;
            }
        },



        openAddWindow() {


            // 清空表单数据
            this.$resetForm("groupFrom", this.group);

            this.approvalDialog.title = '新增支付申请'; // 设置窗口标题
            this.approvalDialog.visible = true; // 显示窗口
        },
        openNoAddWindow() {


            // 清空表单数据
            this.$resetForm("noFrom", this.handled);
            this.handledDialog.title = '新增加班补助'; // 设置窗口标题
            this.handledDialog.visible = true; // 显示窗口
        },
        openAoAddWindow() {


            // 清空表单数据
            this.$resetForm("aoFrom", this.abroad);
            this.abroadDialog.title = '新增申请'; // 设置窗口标题
            this.abroadDialog.visible = true; // 显示窗口
        },
        openHoAddWindow() {


            // 清空表单数据
            this.$resetForm("hoFrom", this.gift);
            this.giftDialog.title = '新增申请'; // 设置窗口标题
            this.giftDialog.visible = true; // 显示窗口
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
        ongiftClose() {
            this.giftDialog.visible = false
        },
        onApprovalConfirm() {
            //表单验证
            this.$refs.groupFrom.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    //发送添加请求
                    // console.log(this.approvalsForm.opinion);
                    this.group.type = this.paySelectedOption;


                    if (this.group.id === "") {
                        res = await payApi.addMeeting(this.group);

                    } else {
                        res = await payApi.updateMeeting(this.group)

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
                    this.handled.type = this.overtimeSelectedOption;

                    // console.log(this.handled);

                    if (this.handled.id === "") {
                        res = await overtimeMoneyApi.addMeeting(this.handled);

                    } else {
                        res = await overtimeMoneyApi.updateMeeting(this.handled)

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
        ongiftConfirm() {
            //表单验证
            this.$refs.hoFrom.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    //发送添加请求
                    // console.log(this.approvalsForm.opinion);
                    // console.log(this.handled);
                    this.gift.signature = this.SignatureSelectedOption;

                    // console.log(this.handled);

                    if (this.gift.id === "") {
                        res = await giftApi.addMeeting(this.gift);

                    } 
                    // console.log(params);
                    //判断是否成功
                    console.log(res);
                    if (res.success) {
                        this.$message.success(res.message);
                        this.searchHO(this.pageNo, this.pageSize);
                        //关闭窗口
                        this.giftDialog.visible = false;
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
                    // this.abroad.type = this.handledSelectedOption;

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
            this.approvalDialog.title = "编辑支付申请"
            //显示编辑角色窗口
            this.approvalDialog.visible = true
        },

        async handleDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
            if (confirm) {
                //发送删除请求
                let res = await payApi.deleteById({ id: row.id })
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
            this.handledDialog.title = "编辑"
            //显示编辑角色窗口
            this.handledDialog.visible = true
        },
        hotiEdit(row) {
            //数据回显
            this.$objCopy(row, this.gift);
            //设置窗口标题
            this.giftDialog.title = "编辑外聘费"
            //显示编辑角色窗口
            this.giftDialog.visible = true
        },

        async notiDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
            if (confirm) {
                //发送删除请求
                let res = await overtimeMoneyApi.deleteById({ id: row.id })
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
            this.abroadDialog.title = "编辑"
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
        async hotiDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
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
}
</style>