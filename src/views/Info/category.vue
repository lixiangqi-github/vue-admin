<template>
    <div id="category">
        <el-button type="danger" @click="addFirst">添加一级分类</el-button>
        <hr class="hr-e9e9e9" />
        <div>
            <el-row :gutter="30">
                <el-col :span="8">
                    <div class="category-wrap">
                        <div class="category" v-for="firstItem in category" :key="firstItem.id">
                            <!--一级分类-->
                            <h4>
                                <svg-icon icon-class="minus"></svg-icon>
                                新闻
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
                            <ul>
                                <li>
                                    国内
                                    <div class="button-group">
                                        <el-button size="small" type="danger" round>编辑</el-button>
                                        <el-button size="small" round>删除</el-button>
                                    </div>
                                </li>
                                <li>国内</li>
                                <li>国内</li>
                                <li>国内</li>
                                <li>国内</li>
                                <li>国内</li>
                            </ul>
                        </div>
                        <div class="category">
                            <h4>
                                <svg-icon icon-class="minus"></svg-icon>
                                新闻
                            </h4>
                            <ul>
                                <li>国内</li>
                                <li>国内</li>
                                <li>国内</li>
                                <li>国内</li>
                                <li>国内</li>
                                <li>国内</li>
                            </ul>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <h4 class="menu-title">一级分类编辑</h4>
                    <el-form label-width="142px" class="from-wrap">
                        <el-form-item label="一级分类名称：" v-if="category_first_input">
                            <el-input v-model="form.categoryName"></el-input>
                        </el-form-item>
                        <el-form-item label="二级分类名称：" v-if="category_children_input">
                            <el-input v-model="form.secCategoryName"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="submit">确定</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { AddFirstCategory } from '@/api/news';
import { ElMessage } from 'element-plus';
export default {
    name: 'category',
    setup(props) {
        const form = reactive({
            categoryName: '',
            secCategoryName: '',
        });

        const category = reactive([
            {
                id: "1",
                category_name: "国际信息",
                children: {
                    id: "3",
                    category_name: "国际信息",
                }
            },
            {
                id: "2",
                category_name: "国际信息",
                children: {
                    id: "4",
                    category_name: "国际信息",
                }
            }
        ])
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
            const param = {
                "categoryName": form.categoryName,
            }
            AddFirstCategory(param).then(response => {
                console.log(response);
                if (response.resCode === 0) {
                    ElMessage({
                        type: 'success',
                        message: response.message,
                    })
                }
            }).catch(error => {

            });
        }
        const addFirst = () => {
            category_first_input.value = true;
            category_children_input.value = false;
        }
        return {
            form,
            submit,
            addFirst,
            category_first_input,
            category_children_input,
            category,
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