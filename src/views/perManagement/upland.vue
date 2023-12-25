<template>
    <el-container :style="{ height: containerHeight + 'px' }">
        <!-- 左侧部门树形菜单列表 -->
        <el-aside style="
    padding: 10px 0px 0px 0px;
    background: #fff;
    border-right: 1px solid #dfe6ec;
    " width="200px">
            <el-tree style="font-size: 14px" ref="leftTree" :data="deptList" node-key="id" :props="defaultProps"
                default-expand-all empty-text="暂无数据" :show-checkbox="false" :highlight-current="true"
                :expand-on-click-node="false" @node-click="handleNodeClick">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div>
                        <span v-if="data.children.length == 0">
                            <i class="el-icon-document"></i>
                        </span>
                        <span v-else @click.stop="openBtn(data)">
                            <svg-icon v-if="data.open" icon-class="add-s" />
                            <svg-icon v-else icon-class="sub-s" />
                        </span>
                        <!-- 名称 -->
                        <span style="margin-left: 3px">{{ node.label }}</span>
                    </div>
                </div>
            </el-tree>
        </el-aside>
        <el-main>
            <h2>合同工</h2>
            <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                <el-tab-pane label="合同工" name="approval">
                    <!-- 查询条件 -->
                    <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
                        <el-form-item>
                            <el-input v-model="searchModel.username" placeholder="请输入用户名" />
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="searchModel.realName" placeholder="请输入真实姓名" />
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="searchModel.phone" placeholder="请输入电话" />
                        </el-form-item>
                        <el-form-item>
                            <el-button icon="el-icon-search" type="primary"
                                @click="search(departmentId, pageNo, pageSize)">查询
                            </el-button>
                            <el-button icon="el-icon-delete" @click="resetValue()">重置</el-button>
                            <el-button icon="el-icon-plus" size="small" type="success"
                                @click="openAddWindow()">新增</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 用户表格数据 -->

                    <el-table :data="userList" style="width: 100%; ">
                        <el-table-column prop="username" label="用户名"></el-table-column>
                        <el-table-column prop="realName" label="姓名"></el-table-column>
                        <el-table-column prop="departmentName" label="所属部门"></el-table-column>
                        <el-table-column prop="phone" label="电话"></el-table-column>
                        <el-table-column prop="email" label="邮箱"></el-table-column>
                        <el-table-column align="center" width="290" label="操作">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleEdit(scope.row)">编辑
                                </el-button>
                                <el-button icon="el-icon-delete" type="danger" size="mini"
                                    @click="handleDelete(scope.row)">删除</el-button>
                                <el-button icon="el-icon-setting" type="primary" size="mini"
                                    @click="assignRole(scope.row)">分配角色</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页工具栏 -->
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="外聘人员" name="handled">

                    <el-col :span="24">
                        <div class="content">
                            <el-form :model="searchNoModel" ref="searchNoForm" label-width="80px" :inline="true"
                                size="small">
                                <el-form-item>
                                    <el-input v-model="searchNoModel.name" placeholder="请输入姓名" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="searchNo(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openNoAddWindow()">新增</el-button>
                                </el-form-item>
                            </el-form>


                            <el-table :data="approvalList" style="width: 100%">
                                <el-table-column prop="id" label="编号"></el-table-column>
                                <el-table-column prop="name" label="姓名"></el-table-column>
                                <el-table-column prop="school" label="学校"></el-table-column>
                                <el-table-column prop="specialty" label="专业"></el-table-column>
                                <el-table-column prop="ououtStart" label="外聘开始时间" width="125px">
                                    <template slot-scope="scope">
                                        {{ formatDate(scope.row.ououtStart) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="ououtEnd" label="外聘结束时间" width="125px">
                                    <template slot-scope="scope">
                                        {{ formatDate(scope.row.ououtEnd) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="person" label="介绍人"></el-table-column>
                                <el-table-column prop="department" label="部门"></el-table-column>
                                <el-table-column prop="cardId" label="身份证号"></el-table-column>

                                <el-table-column label="操作" width="200" align="center">

                                    <template slot-scope="scope">
                                        <el-button icon="el-icon-edit" type="primary" size="small"
                                            @click="handleNoEdit(scope.row)">编辑
                                        </el-button>
                                        <el-button icon="el-icon-delete" type="danger" size="small"
                                            @click="handleNoDelete(scope.row)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 分页工具栏 -->
                            <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
                                :current-page="pageNo2" :page-sizes="[5, 10, 20, 30, 40]" :page-size="5"
                                layout="total, sizes, prev, pager, next, jumper" :total="total2">
                            </el-pagination>

                        </div>
                    </el-col>
                </el-tab-pane>

                <el-tab-pane label="节假日配置" name="holiday">

                    <el-col :span="24">
                        <div class="content">
                            <el-form :model="searchHoModel" ref="searchHoForm" label-width="80px" :inline="true"
                                size="small">
                                <el-form-item>
                                    <el-input v-model="searchHoModel.name" placeholder="请输入节假日名称" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search"
                                        @click="searchHo(pageNo, pageSize)">查询</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="openHoAddWindow()">新增</el-button>
                                </el-form-item>
                            </el-form>


                            <el-table :data="holidayList" style="width: 100%">
                                <el-table-column prop="id" label="编号"></el-table-column>
                                <el-table-column prop="name" label="节假日名称"></el-table-column>
                                <el-table-column prop="holidayDate" label="日期" width="125px">
                                    <template slot-scope="scope">
                                        {{ formatDate(scope.row.holidayDate) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="status" label="工作状态"></el-table-column>
                                <el-table-column prop="isHoliday" label="是否节假日"></el-table-column>


                                <el-table-column label="操作" width="200" align="center">

                                    <template slot-scope="scope">
                                        <el-button icon="el-icon-edit" type="primary" size="small"
                                            @click="handleHolidayEdit(scope.row)">编辑
                                        </el-button>
                                        <el-button icon="el-icon-delete" type="danger" size="small"
                                            @click="handleHolidayDelete(scope.row)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 分页工具栏 -->
                            <el-pagination @size-change="handleSizeChange3" @current-change="handleCurrentChange3"
                                :current-page="pageNo3" :page-sizes="[5, 10, 20, 30, 40]" :page-size="5"
                                layout="total, sizes, prev, pager, next, jumper" :total="total3">
                            </el-pagination>

                        </div>

                    </el-col>
                </el-tab-pane>
            </el-tabs>
            <system-dialog :title="holidayDialog.title" :visible="holidayDialog.visible" :width="holidayDialog.width"
                :height="holidayDialog.height" @onClose="onHolidayClose" @onConfirm="onHolidayConfirm">
                <div slot="content">
                    <el-form :model="holiday" ref="holidayFrom" label-width="100px" :inline="false" size="small">
                        <el-form-item label="节假日名称" prop="name">
                            <el-input v-model="holiday.name"></el-input>
                        </el-form-item>
                        <el-form-item label="日期">
                            <el-col :span="13">
                                <el-date-picker type="date" placeholder="选择日期" v-model="holiday.holidayDate"
                                    value-format="yyyy-MM-dd">></el-date-picker>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="工作状态" prop="status">
                            <el-select v-model="holiday.status" placeholder="请选择" class="tasks"
                                @change="onEducationSelectOption">
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否节假日" prop="isHoliday">
                            <el-select v-model="holiday.isHoliday" placeholder="请选择" class="tasks"
                                @change="onHolidaySelectOption">
                                <el-option v-for="item in holidayOptions" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select> </el-form-item>

                    </el-form>
                </div>
            </system-dialog>
            <system-dialog :title="approvalDialog.title" :visible="approvalDialog.visible" :width="approvalDialog.width"
                :height="approvalDialog.height" @onClose="onApprovalClose" @onConfirm="onApprovalConfirm">
                <div slot="content">
                    <el-form :model="group" ref="groupFrom" label-width="100px" :inline="false" size="small">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="group.name"></el-input>
                        </el-form-item>
                        <el-form-item label="学校" prop="school">
                            <el-input v-model="group.school"></el-input>
                        </el-form-item>
                        <el-form-item label="专业" prop="specialty">
                            <el-input v-model="group.specoalty"></el-input>
                        </el-form-item>
                        <el-form-item label="外聘开始时间">
                            <el-col :span="13">
                                <el-date-picker type="date" placeholder="选择日期" v-model="group.ououtStart"
                                    value-format="yyyy-MM-dd">></el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="外聘结束时间">
                            <el-col :span="13">
                                <el-date-picker type="date" placeholder="选择日期" v-model="group.ououtEnd"
                                    value-format="yyyy-MM-dd">></el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="介绍人" prop="person">
                            <el-input v-model="group.person"></el-input>
                        </el-form-item>
                        <el-form-item label="部门" prop="department">
                            <el-input v-model="group.department"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="cardId">
                            <el-input v-model="group.cardId"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </system-dialog>
            <!-- 添加和编辑用户窗口 -->
            <system-dialog :title="userDialog.title" :height="userDialog.height" :width="userDialog.width"
                :visible="userDialog.visible" @onClose="onClose" @onConfirm="onConfirm">
                <div slot="content">
                    <el-form :model="user" ref="userForm" :rules="rules" label-width="80px" :inline="true" size="small">
                        <el-form-item prop="username" label="用户名">
                            <el-input v-model="user.username"></el-input>
                        </el-form-item>
                        <el-form-item prop="password" v-if="user.id === ''" label="密码">
                            <el-input type="password" v-model="user.password"></el-input>
                        </el-form-item>
                        <el-form-item prop="departmentName" label="所属部门">
                            <el-input v-model="user.departmentName" :readonly="true"
                                @click.native="selectDepartment()"></el-input>
                        </el-form-item>
                        <el-form-item prop="realName" label="姓名">
                            <el-input v-model="user.realName"></el-input>
                        </el-form-item>
                        <el-form-item prop="phone" label="电话">
                            <el-input v-model="user.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称">
                            <el-input v-model="user.nickName"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input v-model="user.email"></el-input>
                        </el-form-item>
                        <el-form-item prop="gender" label="性别">
                            <el-radio-group v-model="user.gender">
                                <el-radio :label="0">男</el-radio>
                                <el-radio :label="1">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <br>
                        <!-- 用户头像 -->
                        <el-form-item label="头像">
                            <el-upload :show-file-list="false" :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload" class="avatar-uploader" :data="uploadHeader"
                                action="http://localhost:9001/api/oss/file/upload?module=avatar">
                                <img v-if="user.avatar" :src="user.avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon" />
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </div>
            </system-dialog>
            <!-- 所属部门弹框 -->
            <system-dialog :title="parentDialog.title" :width="parentDialog.width" :height="parentDialog.height"
                :visible="parentDialog.visible" @onClose="onParentClose" @onConfirm="onParentConfirm">
                <div slot="content">
                    <el-tree ref="parentTree" :data="parentList" default-expand-all node-key="id" :props="parentProps"
                        :show-checkbox="false" :highlight-current="true" :expand-on-click-node="false"
                        @node-click="parentClick">
                        <div class="customer-tree-node" slot-scope="{ node, data }">
                            <span v-if="data.children.length == 0">
                                <i class="el-icon-document" />
                            </span>
                            <span v-else @click.stop="openParentBtn(data)">
                                <svg-icon v-if="data.open" icon-class="add-s" />
                                <svg-icon v-else icon-class="sub-s" />
                            </span>
                            <span style="margin-left: 3px">{{ node.label }}</span>
                        </div>
                    </el-tree>
                </div>
            </system-dialog>
            <!-- 分配角色窗口 -->
            <system-dialog :title="assignDialog.title" :height="assignDialog.height" :width="assignDialog.width"
                :visible="assignDialog.visible" @onClose="onAssignClose" @onConfirm="onAssignConfirm">
                <div slot="content">
                    <!-- 分配角色数据列表 -->
                    <el-table ref="assignRoleTable" :data="assignRoleList" border stripe :height="assignHeight"
                        style="width: 100%; margin-bottom: 10px" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column prop="roleCode" label="角色编码" />
                        <el-table-column prop="roleName" label="角色名称" />
                        <el-table-column prop="remark" label="角色备注" />
                    </el-table>
                    <!-- 分页工具栏 -->
                    <el-pagination @size-change="assignSizeChange" @current-change="assignCurrentChange"
                        :current-page.sync="roleVo.pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="roleVo.pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="roleVo.total" background>
                    </el-pagination>
                </div>
            </system-dialog>


        </el-main>

    </el-container>
</template>
<script>
//导入部门api脚本
import departmentApi from '@/api/department';
//导入token
import { getToken } from '@/utils/auth'
import userApi from '@/api/user'
import SystemDialog from '@/components/system/SystemDialog.vue';
import ououtApi from '@/api/ouout';
import holidayApi from '@/api/holiday'
export default {
    name: 'upland',
    components: {
        SystemDialog
    },
    data() {
        let validatePhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入手机号码"));
                //使用正则表达式进行验证手机号码
            } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error("手机号格式不正确"));
            } else {
                callback();
            }
        };

        return {
            containerHeight: 0, //容器高度
            deptList: [], //左侧部门树形菜单列表
            //树节点属性
            defaultProps: {
                children: 'children',
                label: 'departmentName'
            },
            searchModel: {
                username: "",
                realName: "",
                phone: "",
                departmentId: "",
                pageNo: 1,
                pageSize: 10,
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
            userList: [], //用户列表
            pageNo: 1, //当前页码
            pageSize: 10, //每页显示数量
            total: 0, //总数量
            departmentId: "", //部门编号

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
            userDialog: {
                title: '',
                height: 410,
                width: 610,
                visible: false
            },
            activeTab: 'approval',

            //用户对象
            user: {
                id: '',
                departmentId: '',
                departmentName: '',
                email: '',
                realName: '',
                phone: '',
                nickName: '',
                password: '',
                username: '',
                gender: '',
                avatar: ''
            },
            rules: {
                departmentName: [{
                    required: true, trigger: 'change', message: '请选择所属部门'
                }],
                realName: [{ required: true, trigger: 'blur', message: '请填写姓名' }],
                phone: [{ trigger: 'blur', validator: validatePhone }],
                username: [{ required: true, trigger: 'blur', message: '请填写登录名' }],
                password: [{ required: true, trigger: 'blur', message: '请填写登录密码' }],
                gender: [{ required: true, trigger: 'change', message: '请选择性别' }]
            },
            parentDialog: {
                title: '选择所属部门',
                width: 300,
                height: 450,
                visible: false
            },
            //树节点属性
            parentProps: {
                children: 'children',
                label: 'departmentName'
            },
            parentList: [], //所属部门节点数据
            //上传需要携带的数据
            uploadHeader: { "token": getToken() },
            //分配角色窗口属性
            assignDialog: {
                title: "",
                visible: false,
                width: 800,
                height: 410,
            },
            //角色对象
            roleVo: {
                pageNo: 1,
                pageSize: 10,
                userId: "",
                total: 0,
            },
            assignRoleList: [], //角色列表
            assignHeight: 0, //分配角色表格高度
            selectedIds: [], //被选中的角色id
            selectedUserId: "", //被分配角色的用户ID
            group: {
                id: '',
                name: '',
                school: '',
                specoalty: '',
                ououtStart: '',
                ououtEnd: '',
                person: '',
                department: '',
                cardId: ''
            },
            holiday: {
                id: '',
                name: '',
                holidayDate: '',
                status: '',
                isHoliday: '',
            },
            approvalValue: '',
            approvalList: [],
            holidayList: [],

            typeOptions: [{
                value: '1',
                label: '节假日'
            }, {
                value: '2',
                label: '工作日'
            }, {
                value: '3',
                label: '休息日'
            },
            ],
            holidayOptions: [{
                value: '1',
                label: '是'
            }, {
                value: '2',
                label: '否'
            },
            ],
            approvalDialog: {
                title: '',
                visible: false,
                height: 280,
                width: 500
            },
            holidayDialog: {
                title: '',
                visible: false,
                height: 280,
                width: 500
            },
            handledSelectedOption: '',
            holidaySelectedOption: '',

            sendSelectedOption: '',
            replySelectedOption: '',
            dialogVisible: false,
            searchKeyword: '',
            searchType: '',
            approvals: [],

        }

    },
    methods: {
        handleTabClick(tab) {
            // 处理标签切换逻辑
        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString(undefined, options);
        },
        /**
* 上传成功回调
* @param res
* @param file
*/
        handleAvatarSuccess(res, file) {
            this.user.avatar = res.data
            // 强制重新渲染
            this.$forceUpdate()
        },
        /**
        * 上传校验
        * @param file
        * @returns {boolean}
        */
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },

        /**
* 查询部门列表
*/
        async getDeptList() {
            //发送查询请求
            let res = await departmentApi.getDepartmentList(null)
            //判断是否成功
            if (res.success) {
                this.deptList = res.data;
                //树加载完成后，默认点击第一个节点
                this.$nextTick(() => {
                    const firstNode = document.querySelector(".el-tree-node");
                    firstNode.click();
                });
            }
        },

        /**
        * 左侧树节点点击事件
        */
        handleNodeClick(data) {
            //给部门编号赋值
            this.departmentId = data.id;
            //查询数据
            this.search(this.departmentId);
        },
        //加减号图标点击事件
        openBtn(data) {
            //修改折叠展开状态
            data.open = !data.open
            this.$refs.leftTree.store.nodesMap[data.id].expanded = !data.open;
        },
        /**
* 查询用户列表
*/
        async search(departmentId, pageNo = 1, pageSize = 10) {
            this.searchModel.pageNo = pageNo;
            this.searchModel.pageSize = pageSize;
            this.searchModel.departmentId = departmentId;
            //发送查询请求
            let res = await userApi.getUserList(this.searchModel);
            if (res.success) {
                this.userList = res.data.records;
                this.total = res.data.total;
            }
        },
        async searchNo(pageNo = 1, pageSize = 5) {
            //修改当前页码
            this.searchNoModel.pageNo = pageNo;
            //修改每页显示数量
            this.searchNoModel.pageSize = pageSize;
            //发生查询请求
            let res = await ououtApi.getList(this.searchNoModel);
            // console.log(res);
            //判断是否成功
            if (res.success) {
                //赋值
                this.approvalList = res.data.records
                this.total2 = res.data.total

            }
        },
        async searchHo(pageNo = 1, pageSize = 5) {
            //修改当前页码
            this.searchHoModel.pageNo = pageNo;
            //修改每页显示数量
            this.searchHoModel.pageSize = pageSize;
            //发生查询请求
            let res = await holidayApi.getList(this.searchHoModel);
            // console.log(res);
            //判断是否成功
            if (res.success) {
                //赋值
                this.holidayList = res.data.records
                this.total3 = res.data.total

            }
        },
        openNoAddWindow() {


            // 清空表单数据
            this.$resetForm("groupFrom", this.group);

            this.approvalDialog.title = '新增外聘人员'; // 设置窗口标题
            this.approvalDialog.visible = true; // 显示窗口
        },
        openHoAddWindow() {


            // 清空表单数据
            this.$resetForm("holidayFrom", this.holiday);

            this.holidayDialog.title = '新增节假日'; // 设置窗口标题
            this.holidayDialog.visible = true; // 显示窗口
        },


        onHolidayClose() {
            this.holidayDialog.visible = false
        },
        onHolidayConfirm() {
            //表单验证
            this.$refs.holidayFrom.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    //发送添加请求
                    // console.log(this.approvalsForm.opinion);
                    this.holiday.status = this.handledSelectedOption;
                    this.holiday.isHoliday = this.holidaySelectedOption;

                    console.log(this.holiday);

                    if (this.holiday.id === "") {
                        res = await holidayApi.addMeeting(this.holiday);

                    } else {
                        res = await holidayApi.updateMeeting(this.holiday)

                    }
                    // console.log(params);
                    //判断是否成功
                    console.log(res);
                    if (res.success) {
                        this.$message.success(res.message);
                        this.searchHo(this.pageNo, this.pageSize);
                        //关闭窗口
                        this.holidayDialog.visible = false;
                    } else {
                        this.$message.error(res.message);
                    }
                }

            });
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
                    // this.handled.type = this.handledSelectedOption;
                    // console.log(this.group);

                    if (this.group.id === "") {
                        res = await ououtApi.addMeeting(this.group);

                    } else {
                        res = await ououtApi.updateMeeting(this.group)

                    }
                    // console.log(params);
                    //判断是否成功
                    console.log(res);
                    if (res.success) {
                        this.$message.success(res.message);
                        this.searchNo(this.pageNo, this.pageSize);
                        //关闭窗口
                        this.approvalDialog.visible = false;
                    } else {
                        this.$message.error(res.message);
                    }
                }

            });
        },

        handleHolidayEdit(row) {
            //数据回显
            this.$objCopy(row, this.holiday);
            //设置窗口标题
            this.holidayDialog.title = "编辑外聘人员"
            //显示编辑角色窗口
            this.holidayDialog.visible = true
        },

        async handleHolidayDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
            if (confirm) {
                //发送删除请求
                let res = await holidayApi.deleteById({ id: row.id })
                //判断是否成功
                if (res.success) {
                    //成功提示
                    this.$message.success(res.message)
                    //刷新
                    this.searchHo(this.pageNo, this.pageSize)

                } else {
                    //失败提示
                    this.$message.error(res.message)
                }
            }

        },

        handleNoEdit(row) {
            //数据回显
            this.$objCopy(row, this.group);
            //设置窗口标题
            this.approvalDialog.title = "编辑外聘人员"
            //显示编辑角色窗口
            this.approvalDialog.visible = true
        },

        async handleNoDelete(row) {
            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
            if (confirm) {
                //发送删除请求
                let res = await ououtApi.deleteById({ id: row.id })
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
        onEducationSelectOption() {
            const selectedLabel = this.typeOptions.find(option => option.value === this.holiday.status)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.handledSelectedOption = selectedLabel;
            }
        },
        onHolidaySelectOption() {
            const selectedLabel = this.holidayOptions.find(option => option.value === this.holiday.isHoliday)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.holidaySelectedOption = selectedLabel;
            }
        },
        handleTabClick(tab) {
            // 处理标签切换逻辑
        },
        /**
    * 当每页数量发生变化时触发该事件
    */
        handleSizeChange(size) {
            this.pageSize = size; //将每页显示的数量交给成员变量
            this.search(this.departmentId, this.pageNo, size);
        },
        /**
        * 当页码发生变化时触发该事件
        */
        handleCurrentChange(page) {
            this.pageNo = page;
            //调用查询方法
            this.search(this.departmentId, page, this.pageSize);
        },
        handleSizeChange2(size) {
            this.pageSize2 = size; //将每页显示的数量交给成员变量
            this.searchNo(this.pageNo2, size);
        },
        /**
        * 当页码发生变化时触发该事件
        */
        handleCurrentChange2(page) {
            this.pageNo2 = page;
            //调用查询方法
            this.searchNo(page, this.pageSize2);
        },
        handleSizeChange3(size) {
            this.pageSize3 = size; //将每页显示的数量交给成员变量
            this.searchHo(this.pageNo3, size);
        },
        /**
        * 当页码发生变化时触发该事件
        */
        handleCurrentChange3(page) {
            this.pageNo3 = page;
            //调用查询方法
            this.searchHo(page, this.pageSize3);
        },

        /**
        * 重置查询条件
        */
        resetValue() {
            //清空查询条件
            this.searchModel = {};
            //重新查询
            this.search(this.departmentId);
        },
        /**
* 打开添加窗口
*/
        openAddWindow() {
            this.$resetForm('userForm', this.user) //清空表单
            this.userDialog.visible = true //显示窗口
            this.userDialog.title = '新增用户' //设置标题
        },
        /**
        * 新增或编辑取消事件
        */
        onClose() {
            this.userDialog.visible = false //关闭窗口
        },
        /**
        * 新增或编辑确认事件
        */
        /**
* 新增或编辑确认事件
*/
        onConfirm() {
            this.$refs.userForm.validate(async (valid) => {
                if (valid) {
                    let res = null
                    //判断用户ID是否为空
                    if (this.user.id === '') {
                        //新增
                        //发送添加请求
                        res = await userApi.addUser(this.user)
                    } else {
                        //发送修改请求
                        res = await userApi.updateUser(this.user)
                    }
                    //判断是否成功
                    if (res.success) {
                        this.$message.success(res.message)
                        //刷新
                        this.search(this.departmentId, this.pageNo, this.pageSize);
                        //关闭窗口
                        this.userDialog.visible = false
                    } else {
                        this.$message.error(res.message)
                    }
                }
            })
        },


        /**
        * 打开选择所属部门窗口
        */
        selectDepartment() {
        },
        /**
* 打开选择上级部门窗口
*/
        async selectDepartment() {
            //查询上级部门数据
            let res = await departmentApi.getDepartmentList(null)
            //判断是否成功
            if (res.success) {
                this.parentList = res.data
            }
            //显示窗口
            this.parentDialog.visible = true
        },
        /**
        * 选择上级部门取消事件
        */
        onParentClose() {
            this.parentDialog.visible = false //关闭窗口
        },
        /**
        * 选择上级部门确认事件
        */
        onParentConfirm() {
            this.parentDialog.visible = false
        },
        //上级部门树节点点击事件
        parentClick(data) {
            this.user.departmentId = data.id
            this.user.departmentName = data.departmentName
        },
        //上级部门树加号 减号 图标点击事件
        openParentBtn(data) {
            data.open = !data.open
            this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
        },
        /**
* 编辑用户
*/
        handleEdit(row) {
            //设置弹框属性
            this.userDialog.title = '编辑用户'
            this.userDialog.visible = true
            //把当前编辑的数据复制到表单数据域，供回显使用
            this.$objCopy(row, this.user)
        },
        /**
* 删除
*/
        async handleDelete(row) {
            let confirm = await this.$myconfirm('确定要删除该数据吗?')
            if (confirm) {
                //封装条件
                let params = { id: row.id }
                //发送删除请求
                let res = await userApi.deleteUser(params)
                //判断是否成功
                if (res.success) {
                    this.$message.success(res.message)
                    //刷新
                    this.search(this.departmentId, this.pageNo, this.pageSize);
                } else {
                    this.$message.error(res.message)
                }
            }
        },
        /**
* 打开分配角色
*/
        async assignRole(row) {
            //防止回显出现问题
            this.selectedIds = [];
            this.selectedUserId = "";
            //被分配用户的id
            this.selectedUserId = row.id;
            //显示窗口
            this.assignDialog.visible = true;
            //设置标题
            this.assignDialog.title = `给【${row.realName}】分配角色`;
            //查询当前登录用户的所有角色信息
            await this.getAssignRoleList();
            //获取当前被分配用户的ID
            let params = {
                userId: row.id,
            };
            //发送根据用户ID查询角色列表的请求
            let res = await userApi.getRoleIdByUserId(params);
            //如果存在数据
            if (res.success && res.data) {
                //将查询到的角色ID列表交给选中角色数组
                this.selectedIds = res.data;
                //循环遍历
                this.selectedIds.forEach((key) => {
                    this.assignRoleList.forEach((item) => {
                        if (item.id === key) {
                            this.$refs.assignRoleTable.toggleRowSelection(item, true);
                        }
                    });
                });
            }
        },
        /**
        * 查询当前登录用户的所有角色信息
        */
        async getAssignRoleList(pageNo = 1, pageSize = 10) {
            //给用户ID赋值
            this.roleVo.userId = this.$store.getters.userId;
            this.roleVo.pageNo = pageNo;
            this.roleVo.pageSize = pageSize;
            //发送查询请求
            let res = await userApi.getAssignRoleList(this.roleVo);
            //判断是否成功
            if (res.success) {
                //角色列表赋值
                this.assignRoleList = res.data.records;
                //角色总数量赋值
                this.roleVo.total = res.data.total;
            }
        },
        /**
        * 分配角色取消事件
        */
        onAssignClose() {
            //隐藏窗口
            this.assignDialog.visible = false;
        },
        /**
        * 分配角色确认事件
        */
        onAssignConfirm() {
            //隐藏窗口
            this.assignDialog.visible = false;
        },
        /**
        * 当每页数量发生变化时触发该事件
        */
        assignSizeChange(size) {
            this.roleVo.pageSize = size; //将每页显示的数量交给成员变量
            this.getAssignRoleList(this.roleVo.pageNo, size);
        },
        /*** 当页码发生变化时触发该事件
        */
        assignCurrentChange(page) {
            this.roleVo.pageNo = page;
            //调用查询方法
            this.getAssignRoleList(page, this.roleVo.pageSize);
        },
        /**
        * 当点击多选框时触发该事件
        */
        handleSelectionChange(rows) {
            let roleIds = [];
            //循环遍历选中的角色ID
            for (let i = 0; i < rows.length; i++) {
                //将当前选中的角色ID放到数组中
                roleIds.push(rows[i].id);
            }
            //将选中的角色ID交给成员变量
            this.selectedIds = roleIds;
            // this.selectedIds = rows.map(item => item.id);//等同于上述代码
        },
        /**
* 分配角色确认事件
*/
        async onAssignConfirm() {
            //判断用户是否有选中角色
            if (this.selectedIds.length === 0) {
                this.$message.warning("请选择要分配的角色！");
                return;
            }
            let params = {
                userId: this.selectedUserId,
                roleIds: this.selectedIds,
            };
            //发送请求
            let res = await userApi.assignRoleSave(params);
            //判断是否成功
            if (res.success) {
                this.$message.success(res.message);
                //关闭窗口
                this.assignDialog.visible = false;
            } else {
                this.$message.error(res.message);
            }
        }

    },
    created() {
        //查询部门列表
        this.getDeptList();
        //调用查询用户列表
        this.search(this.departmentId);
        this.searchNo();
        this.searchHo()
    },
    mounted() {
        this.$nextTick(() => {
            //内容高度
            this.containerHeight = window.innerHeight - 85

            //角色表格高度
            this.assignHeight = window.innerHeight - 350;
        })



    }
}
</script>
<style lang="scss">
//用户头像
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar-uploader img {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
