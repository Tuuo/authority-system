<template>
    <el-main>
        <!-- 新增按钮 -->
        <el-button type="success" icon="el-icon-plus" @click="openAddWindow">新增</el-button>
        <!-- 数据表格 -->
        <el-table style="margin-top: 10px" :height="tableHeight" :data="menuList" row-key="id" default-expand-all
            :tree-props="{ children: 'children' }" :border="true" stripe>
            <el-table-column prop="label" label="菜单名称"></el-table-column>
            <el-table-column prop="type" label="菜单类型" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type == '0'" size="normal">目录</el-tag>
                    <el-tag type="success" v-else-if="scope.row.type == '1'" size="normal">
                        菜单</el-tag>
                    <el-tag type="warning" v-else-if="scope.row.type == '2'" size="normal">
                        按钮</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="icon" label="图标" align="center">
                <template slot-scope="scope">
                    <i :class="scope.row.icon" v-if="scope.row.icon.includes('el-icon')">
                    </i>
                    <svg-icon v-else :icon-class="scope.row.icon"></svg-icon>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="路由名称"></el-table-column>
            <el-table-column prop="path" label="路由地址"></el-table-column>
            <el-table-column prop="url" label="组件路径"></el-table-column>
            <el-table-column align="center">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="editMenu(scope.row)">编辑
                    </el-button>
                    <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteMenu(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增或编辑弹框 -->
        <system-dialog :title="menuDialog.title" :width="menuDialog.width" :height="menuDialog.height"
            :visible="menuDialog.visible" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="menu" ref="menuForm" :rules="rules" label-width="80px" :inline="true" size="small">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item prop="type" label="菜单类型">
                                <el-radio-group v-model="menu.type">
                                    <el-radio :label="0">目录</el-radio>
                                    <el-radio :label="1">菜单</el-radio>
                                    <el-radio :label="2">按钮</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item prop="parentName" size="small" label="所属菜单">
                        <el-input @click.native="selectParentMenu" v-model="menu.parentName" :readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item prop="label" size="small" label="菜单名称">
                        <el-input v-model="menu.label"></el-input>
                    </el-form-item>
                    <el-form-item size="small" label="菜单图标">
                        <my-icon @selecticon="setIcon" ref="child"></my-icon>
                        <!-- <div class="chooseIcons">
                            <el-popover placement="bottom" width="450" trigger="click">
                                <span slot="reference"
                                    style="display: inline-block;width: 200px;height: 33px;line-height: 33px;">
                                    <i :class="userChooseIcon"></i>
                                    {{ userChooseIcon }}
                                </span>
                                <div class="iconList">
                                    <i v-for="item in iconList" :key="item" :class="item" @click="setIcon(item)"
                                        style="font-size: 20px"></i>
                                </div>
                            </el-popover>
                        </div> -->

                    </el-form-item>
                    <el-form-item prop="name" v-if="menu.type == 1" size="small" label="路由名称">
                        <el-input v-model="menu.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="path" v-if="menu.type != 2" size="small" label="路由地址">
                        <el-input v-model="menu.path"></el-input>
                    </el-form-item>
                    <el-form-item prop="url" v-if="menu.type == 1" size="small" label="组件路径">
                        <el-input v-model="menu.url"></el-input>
                    </el-form-item>
                    <el-form-item prop="code" size="small" label="权限字段">
                        <el-input v-model="menu.code"></el-input>
                    </el-form-item>
                    <el-form-item size="small" label="菜单序号">
                        <el-input v-model="menu.orderNum"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>
        <!-- 选择所属菜单弹框 -->
        <system-dialog :title="parentDialog.title" :width="parentDialog.width" :height="parentDialog.height"
            :visible="parentDialog.visible" @onClose="onParentClose" @onConfirm="onParentConfirm">
            <div slot="content">
                <el-tree style="font-size: 14px" ref="parentTree" :data="parentMenuList" node-key="id" :props="defaultProps"
                    empty-text="暂无数据" :show-checkbox="false" default-expand-all :highlight-current="true"
                    :expand-on-click-node="false" @node-click="handleNodeClick">
                    <div class="customer-tree-node" slot-scope="{ node, data }">
                        <!-- 长度为0说明没有下级 -->
                        <span v-if="data.children.length == 0">
                            <i class="el-icon-document" style="color: #8c8c8c; font-size: 18px" />
                        </span>
                        <span v-else @click.stop="openBtn(data)">
                            <svg-icon v-if="data.open" icon-class="add-s" />
                            <svg-icon v-else icon-class="sub-s" />
                        </span>
                        <span style="margin-left: 3px">{{ node.label }}</span>
                    </div>
                </el-tree>
            </div>
        </system-dialog>

    </el-main>
</template>
<script>
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';

import MyIcon from '@/components/system/MyIcon.vue';
//导入menu.js脚本代码
import menuApi from '@/api/menu';

export default {
    name: "menuList",
    components: {
        SystemDialog,
        MyIcon
    },

    data() {
        return {
            menuList: [], //菜单列表
            tableHeight: 0,//表格高度
            //新增或编辑弹框属性
            menuDialog: {
                title: "",
                width: 630,
                height: 270,
                visible: false,
            },
            //菜单属性
            menu: {
                id: "",
                type: "",
                parentId: "",
                parentName: "",
                label: "",
                icon: "",
                name: "",
                path: "",
                url: "",
                code: "",
                orderNum: "",
            },
            rules: {
                type: [{ required: true, trigger: "change", message: "请选择菜单类型" }],
                parentName: [{
                    required: true, trigger: "change", message: "请选择所属菜单"
                }],
                label: [{ required: true, trigger: "blur", message: "请输入菜单名称" }],
                name: [{ required: true, trigger: "blur", message: "请输入路由名称" }],
                path: [{ required: true, trigger: "blur", message: "请输入路由路径" }],
                url: [{ required: true, trigger: "blur", message: "请输入组件路径" }],
                code: [{ required: true, trigger: "blur", message: "请输入权限字段" }],
            },
            //上级菜单弹出框
            parentDialog: {
                title: '选择所属菜单',
                width: 280,
                height: 450,
                visible: false
            },
            //树属性定义
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            parentMenuList: [] //所属菜单列表

        };
    },
    methods: {
        /**
         * 查询菜单列表
        */
        async search() {
            //发送查询请求
            let res = await menuApi.getMenuList();
            //判断是否成功
            if (res.success) {
                //赋值
                this.menuList = res.data;
            }
        },

        /**
        * 打开添加窗口
        */
        openAddWindow() {
            this.$resetForm("menuForm", this.menu); //清空表单数据
            this.menuDialog.title = "新增菜单"; //设置窗口标题
            this.menuDialog.visible = true; //显示窗口
        },
        /**
        * 添加和修改菜单窗口关闭事件
        */
        onClose() {
            this.menuDialog.visible = false; //关闭窗口
        },
        /**
        * 添加和修改菜单窗口确认事件
        */
        onConfirm() {
            //表单验证
            this.$refs.menuForm.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    //判断当前是新增操作还是修改操作
                    if (this.menu.id === "") {
                        //发送添加请求
                        res = await menuApi.addMenu(this.menu);

                    } else {
                        //发送修改请求
                        res = await menuApi.updateMenu(this.menu)
                    }
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message);
                        //刷新数据表格
                        // this.search();
                        window.location.reload()
                        //关闭窗口
                        this.menuDialog.visible = false;

                    } else {
                        //提示失败
                        this.$message.error(res.message);
                    }

                }
            });
        },
        
        /**
         * 选择所属菜单
        */
        async selectParentMenu() {
            //显示窗口
            this.parentDialog.visible = true;
            //发送查询请求
            let res = await menuApi.getParentMenuList();
            //判断是否成功
            if (res.success) {
                //赋值
                this.parentMenuList = res.data;
            }
        },
        /**
        * 选择所属菜单取消事件
        */
        onParentClose() {
            this.parentDialog.visible = false //关闭窗口
        },
        /**
        * 选择所属菜单确认事件
        */
        onParentConfirm() {
            this.parentDialog.visible = false //关闭窗口
        },
        /**
        * 切换图标
        * @param data
        */
        openBtn(data) {
            data.open = !data.open
            this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
        },
        /**
        * 所属菜单节点点击事件
        */
        handleNodeClick(data) {
            //所属父级菜单ID
            this.menu.parentId = data.id;
            //所属父级菜单名称
            this.menu.parentName = data.label;
        },
        /**
        * 打开添加窗口
        */
        openAddWindow() {
            this.$resetForm('menuForm', this.menu) //清空表单数据
            //清空图标选择器
            this.$nextTick(() => {
                this.$refs.child.userChooseIcon = "";
            })
            this.menuDialog.title = '新增菜单' //设置窗口标题
            this.menuDialog.visible = true //显示窗口
        },
      
        //给icon绑定的点击事件
        setIcon(icon) {
            this.menu.icon = icon;
        },
        /**
         * 编辑菜单
         */
        editMenu(row) {
            //把当前要编辑的数据复制到数据域，给表单回显
            console.log(row);
            this.$objCopy(row, this.menu)
            //设置弹框属性
            this.menuDialog.title = "编辑菜单"
            this.menuDialog.visible = true
            this.$nextTick(() => {
                //菜单图标回显
                this.$refs["child"].userChooseIcon = row.icon
            })
        },
        /**
         * 删除菜单
         */
        async deleteMenu(row){
            //判断是否存在子菜单
            let result = await menuApi.checkPermission({id :  row.id})
            //判断是否可以删除
            if(!result.success){
                //提示不能删除
                this.$message.warning(result.message)
            }else{
                //确认是否删除
                let confirm = await this.$myconfirm("确认要删除该数据吗？")
                if(confirm){
                    //发送删除请求
                    let res = await menuApi.deleteById({id : row.id})
                    //判断是否成功
                    if(res.success){
                        //成功提示
                        this.$message.success(res.message)
                        //刷新
                        this.search()
                    
                    }else{
                        //失败提示
                        this.$message.error(res.message)
                    }
                }
            }
        }


    },
    //初始化时调用
    created() {
        //调用查询菜单列表的方法
        this.search()

    },
    mounted() {
        this.$nextTick(() => {
            this.tableHeight = window.innerHeight - 180

        })
    }
}

</script>
<style lang="scss" scoped>
::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: #F5F5F5;
}

::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
    border-radius: 8px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    background-color: #c8c8c8;
}

.iconList {
    width: 400px;
    height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    i {
        display: inline-block;
        width: 60px;
        height: 45px;
        color: #000000;
        font-size: 20px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        line-height: 45px;
        margin: 5px;

        &:hover {
            color: orange;
            border-color: orange;
        }
    }
}

.chooseIcons {
    width: 175px;
    background-color: #FFFFFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 33px;
    line-height: 25px;
    outline: none;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>


    