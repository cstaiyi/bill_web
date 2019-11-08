<template>
    <div class="user-avator-dropdown">
        <Dropdown @on-click="handleClick">
            <Avatar :src="userAvator"/>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
    import './user.less'

    export default {
        name: 'User',
        props: {
            userAvator: {
                type: String,
                default: ''
            }
        },
        methods: {
            handleClick(name) {
                const that = this;
                switch (name) {
                    case 'logout':
                        that.$store.commit("setUserInfo", null);
                        this.$router.push({
                            name: this.$config.loginName
                        })
                        break
                }
            }
        }
    }
</script>
