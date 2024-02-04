<template>
    <div id="category">
        <el-button type="danger" @click="addFirst">添加一级分类</el-button>
        <hr class="hr-e9e9e9" />
        <div>
            <el-row :gutter="30">
                <el-col :span="8">
                    <div class="category-wrap">
                        <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
                            <!--一级分类-->
                            <h4>
                                <svg-icon icon-class="minus"></svg-icon>
                                {{ firstItem.category_name }} - {{ firstItem.id }}
                                <div class="button-group">
                                    <el-button size="small" type="danger"
                                        @click="editCategory({ data: firstItem, type: 'category_first_edit' })"
                                        round>编辑</el-button>
                                    <el-button size="small" type="success" round
                                        @click="handlerAddChildren({ data: firstItem, type: 'category_children_add' })">添加子级</el-button>
                                    <el-button size="small" round
                                        @click="deleteCategoryComfirm(firstItem.id)">删除</el-button>
                                </div>
                            </h4>
                            <!--子级分类-->
                            <ul v-if="firstItem.children">
                                <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                                    {{ childrenItem.category_name }}
                                    <div class="button-group">
                                        <el-button size="small" type="danger" round>编辑</el-button>
                                        <el-button size="small" round
                                            @click="deleteCategoryComfirm(firstItem.id)">删除</el-button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <h4 class="menu-title">一级分类编辑</h4>
                    <el-form label-width="142px" class="from-wrap">
                        <el-form-item label="一级分类名称：" v-if="category_first_input">
                            <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
                        </el-form-item>
                        <el-form-item label="二级分类名称：" v-if="category_children_input">
                            <el-input v-model="form.secCategoryName" :disabled="category_children_disabled"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="submit" :loading="submit_loading"
                                :disabled="submit_button_disabled">确定</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted, } from 'vue';
import { AddFirstCategory, GetCategory, DeleteCategory, EditCategory } from '@/api/news';
import { global } from "@/utils/global_V3.0";
import { ElMessage } from 'element-plus';
export default {
    name: 'category',
    setup(props) {
        const { str: aaa, confirm } = global();
        const form = reactive({
            categoryName: '',
            secCategoryName: '',
        });
        const category = reactive({
            item: [],
            current: [],
        });
        const submit_loading = ref(false);
        const categoryFrom = ref();
        const category_children_disabled = ref(true);
        const category_first_disabled = ref(true);
        const submit_button_disabled = ref(true);
        const deleteId = ref('');
        const submit_button_type = ref('');

        // const category = reactive([
        //     {
        //         id: "1",
        //         category_name: "国际信息1",
        //         children: [
        //             {
        //                 id: "3",
        //                 category_name: "国际信息2",
        //             }
        //         ]
        //     },
        //     {
        //         id: "2",
        //         category_name: "国际信息2",
        //         children: [
        //             {
        //                 id: "4",
        //                 category_name: "国际信息2",
        //             }
        //         ]
        //     }
        // ]);
        const category_first_input = ref(true);
        const category_children_input = ref(true);
        /**
         * method v2.0
         */
        const submit = () => {
            if (!form.categoryName) {
                ElMessage({
                    type: 'error',
                    message: "分类名称不能为空",
                })
                return false;
            }
            if (submit_button_type.value == 'category_first_add') { addFirstCategory(); }
            if (submit_button_type.value == 'category_first_edit') { editFirstCategory(); }
            if (submit_button_type.value == 'category_children_add') { addChildrenCategory(); }
        }

        const param = {
            "categoryName": form.categoryName,
        }
        const addFirstCategory = () => {
            if (!form.categoryName) {
                ElMessage({
                    message: "分类名称不能为空",
                    type: "error"
                })
                return false;
            }
            AddFirstCategory(param).then(response => {
                if (response.resCode === 0) {
                    ElMessage({
                        type: 'success',
                        message: response.message,
                    });
                    category.item.push(response.category[0]);
                }
                submit_loading.value = false;
                form.categoryName = ''
                form.secCategoryName = ''
            }).catch(error => {
                submit_loading.value = false;
                form.categoryName = ''
                form.secCategoryName = ''
            })
        }
        const addFirst = () => {
            submit_button_type.value = params.type
            category_first_input.value = true;
            category_children_input.value = false;
            category_first_disabled.value = false;
            submit_button_disabled.value = false;
            // 按alt + 左右方向键，可以返回光标上次，或下次的位置
        }

        const getCategory = () => {
            GetCategory({}).then(response => {
                category.item = response.category;
            }).catch(error => {

            });
        }


        /**
         * 删除一级分类
         */
        const deleteCategoryComfirm = (categoryId) => {
            deleteId.value = categoryId;
            confirm({
                content: "确认删除当前信息，确认后将无法恢复！！",
                tip: "警告",
                fn: deleteCategory,
                catchFn: () => {
                    console.log(777);
                }
            })
        }

        const deleteCategory = () => {
            DeleteCategory({ id: deleteId.value }).then(response => {
                // category.item = category.item.filter(element =>
                //     element.id != deleteId.value
                // );
                let index = category.item.findIndex(element => element.id == deleteId.value);
                category.item.splice(index, 1);
            }).catch(error => {

            })
        }
        // 修改
        const editCategory = (params) => {
            submit_button_type.value = params.type
            category_children_input.value = false
            category_first_disabled.value = false
            submit_button_disabled.value = false
            // 一级名称输入还原名称
            form.categoryName = params.data.category_name
            // 储存当前数据对象
            category.current = params.data
        }
        const editFirstCategory = () => {
            if (category.current.length == 0) {
                ElMessage({
                    message: "未选择分类！！",
                    type: "error"
                })
                return false
            }
            let requestData = {
                id: category.current.id,
                categoryName: form.categoryName
            }
            EditCategory(requestData).then(response => {
                ElMessage({
                    message: response.message,
                    type: "success"
                })
                // category.current.category_name = response.category.category_name;
                // let data = category.item.filter(item => {
                //     return item.id == category.current.id;
                // });
                // data[0].category_name = response.category[0].category_name;
                category.current.category_name = response.category[0].category_name;
                // 清空输入框
                form.categoryName = '';
                category.current = [];
            })
        }
        /**
         * 生命周期
         */
        // 挂载完成时执行，（页面DOM元素完成时，实例完成）
        onMounted(() => {
            getCategory()
        })

        return {
            form,
            submit,
            addFirst,
            category_first_input,
            category_children_input,
            category,
            editCategory,
            submit_loading,
            categoryFrom,
            category_children_disabled,
            category_first_disabled,
            submit_button_disabled,
            deleteCategoryComfirm,
            deleteId,
            submit_button_type,
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";

.menu-title {
    line-height: 44px;
    padding-left: 22px;
    background-color: #f3f3f3;
}

.category-wrap {
    div:first-child {
        &:before {
            top: 20px;
        }
    }

    div:last-child {
        &:before {
            bottom: 21px;
        }
    }
}

.category {
    line-height: 44px;
    position: relative;
    cursor: pointer;

    &:before {
        content: '';
        position: absolute;
        left: 22px;
        top: 0;
        bottom: 0;
        width: 32px;
        border-left: 1px dotted #000;
    }

    h4 {
        position: relative;
        padding-left: 40px;
    }

    svg {
        position: absolute;
        left: 14px;
        top: 15px;
        background-color: #fff;
        font-size: 17px;
    }

    li {
        position: relative;
        padding-left: 36px;
        margin-left: 24px;

        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 22px;
            width: 32px;
            border-bottom: 1px dotted #000;
        }
    }

    li,
    h4 {
        @include webkit(transition, all .5s ease 0s);

        &:hover {
            background-color: #f3f3f3;

            .button-group {
                display: block;
            }
        }
    }
}

.button-group {
    display: none;
    position: absolute;
    z-index: 2;
    right: 11px;
    top: -1px;

    button {
        font-size: 12px;
    }
}

.from-wrap {
    width: 410px;
    padding-top: 26px;
}

.hr-e9e9e9 {
    width: calc(100% + 60px);
    margin-left: -30px;
    border: none;
    margin-top: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid #e9e9e9;
}
</style>