import service from "@/utils/request";
/**
 * 列表
 */

/**
 * 新增
 */

/**
 * 编辑
 */
export function EditCategory(data) {
    return service.request({
        method: "post",
        url: "/new/editCategory",
        data
    })
}

/**
 * 删除 一级分类
 */
export function DeleteCategory(data) {
    return service.request({
        method: 'post',
        url: "/new/deleteCategory",
        data
    })
}

/**
 * 一级分类添加
 */
export function AddFirstCategory(data) {
    return service.request({
        method: 'post',
        url: "/new/addFirstCategory/",
        data
    })
}

/**
 * 获取分类
 */
export function GetCategory(data) {
    return service.request({
        method: 'post',
        url: "/new/getCategory",
        data
    })
}