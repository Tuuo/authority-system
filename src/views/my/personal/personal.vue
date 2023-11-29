<template>
    <div class="approval-page">
        <el-row>

            <el-col :span="18">

                <h2>个人信息</h2>
                <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                    <el-tab-pane label="个人信息" name="approval">
                        <div class="content">
                            <!-- <el-descriptions :model="personalFrom" title="用户信息"> -->
                            <el-descriptions class="margin-top" :model="personalFrom" title="用户信息" :column="3" :size="size"
                                border>
                                <template slot="extra">
                                    <el-button type="primary" @click="handleProcess" size="small">编辑</el-button>
                                </template>
                                <el-descriptions-item label="姓名">{{ basicList.name }}</el-descriptions-item>
                                <el-descriptions-item label="身份证号">{{ basicList.cardId }}</el-descriptions-item>
                                <el-descriptions-item label="性别">
                                    {{ basicList.gender }}
                                </el-descriptions-item>
                                <el-descriptions-item label="出生年月">
                                    {{ basicList.birthday }}
                                </el-descriptions-item>
                                <el-descriptions-item label="文化程度">
                                    {{ basicList.education }}
                                </el-descriptions-item>
                                <el-descriptions-item label="籍贯">
                                    {{ basicList.birthplace }}
                                </el-descriptions-item>
                                <el-descriptions-item label="民族">
                                    {{ basicList.nation }}
                                </el-descriptions-item>
                                <el-descriptions-item label="政治面貌">
                                    {{ basicList.politics }}
                                </el-descriptions-item>
                                <el-descriptions-item label="婚姻">
                                    {{ basicList.marriage }}
                                </el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="直系亲人" name="handled">

                        <div class="content">
                            <div>
                                <el-button type="primary" @click="openWindows">新增</el-button>
                            </div>
                            <el-table :data="familyList" style="width: 100%">
                                <el-table-column prop="id" label="编号"></el-table-column>
                                <el-table-column prop="name" label="姓名"></el-table-column>
                                <el-table-column prop="relation" label="关系"></el-table-column>
                                <el-table-column prop="work" label="工作"></el-table-column>
                                <el-table-column prop="nowJob" label="职务"></el-table-column>

                                <el-table-column label="操作" width="200" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="primary" icon="el-icon-edit" size="small"
                                            @click="editFamily(scope.row)">编辑
                                        </el-button>
                                        <el-button type="danger" size="small" icon="el-icon-delete"
                                            @click="deleteFamily(scope.row)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>

            </el-col>
        </el-row>
        <system-dialog :title="approvalDialog.title" :visible="approvalDialog.visible" :width="approvalDialog.width"
            :height="approvalDialog.height" @onClose="onApprovalClose" @onConfirm="onApprovalConfirm">
            <div slot="content">
                <el-form :model="formData" ref="personalFrom" label-width="80px" :inline="false" size="small">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="formData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="formData.gender">
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                        </el-radio-group> </el-form-item>
                    <el-form-item label="身份证号" prop="cardId">
                        <el-input v-model="formData.cardId"></el-input>
                    </el-form-item>
                    <el-form-item label="出生年月" prop="birthday">
                        <el-input v-model="formData.birthday"></el-input>
                    </el-form-item>
                    <el-form-item label="文化程度" prop="education">
                        <el-select v-model="formData.education" placeholder="请选择" class="tasks"
                            @change="onEducationSelectOption">
                            <el-option v-for="item in educationOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="籍贯" prop="birthplace">
                        <el-input v-model="formData.birthplace"></el-input>
                    </el-form-item>
                    <el-form-item label="民族" prop="nation">

                        <el-input v-model="formData.nation"></el-input>

                    </el-form-item>
                    <el-form-item label="政治面貌" prop="politics">
                        <el-select v-model="formData.politics" placeholder="请选择" class="tasks"
                            @change="onPoliticsSelectOption">
                            <el-option v-for="item in politicsOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="婚姻" prop="marriage">
                        <el-select v-model="formData.marriage" placeholder="请选择" class="tasks"
                            @change="onMarriageSelectOption">
                            <el-option v-for="item in marriageOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

        <system-dialog :title="familyDialog.title" :visible="familyDialog.visible" :width="familyDialog.width"
            :height="familyDialog.height" @onClose="onFamilyClose" @onConfirm="onFamilyConfirm">
            <div slot="content">
                <el-form :model="family" ref="familyFrom" label-width="80px" :inline="false" size="small">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="family.name"></el-input>
                    </el-form-item>

                    <el-form-item label="关系" prop="relation">
                        <el-input v-model="family.relation"></el-input>
                    </el-form-item>
                    <el-form-item label="工作" prop="work">
                        <el-input v-model="family.work"></el-input>
                    </el-form-item>
                    <el-form-item label="职务" prop="nowJob">
                        <el-input v-model="family.nowJob"></el-input>

                    </el-form-item>


                </el-form>
            </div>
        </system-dialog>
    </div>
</template>
    
<script>
import basicApi from "@/api/basic"
import SystemDialog from '@/components/system/SystemDialog.vue';
import { mapState } from 'vuex';
import { getId } from '@/api/role'
import familyApi from '@/api/family'
export default {
    name: 'myApproval',
    components: {
        SystemDialog
    },
    data() {

        return {
            approvalsForm: {
                name: '',
                opinion: ''
            },
            basicId: '',
            size: '',
            basicList: {

            },
            basic: [],
            familyFrom: {
                id: '',
                name: '',
                relation: '',
                work: '',
                nowJob: ''
            },
            familyList: [],
            family: {
                id: '',
                name: '',
                relation: '',
                work: '',
                nowJob: ''
            },

            educationSelectedOption: '',
            politicsSelectedOption: '',
            marriageSelectedOption: '',
            personalFrom: {
                id: '',
                name: '',
                cardId: '',
                gender: '',
                birthday: '',
                education: '',//文化程度
                birthplace: '',//籍贯
                nation: '',//民族
                politics: '',//政治面貌
                marriage: '',//婚姻

            },
            approvalDialog: {
                title: '',
                visible: false,
                height: 500,
                width: 430
            },
            familyDialog: {
                title: '',
                visible: false,
                height: 300,
                width: 400
            },
            educationOptions: [{
                value: '1',
                label: '专科'
            }, {
                value: '2',
                label: '本科'
            }, {
                value: '3',
                label: '硕士'
            }, {
                value: '4',
                label: '博士'
            }
            ],
            politicsOptions: [{
                value: '1',
                label: '共青团员'
            }, {
                value: '2',
                label: '中共党员'
            }, {
                value: '3',
                label: '群众'
            }, {
                value: '4',
                label: '无党派人士'
            }
            ],
            marriageOptions: [{
                value: '1',
                label: '未婚'
            }, {
                value: '2',
                label: '已婚'
            }, {
                value: '3',
                label: '丧偶'
            }, {
                value: '4',
                label: '离婚'
            }
            ],
            activeTab: 'approval',

            formData: {
                id: '',
                name: '',
                cardId: '',
                gender: '',
                birthday: '',
                education: '',
                birthplace: '',
                nation: '',
                politics: '',
                marriage: ''
            }


        };
    },
    computed: {
        ...mapState('user', ['name', 'avatar', 'introduction', 'roles', 'userId']),
    },
    methods: {
        async search() {
            //发送查询请求
            let res = await familyApi.getList();
            //判断是否成功
            if (res.success) {
                //赋值
                this.familyList = res.data;
            }
        },


        onEducationSelectOption() {
            // console.log(this.educationOptions);
            const selectedLabel = this.educationOptions.find(option => option.value === this.formData.education)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.educationSelectedOption = selectedLabel;
            }
        },
        onPoliticsSelectOption() {
            const selectedLabel = this.politicsOptions.find(option => option.value === this.formData.politics)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.politicsSelectedOption = selectedLabel;
            }
        },
        onMarriageSelectOption() {
            const selectedLabel = this.marriageOptions.find(option => option.value === this.formData.marriage)?.label;
            console.log("selectedLabel:" + selectedLabel);
            if (selectedLabel) {
                this.marriageSelectedOption = selectedLabel;
            }
        },
        async myhandled() {

            // let obj = await userApi.getUserList();
            let paramssr = {
                roleName: this.name
            }
            let obj = await getId(paramssr)

            this.basicId = obj.data.id - 1;
            // console.log(this.basicId);
            // console.log(obj);

            // 根据登录账号的基本信息获取相关数据
            let param = {
                id: this.basicId
            };
            let res = await basicApi.getList(param);
            console.log(res);
            if (res.success) {
                this.basicList = {
                    id: res.data[this.basicId].id,
                    name: res.data[this.basicId].name,
                    cardId: res.data[this.basicId].cardId,
                    gender: res.data[this.basicId].gender,
                    birthday: res.data[this.basicId].birthday,
                    education: res.data[this.basicId].education,
                    birthplace: res.data[this.basicId].birthplace,
                    nation: res.data[this.basicId].nation,
                    politics: res.data[this.basicId].politics,
                    marriage: res.data[this.basicId].marriage
                };

            }
            // console.log(this.basicList);
        },

        handleProcess() {
            this.formData = { ...this.basicList };
            console.log(this.formData);
            this.approvalDialog.title = '编辑个人信息'; // 设置窗口标题
            this.approvalDialog.visible = true; // 显示窗口
        },
        onApprovalClose() {
            this.approvalDialog.visible = false
        },
        onApprovalConfirm() {
            //表单验证
            this.$refs.personalFrom.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    const params = { ...this.formData };
                    params.education=this.educationSelectedOption;
                    params.politics=this.politicsSelectedOption
                    params.marriage-this.marriageSelectedOption

                    console.log(params);

                    //发送修改请求
                    res = await basicApi.updateBasic(params)

                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message);
                        this.myhandled();

                        //关闭窗口
                        this.approvalDialog.visible = false;

                    } else {
                        //提示失败
                        this.$message.error(res.message);
                    }

                }
            });

        },
        openWindows() {
            // this.formData = { ...this.basicList };
            // console.log(this.formData);
            this.familyDialog.title = '新增亲属信息'; // 设置窗口标题
            this.familyDialog.visible = true; // 显示窗口
        },
        onFamilyClose() {
            this.familyDialog.visible = false
        },
        onFamilyConfirm() {
            //表单验证
            this.$refs.familyFrom.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    //判断当前是新增操作还是修改操作
                    if (this.family.id === "") {
                        //发送添加请求
                        res = await familyApi.addFamily(this.family);

                    } else {
                        //发送修改请求
                        res = await familyApi.updateFamily(this.family)
                    }
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message);
                        //刷新数据表格
                        // this.search();
                        window.location.reload()
                        //关闭窗口
                        this.familyDialog.visible = false;

                    } else {
                        //提示失败
                        this.$message.error(res.message);
                    }

                }
            });
        },
        handleTabClick(tab) {
            // 处理标签切换逻辑
        },
        editFamily(row) {
            //把当前要编辑的数据复制到数据域，给表单回显
            console.log(row);
            this.$objCopy(row, this.family)
            //设置弹框属性
            this.familyDialog.title = "编辑菜单"
            this.familyDialog.visible = true
        },
        async deleteFamily(row) {

            //确认是否删除
            let confirm = await this.$myconfirm("确认要删除该数据吗？")
            if (confirm) {
                //发送删除请求
                let res = await familyApi.deleteById({ id: row.id })
                //判断是否成功
                if (res.success) {
                    //成功提示
                    this.$message.success(res.message)
                    //刷新
                    this.search()

                } else {
                    //失败提示
                    this.$message.error(res.message)
                }
            }
        }

    },
    mounted() {

        this.search()

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