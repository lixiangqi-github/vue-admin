<template>
    <div id="login">
        <div class="login-wrap">
            <ul class="menu-tab">
                <li v-for="(item) in menuTab" :key="item.id" :class="{ 'current': item.current }" @click="toggleMenu(item)">
                    {{
                        item.txt }}</li>
            </ul>
            <!-- 表单 -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="login-form" size="large">

                <el-form-item prop="username" class="item-from">
                    <label>邮箱</label>
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item prop="password" class="item-from">
                    <label>密码</label>
                    <el-input type="text" v-model="ruleForm.password" autocomplete="off" minlength="6"
                        maxlength="20"></el-input>
                </el-form-item>

                <el-form-item prop="repassword" class="item-from" v-show="modelValue === 'register'">
                    <label>重复密码</label>
                    <el-input type="text" v-model="ruleForm.repassword" autocomplete="off" minlength="6"
                        maxlength="20"></el-input>
                </el-form-item>

                <el-form-item prop="code" class="item-from">
                    <label>验证码</label>
                    <el-row :gutter="30">
                        <el-col :span="15">
                            <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block">获取验证码</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item>
                    <el-button type="danger" @click="submitForm('loginForm')" class="login-btn block">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {reactive,ref,onMounted} from 'vue';
import { stripscript, validateEmail, validatePass, validateVCode } from '@/utils/validate';
export default {
    name: 'login',
    setup(props,context){
    // setup(props,{attrs }){
        // 验证用户名
        let validateUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else if(validateEmail(value)){
                callback(new Error('用户名格式有误'));
            } else {
                callback(); //true
            }
        };
        // 验证密码
        let validatePassword = (rule, value, callback) => {
            // 过滤后的数据
            ruleForm.password = stripscript(value);
            value = ruleForm.password;
            if (value === '') {
                callback(new Error("请输入密码"));
            } else if (validatePass(value)) {
                callback(new Error("密码为6至20位数字+字母"));
            } else {
                callback();
            }
        };
        
        // 验证重复密码
        let validatePasswords = (rule, value, callback) => {
            // 如果模块值为login, 直接通过
            if(modelValue.value === 'login') { callback(); }
            // 过滤后的数据
            ruleForm.repassword = stripscript(value);
            value = ruleForm.repassword;
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value != ruleForm.repassword) {
                callback(new Error('重复密码不正确'));
            } else {
                callback();
            }
        };

        // 验证验证码
        let validateCode = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入验证码'));
            }else if(validateVCode(value)){
                return callback(new Error('验证码格式有误'));
            }else{
                callback();
            }
        };

        /*********************************************************************************************************************
         * 声明数据
         */
        // 这里面放置data数据、生命周期、自定义的函数
        const menuTab = reactive([
            { txt: '登录', current: true, type: 'login' },
            { txt: '注册', current: false, type: 'register' }
        ]);
        const loginForm = ref(null);
        // 模块值 
        const modelValue= ref('login');
        // 表单绑定数据
        const ruleForm = reactive({
            username: '',
            password: '',
            repassword: '',
            code: ''
        });

        // 表单的验证
        const rules = reactive({
            username: [
            { validator: validateUsername, trigger: 'blur' }
            ],
            password: [
            { validator: validatePassword, trigger: 'blur' }
            ],
            passwords: [
            { validator: validatePasswords, trigger: 'blur' }
            ],
            code: [
            { validator: validateCode, trigger: 'blur' }
            ]
        });

        /**
         * 1、不建议在一个方法里面做多件不同的事件（尽可能只做自己本身的事，不要做其他人的事情）
         * 2、尽量把相同的事情封装一个方法里面，通过调用函数进行执行
         */

        /**
         * 声明函数
         */

        const toggleMenu = (data=>{
            menuTab.forEach(elem => {
                elem.current = false;
            })
            data.current = true;
            // 修改模块值
            modelValue.value = data.type;
        });

        const submitForm = (formName =>{
            loginForm.value.validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        })
        /**
         * 生命周期
         */
        //挂载完成后
        onMounted(()=>{

        })
        return {
            menuTab,
            modelValue,
            ruleForm,
            rules,
            toggleMenu,
            submitForm,
            loginForm
        }
    }
}
</script>

<style lang="scss" scoped>
#login {
    height: 100vh;
    background-color: #344a5f;
}

.login-wrap {
    width: 330px;
    margin: auto;
}

.menu-tab {
    text-align: center;

    li {
        display: inline-block;
        width: 88px;
        line-height: 36px;
        font-size: 14px;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
    }

    .current {
        background-color: rgba(0, 0, 0, .1);
    }
}

.login-form {
    margin-top: 29px;

    label {
        display: block;
        margin-bottom: 3px;
        font-size: 14px;
        color: #fff;
    }

    .item-from {
        margin-bottom: 13px;
    }

    .block {
        display: block;
        width: 100%;
    }

    .login-btn {
        margin-top: 19px;
    }
}
</style>