<template>
    <el-main>
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
                        <el-input v-model="menu.icon"></el-input>
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
//导入自定义的icon图标库
import { elementIcons } from "@/utils/icons";
export default {
    name: "menuList",
    components: {
        SystemDialog
    },

    data() {
        return {
            iconList: [],//图标列表
            userChooseIcon: "",//用户选中的图标
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
            this.$refs.menuForm.validate((valid) => {
                if (valid) {
                }
            });
        },
        /**
        * 选择所属菜单
        */
        selectParentMenu() {
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
            this.menuDialog.title = '新增菜单' //设置窗口标题
            this.menuDialog.visible = true //显示窗口
            this.userChooseIcon = "";//清空菜单图标
        },
        /**
        * 获取图标列表
        */
        getIconList() {
            this.iconList = elementIcons;
        },
        //给icon绑定的点击事件
        setIcon(icon) {
            this.userChooseIcon = icon; //将i的样式设为选中的样式el-icon-xxx
            this.menu.icon = icon;
        },


    },
    //初始化时调用
    created() {
        //调用查询菜单列表的方法
        this.search()
        //调用获取图标列表
        this.getIconList();
    },

};

</script>
<style lang="scss" scoped>
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


    