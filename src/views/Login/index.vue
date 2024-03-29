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
                    <label for="username">邮箱</label>
                    <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
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
                            <el-button type="success" class="block" @click="GetSms()" :disabled="codeButtonStatus.status">{{
                                codeButtonStatus.text }}</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item>
                    <el-button type="danger" @click="submitForm('loginForm')" class="login-btn block"
                        :disabled="loginButtonStatus">{{ modelValue === 'login' ? "提交" : "注册" }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import sha1 from 'js-sha1';
import { getSms, Register } from "@/api/login";
import { ElMessage } from "element-plus";
import { reactive, ref, isRef, toRefs, onMounted } from 'vue';
import { stripscript, validateEmail, validatePass, validateVCode } from '@/utils/validate';
import { useStore } from 'vuex';

export default {
    name: 'login',
    setup(props, context) {
        const store = useStore();
        // setup(props,{attrs }){
        // 验证用户名
        let validateUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else if (validateEmail(value)) {
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
            if (modelValue.value === 'login') { callback(); }
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
            } else if (validateVCode(value)) {
                return callback(new Error('验证码格式有误'));
            } else {
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
        const loginForm = ref();
        // 模块值 
        const modelValue = ref('login');
        //登录按键禁用状态
        const loginButtonStatus = ref(true);
        // 倒计时
        const timer = ref(null);
        // 验证码按钮状态
        const codeButtonStatus = reactive(
            {
                status: false,
                text: '获取验证码'
            }
        );
        // 表单绑定数据
        const ruleForm = reactive({
            username: 'xiangqi_007@163.com',
            password: 'Aa123456',
            repassword: '',
            code: '123456'
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
        // 更新按钮状态
        const updateButtonStatus = ((params) => {
            codeButtonStatus.status = params.status;
            codeButtonStatus.text = params.text;
        })

        const toggleMenu = (data => {
            menuTab.forEach(elem => {
                elem.current = false;
            })
            data.current = true;
            // 修改模块值
            modelValue.value = data.type;

            // 重置表单
            resetForm(loginForm);
        });

        /**
         * 获取验证码
         */
        const GetSms = (() => {
            if (ruleForm.username == '') {
                ElMessage.error("邮箱不能为空！！！");
                return false;
            }
            let data = {
                username: ruleForm.username,
                password: ruleForm.password,
                module: modelValue.value,
            }
            updateButtonStatus({
                status: true,
                text: "发送中"
            })
            getSms(data).then(res => {
                ElMessage({
                    message: res.message,
                    type: 'success',
                })
                loginButtonStatus.value = false;
                countDown(10);
            }).catch(error => {
                loginButtonStatus.value = false;
                updateButtonStatus({
                    status: false,
                    text: "再次获取"
                })
            });
        })

        /**
         * 倒计时
         */
        const countDown = ((number) => {
            if (timer.value) {
                clearInterval(timer.value);
            }
            let times = number;
            timer.value = setInterval(() => {
                if (times === 0) {
                    clearInterval(timer.value);
                    updateButtonStatus({
                        status: false,
                        text: "再次获取"
                    })
                } else {
                    updateButtonStatus({
                        status: true,
                        text: `倒计时${times}秒`
                    });
                }
                times--;
            }, 1000)
        });

        /**
         * 提交表单
         */
        const submitForm = (formName => {
            loginForm.value.validate((valid) => {
                if (valid) {
                    if (modelValue.value === "login") {
                        login();
                    } else {
                        register();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        })
        const route = useRouter();
        /**
         * 登录
         */
        const login = (() => {
            let loginData = {
                username: ruleForm.username,
                password: sha1(ruleForm.password),
                code: ruleForm.code,
                module: "login",
            }
            store.dispatch('app/login', loginData).then(res => {
                ElMessage({
                    message: res.message,
                    type: 'success',
                })
                route.push({ name: 'Console', query: { id: '123' } });
                toggleMenu(menuTab[0]);
                clearCountDown();
            }).catch(error => {
                console.log("登录失败");
            });
            // Login(loginData).then(res => {
            //     ElMessage({
            //         message: res.message,
            //         type: 'success',
            //     })
            //     route.push({ name: 'Console', query: { id: '123' } });
            //     toggleMenu(menuTab[0]);
            //     clearCountDown();
            // }).catch(error => {
            //     console.log("登录失败")
            // });
        });

        /**
         * 注册
         */
        const register = (() => {
            let registerData = {
                username: ruleForm.username,
                password: sha1(ruleForm.password),
                code: ruleForm.code,
                module: "register",
            }
            Register(registerData).then(response => {
                ElMessage({
                    message: response.message,
                    type: 'success',
                })
                toggleMenu(menuTab[0]);
                clearCountDown();
            }).catch(error => {
                loginButtonStatus.value = false;
                updateButtonStatus({
                    status: false,
                    text: "再次获取"
                })
            })
        });

        /**
         * 清除倒计时
         */
        const clearCountDown = (() => {
            codeButtonStatus.status = false;
            codeButtonStatus.text = '获取验证码';
            //清除倒计时
            clearInterval(timer.value);
        });

        /**
         * 重置表单
         */
        const resetForm = (loginForm) => {
            loginForm.value.resetFields();
        }
        /**
         * 生命周期
         */
        //挂载完成后
        onMounted(() => {

        })
        return {
            menuTab,
            modelValue,
            ruleForm,
            rules,
            toggleMenu,
            submitForm,
            loginForm,
            GetSms,
            loginButtonStatus,
            codeButtonStatus,
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