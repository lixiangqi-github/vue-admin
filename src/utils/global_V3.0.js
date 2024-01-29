import { ElMessageBox } from 'element-plus';
import { ref } from '@vue/composition-api';

export function global() {
    const str = ref('');
    const confirm = (params) => {
        ElMessageBox.confirm(params.content, params.tip || "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: params.type || "warning",
            center: true
        }).then(() => {
            str.value = params.id || '';
            params.fn && params.fn(params.id || '')
        }).catch(() => {
            params.catchFn && params.catchFn()
        });
    }

    return {
        str,
        confirm
    }
}