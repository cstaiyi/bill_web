<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="欢迎使用BILL账本管理系统" :bordered="false">
                <div class="form-con">
                    <login-form @on-success-valid="handleSubmit"></login-form>
                    <p class="login-tip">请输入用户名和密码登录</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import LoginForm from '_c/login-form'
    import {mapActions} from 'vuex'

    export default {
        components: {
            LoginForm
        },
        methods: {
            ...mapActions([
                'handleLogin'
            ]),
            handleSubmit({user, password}) {
                this.handleLogin({user, password}).then(res => {
                    this.$router.push({
                        name: this.$config.homeName
                    })
                }).catch((res) => {
                    this.$Message.warning(res.message);
                })
            }
        }
    }
</script>

<style>

</style>
