<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.roleName" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="openAddWindow()">新增</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="roleList" :height="tableHeight" border stripe style="width: 100%; margin-bottom: 10px">
            <el-table-column prop="id" label="角色编号" width="100" align="center"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="remark" label="角色备注"></el-table-column>
            <el-table-column label="操作" align="center" width="290">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit" type="primary" size="small" @click="handleEdit(scope.row)">编辑
                    </el-button>
                    <el-button icon="el-icon-delete" type="danger" size="small" @click="handleDelete(scope.row)">删除
                    </el-button>
                    <el-button icon="el-icon-setting" type="primary" size="small" @click="assignRole(scope.row)">分配权限
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页工具栏 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 添加和修改窗口 -->
        <system-dialog :title="roleDialog.title" :visible="roleDialog.visible" :width="roleDialog.width"
            :height="roleDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="role" ref="roleForm" :rules="rules" label-width="80px" :inline="false" size="small">
                    <el-form-item label="角色编码" prop="roleCode">
                        <el-input v-model="role.roleCode"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="role.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input type="textarea" v-model="role.remark" :rows="5"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>
        <!-- 分配权限树窗口 -->
        <system-dialog :title="assignDialog.title" :visible="assignDialog.visible" :width="assignDialog.width"
            :height="assignDialog.height" @onClose="onAssignClose" @onConfirm="onAssignConfirm">
            <div slot="content">
                <el-tree ref="assignTree" :data="assignTreeData" node-key="id" :props="defaultProps" empty-text="暂无数据"
                    :show-checkbox="true" :highlight-current="true" default-expand-all></el-tree>
            </div>
        </system-dialog>
    </el-main>
</template>
<script>
//导入role.js的方法
import { getRoles, addRole, updateRole, checkRole, deleteRole, getAssignTree, assignSave } from '@/api/role'
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
//导入末级节点的脚本
import leafUtils from '@/utils/leaf'


export default {
    name: 'roleList',
    components: {
        SystemDialog
    },
    data() {

        return {
            //查询条件
            searchModel: {
                roleName: '',//角色名称
                pageNo: 1,
                pageSize: 10,
                userId: this.$store.getters.userId//当前登录用户id
            },
            roleList: [], //数据列表
            tableHeight: 0, //表格高度
            pageNo: 1, //当前页码
            pageSize: 10, //每页显示数量
            total: 0, //总数量

            rules: {
                roleCode: [{ required: true, trigger: 'blur', message: '请输入角色编码' }],
                roleName: [{ required: true, trigger: 'blur', message: '请输入角色名称' }]
            },
            //添加和修改角色窗口属性
            roleDialog: {
                title: '',
                visible: false,
                height: 230,
                width: 500
            },
            //角色对象
            role: {
                id: "",
                roleCode: "",
                roleName: "",
                remark: "",
                createUser: this.$store.getters.userId
            },
            //分配权限窗口属性
            assignDialog: {
                title: '',
                visible: false,
                height: 450,
                width: 300
            },
            roleId: '', //角色ID
            assignTreeData: [], //树节点数据
            //树节点属性
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    methods: {
        /**
        * 打开添加窗口
        */
        openAddWindow() {
            // 保存createUser字段的值
            const createUser = this.role.createUser;

            // 清空表单数据
            this.$resetForm("roleForm", this.role);

            // 将createUser字段重新赋值
            this.role.createUser = createUser;

            this.roleDialog.title = '新增角色'; // 设置窗口标题
            this.roleDialog.visible = true; // 显示窗口
        },
        /**
        * 窗口取消事件
        */
        onClose() {
            this.roleDialog.visible = false
        },
        /**
        * 窗口确认事件
        */
        onConfirm() {
            //表单验证
            this.$refs.roleForm.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    //判断角色ID是否为空
                    if (this.role.id === "") {
                        //新增
                        //发送添加请求
                        res = await addRole(this.role);
                    } else {
                        //发送修改请求
                        res = await updateRole(this.role)
                    }
                    //判断是否成功
                    if (res.success) {
                        this.$message.success(res.message);
                        //刷新
                        this.search(this.pageNo, this.pageSize);
                        //关闭窗口
                        this.roleDialog.visible = false;
                    } else {
                        this.$message.error(res.message);
                    }
                }

            });
        },
        /**
        * 查询
        */
        async search(pageNo = 1, pageSize = 10) {
            //修改当前页码
            this.searchModel.pageNo = pageNo;
            //修改每页显示数量
            this.searchModel.pageSize = pageSize;
            //发生查询请求
            let res = await getRoles(this.searchModel)
            //判断是否成功
            if (res.success) {
                //赋值
                this.roleList = res.data.records
                this.total = res.data.total

            }
        },
        /**
        * 重置查询条件
        */
        resetValue() {
            //清空数据
            this.searchModel.roleName = "";
            //重新查询
            this.search();
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
        * 打开编辑窗口
        */
        handleEdit(row) {
            //数据回显
            this.$objCopy(row, this.role);//将当前编辑的数据复制到role对象中
            //设置窗口标题
            this.roleDialog.title = "编辑角色"
            //显示编辑角色窗口
            this.roleDialog.visible = true
        },
        /**
         * 删除角色
         * 
         */
        async handleDelete(row) {
            //查询该角色是否被删除
            let result = await checkRole({ id: row.id })
            //判断是否可以删除
            if (!result.success) {
                //提示不能删除
                this.$message.warning(result.message)
            } else {
                //确定是否删除
                let confirm = await this.$myconfirm("确定要删除该数据吗？")
                if (confirm) {
                    //发送删除请求
                    let res = await deleteRole({ id: row.id })
                    //判断是否成功
                    if (res.success) {
                        //成功提示
                        this.$message.success(res.message)
                        //刷新
                        this.search(this.pageNo, this.pageSize)
                    } else {
                        this.$message.error(res.message)
                    }
                }
            }

        },
        /**
         * 分配权限
         *
         */
        async assignRole(row) {
            this.roleId = row.id
            // console.log(row);

            //构建查询参数
            let params = {
                roleId: row.id,
                userId: this.$store.getters.userId //用户id
            }
            //发送查询分配权限菜单请求
            let res = await getAssignTree(params)
            //判断是否成功
            // console.log(params);
            // console.log(params.roleId)
            if (res.success) {

                //获取当前登录用户所拥有的所有菜单权限
                let permissionList = res.data.permissionList
                //获取当前被分配角色的已经拥有的菜单权限
                let checkList = res.data.checkList
                console.log(checkList);
                //判断当前菜单是否是最后一级
                let setLeaf = leafUtils().setLeaf
                //设置权限菜单
                let newList = setLeaf(permissionList)
                //设置树节点菜单数据
                this.assignTreeData = newList
                //将回调延迟到下一次Dom更新循环之后执行，在修改数据之后立即调用该方法，然后等Dom更新
                this.$nextTick(() => {
                    //获取菜单节点数据
                    let nodes = this.$refs.assignTree.children
                    this.setChild(nodes, checkList)
                })
            }


            //设置窗口标题
            this.assignDialog.title = `给【${row.roleName}】分配权限`
            //显示窗口
            this.assignDialog.visible = true;
        },
        /**
         * 设置子节点
         * @param  nodes 
         * @param  checkList 
         */
        setChild(childNodes, checkList) {
            //判断是否存在子节点
            if (childNodes && childNodes.length > 0) {
                //循环所有权限
                for (let i = 0; i < childNodes.length; i++) {
                    //根据data或key获取树组件中的node节点
                    let node = this.$refs.assignTree.getNode(childNodes[i])
                    //判断是否拥有对应的权限数据
                    if (checkList && checkList.length > 0) {
                        //循环遍历已有的权限集合
                        for (let j = 0; j < checkList.length; j++) {
                            //判断权限id是否相等
                            if (checkList[j] == childNodes[i].id) {
                                //判断节点状态，如果当前节点是展开的，则将树节点选中
                                if (childNodes[i].open) {
                                    this.$refs.assignTree.setChecked(node, true)
                                    break
                                }
                            }
                        }
                    }
                    //判断如果存在子节点则递归选中
                    if (childNodes[i].children) {
                        this.setChild(childNodes[i].children, checkList)
                    }
                }
            }

        },
        
        /**
        * 分配权限窗口取消事件
        */
        onAssignClose() {
            this.assignDialog.visible = false
        },
        /**
        * 分配权限窗口确认事件
        */
        async onAssignConfirm() {
            //获取选中的节点key
            let ids = this.$refs.assignTree.getCheckedKeys()
            //获取选中节点的父节点id
            let pids = this.$refs.assignTree.getHalfCheckedKeys()
            //组装选中的节点ID数据
            let listId = ids.concat(pids)
            //组装参数
            let params = {
                roleId: this.roleId,
                list: listId
            }
            //发送请求
            let res = await assignSave(params)
            //判断是否成功
            if (res.success) {
                //关闭窗口
                this.assignDialog.visible = false
                //提示成功
                this.$message.success(res.message)
            } else {
                //提示失败
                this.$message.error(res.data)
            }
        },

    },
    //初始化时调用
    created() {
        this.search();
    },
    //挂载后调用
    mounted() {
        this.$nextTick(() => {
            this.tableHeight = window.innerHeight - 220
        })
    }
}
</script>
