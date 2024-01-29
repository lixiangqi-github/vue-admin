<template>
    <!--新增弹窗-->
    <el-dialog v-model="dialog_info_flag" title="新增" @close="close1" width="580px">
        <el-form :model="form">
            <el-form-item label="类别：" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题：" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="概况：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
        <div class="dialog-footer">
            <slot name="footer">
                <el-button @click="close1">取消</el-button>
                <el-button type="danger" @click="close1">确定</el-button>
            </slot>
        </div>
    </el-dialog>
</template>
<script>
import { reactive, ref, watch } from 'vue';
export default {
    name: 'dialogInfo',
    props: {
        flag: {
            type: Boolean,
            default: false
        },
        category: {
            type: Array,
            default: () => []
        }
    },
    setup(props, content) {
        /**
         * 数据
         */
        const dialog_info_flag = ref(false);
        const formLabelWidth = ref('70px');
        const form = reactive({
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: '',
        })
        // watch
        // watch(() => {
        //     dialog_info_flag.value = props.flag
        // });
        watch(() => props.flag, (newData, oldData) => {
            dialog_info_flag.value = newData;
        })
        /**
         * vue2.0 methods
         */
        const close1 = () => {
            dialog_info_flag.value = false;
            content.emit("update:flag", false);
            // content.emit("close", false);
        }
        return {
            // ref
            dialog_info_flag,
            formLabelWidth,
            // reactive
            form,
            // method
            close1,
        }
    }
}
</script>
<style lang="scss" scoped></style>