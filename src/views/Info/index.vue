<template>
    <div>
        <el-row :gutter="14">
            <el-col :span="4">
                <div class="label-wrap category">
                    <label for="">类型：</label>
                    <div class="wrap-content">
                        <el-select v-model="category_value" placeholder="请选择" style="width: 100%;">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                                :disabled="item.disabled" />
                        </el-select>
                    </div>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="label-wrap date">
                    <label for="">日期：&nbsp;&nbsp;</label>
                    <div class="wrap-content">
                        <el-date-picker style="width: 100%;" v-model="date_value" type="datetimerange"
                            start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD HH:mm:ss" align="right"
                            date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss" />
                    </div>
                </div>
            </el-col>
            <el-col :span="3">
                <div class="label-wrap key-work">
                    <label for="">关键字：&nbsp;&nbsp;</label>
                    <div class="wrap-content">
                        <el-select v-model="search_key">
                            <el-option v-for="item in search_option" :key="item.value" :value="item.value"
                                :label="item.label">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </el-col>
            <el-col :span="3">
                <el-input v-model="search_keyWork" placeholder="请输入内容：" style="width: 100%;" />
            </el-col>
            <el-col :span="2">
                <el-button type="danger" style="width: 100%;">搜索</el-button>
            </el-col>
            <el-col :span="3">&nbsp;</el-col>
            <el-col :span="2">
                <el-button type="danger" class="pull-right" @click="open()" style="width: 100%;">新增</el-button>
            </el-col>
        </el-row>

        <!-- 表格数据 -->
        <div class="black-space-30"></div>
        <el-table :data="table_data" style="width: 100%" border>
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="title" label="标题" width="750"></el-table-column>
            <el-table-column prop="categoryId" label="类型" width="130"></el-table-column>
            <el-table-column prop="createDate" label="日期" width="237"></el-table-column>
            <el-table-column prop="user" label="管理员" width="115"></el-table-column>
            <el-table-column label="操作">
                <template #default>
                    <el-button type="danger" size="default" @click="deleteItem()" class="hiden-button">删除</el-button>
                    <el-button type="success" size="default" @click="open()" class="hiden-button">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="black-space-30"></div>
        <!--底部分页-->
        <el-row>
            <el-col :span="12">
                <el-button size="default" @click="deleteAll">批量删除</el-button>
            </el-col>
            <el-col :span="12">
                <el-pagination class="pull-right" background @size-change="handleSizeChange" :current-page="4"
                    @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper" :total=1000>
                </el-pagination>
            </el-col>
        </el-row>
        <!--新增弹窗-->
        <!-- <DialogInfo v-model:flag="dialog_info" @close="closeDialog" /> -->
        <DialogInfo v-model:flag="dialog_info" />
    </div>
</template>

<script>
import { reactive, ref } from 'vue';
import DialogInfo from "./dialog/info.vue";
import { global } from "@/utils/global_V3.0";
import { ElMessage } from 'element-plus';
export default {
    name: 'infoIndex',
    components: { DialogInfo },
    setup(props) {
        const dialog_info = ref(false);   // 弹出窗口
        const search_key = ref('id');       // 关键字
        const category_value = ref(''); // 类型
        const date_value = ref(''); // 日期
        const search_keyWork = ref('');     // 请输入内容
        const { str: aaa, confirm } = global();
        const deleteInfoId = ref('');

        // 类型用
        const options = reactive(
            [
                {
                    value: '1',
                    label: '国际信息',
                },
                {
                    value: '2',
                    label: '国内信息',
                },
                {
                    value: '3',
                    label: '行业信息',
                }
            ]
        );

        //表格数据
        const table_data = reactive(
            [
                {
                    title: '2016-05-03',
                    categoryId: 'Tom',
                    createDate: 'No. 189, Grove St, Los Angeles',
                    user: '管理员',
                },
            ]
        );

        // 关键字
        const search_option = reactive([
            { value: "id", label: "ID" },
            { value: "title", label: "标题" }
        ]);

        /**
         * vue2.0 methods
         */
        const handleSizeChange = (val) => {     // 分页
            page.pageSize = val
        }
        const handleCurrentChange = (val) => {  // 分页
            page.pageNumber = val
            // getList()
        }
        // const closeDialog = () => {
        //     dialog_info.value = false;
        // }
        const open = () => {
            dialog_info.value = true;
        }
        /**
         * 删除数据
         */
        const deleteItem = (id) => {
            deleteInfoId.value = [id];
            confirm({
                content: "确认删除当前信息，确认后将无法恢复！！",
                tip: "警告",
                fn: confirmDelete
            })
        }

        const confirmDelete = (value) => {
            DeleteInfo({ id: deleteInfoId.value }).then(response => {
                deleteInfoId.value = '';
                getList()
            })
        }

        const deleteAll = () => {
            if (!deleteInfoId.value || deleteInfoId.value.length == 0) {
                ElMessage({
                    message: "请选择要删除的数据！！",
                    type: "error"
                })
                return false;
            }
            confirm({
                content: "确认删除选择的数据，确认后将无法恢复！",
                tip: "警告",
                fn: confirmDelete
            })
        }
        return {
            // ref
            date_value,
            search_key,
            search_keyWork,
            category_value,
            dialog_info,
            // reactive
            table_data,
            options,
            search_option,
            // vue2.0 methods
            handleSizeChange,
            handleCurrentChange,
            // closeDialog,
            open,
            deleteItem,
            deleteAll,
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";

.label-wrap {
    &.category {
        @include labelDom(left, 60, 32)
    }

    &.date {
        @include labelDom(right, 93, 32)
    }

    &.key-work {
        @include labelDom(right, 99, 40);
    }

    // label {
    //     float: left;
    //     line-height: 32px;
    //     width: 60px;
    // }

    // .wrap-content {
    //     margin-left: 60px;
    // }
}
</style>