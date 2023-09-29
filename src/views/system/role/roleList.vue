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
    </el-main>
</template>
<script>

//导入menu.js脚本代码
import menuApi from '@/api/menu';
export default {
    name: 'menuList',
    data() {
        return {
            menuList: [], //菜单列表
            tableHeight: 0 //表格高度
        }
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
        },
        /**
        * 编辑菜单
        * @param row
        */
        editMenu(row) {
        },
        /**
        * 删除菜单
        * @param row
        */
        deleteMenu(row) {
        },
    },
    //初始化时调用
    created() {
        //调用查询菜单列表的方法
        this.search();
    },
    mounted() {
        this.$nextTick(() => {
            this.tableHeight = window.innerHeight - 180
        })
    }
}
</script>
<style>
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
</style>
    