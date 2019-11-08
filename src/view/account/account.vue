<template>
    <div>
        <div class="view-archives-archivesIndex">
            <Button type="primary" style="margin-bottom: 10px;" @click="addClick">新增账本</Button>
            <Table :loading="loading" border :columns="tbColumns" :data="tbData"></Table>
            <Row>
                <Col span="24">
                    <div class="page">
                        <Page :total="total" :current="pageParams.current" :page-size="pageParams.size" @on-change="onChange" show-total></Page>
                    </div>
                </Col>
            </Row>
        </div>
        <!-- 模态框 -->
        <Modal
        v-model="modal1"
        title="账本信息"
        @on-ok="ok('refVallidate')"
        @on-cancel="cancel('refVallidate')"
        >
        <div class="form">
            <i-form ref="refVallidate" :model="formValidate" :label-width="100">
                <Form-item label="账本名称：" prop>
                    <Input v-model="formValidate.name" style="width:300px"/>             
                </Form-item>
                <Form-item label="账本账号：" v-if="formValidate.id == '' || formValidate.id == null" prop>
                    <Input v-model="formValidate.user" style="width:300px"/>             
                </Form-item>
                <Form-item label="账本密码：" v-if="formValidate.id == '' || formValidate.id == null" prop>
                    <Input type="password" v-model="formValidate.password" style="width:300px"/>             
                </Form-item>
            </i-form>
        </div>
        </Modal>          
    </div>

</template>
<script>
    export default {
        name: 'archivesIndex',
        components: {},
        data() {
            return {
                pageParams: {
                    current: 1,
                    size: 10,
                },
                total:0,
                detailId: "",
                editFlag:1,//1、新增 2、修改
                addShow: false,
                detailShow: false,
                loading: false,
                modal1: false,
                formValidate: {
                    id:"",
                    name:"",
                    user:"",
                    password:"",
                },
                tbColumns: [
                    {
                        title: "账本名称",
                        key: "name",
                        width: 300,
                    },
                    {
                        title: "账本账号",
                        key: "user",
                        width: 300,
                    },
                    {
                        title: "创建时间",
                        key: "createTime",
                        minWidth: 300
                    },
                    {
                        title: "操作",
                        key: "action",
                        width: 200,
                        fixed: "right",
                        align: "center",
                        render: (h, params) => {
                            return (
                                <div>                               
                                    <i-button
                                        type="warning"
                                        onClick={() => {
                                            this.updateClick(params.row);
                                        }}
                                        size="small"
                                    >
                                    修改
                                    </i-button>
                                    &nbsp;&nbsp;
                                    <i-button
                                        type="error"
                                        onClick={() => {
                                            this.deleteClick(params.row);
                                        }}
                                        size="small"
                                    >
                                    删除
                                    </i-button>                                    
                                </div>
                                );
                        }
                    }
                ],
                tbData: [],
            }
        },
        mounted() {
            this.queryData()
        },
        methods: {       
            queryData() {
                this.$axios.request({
                    url: this.$api.register.pageBillUserInfo,
                    params: this.pageParams,
                    method: 'get'
                }).then(suc => {
                    if (suc.data.code === 200) {
                        this.total = suc.data.total;
                        this.tbData = suc.data.data;

                        var userStr = window.localStorage.getItem("userInfo");
                        var localData = JSON.parse(userStr);                       
                    } else {
                        this.$Message.warning(suc.data.message);
                    }
                    this.loading = false;
                })
            },  
            // 点击新增
            addClick() {
                this.editFlag = 1;
                this.modal1 = true;
            },
            updateClick(row) {
                this.formValidate.id = row.id;
                this.formValidate.user = row.user;
                this.formValidate.password = row.password;
                this.formValidate.name = row.name;
                this.editFlag = 2;
                this.modal1 = true;
            },            
            // 分页
            onChange (e) {
                this.pageParams.current = e
                this.queryData();
            },
            deleteClick(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: '<h4>确认删除该条数据吗？</h4>',
                    onOk: () => {
                        this.$axios.request({
                            url: this.$api.register.delete,
                            data: row,
                            method: 'post'
                        }).then(suc => {
                            if (suc.data.code === 200) {
                                // this.$Modal.remove();
                                this.queryData()
                                this.$Message.success(suc.data.message);
                            } else {
                                this.$Message.warning(suc.data.message);
                            }
                        })
                    }
                });
            },       
            ok() {
                if (this.editFlag == 1 && !this.formValidate.user) {
                    this.modal1 = false;
                    this.$Message.warning("账本账号不能为空");
                    return;
                }
                if (this.editFlag == 1 && !this.formValidate.password) {
                    this.modal1 = false;
                    this.$Message.warning("账本密码不能为空");
                    return;
                }                
                this.$axios.request({
                    url: this.$api.register.addOrUpdate,
                    data: this.formValidate,
                    method: 'post'
                }).then(suc => {
                    if (suc.data.code === 200) {
                        this.modal1 = false;
                        this.queryData()
                        this.$Message.success(suc.data.message);
                        this.formValidate = {};
                    } else {
                        this.$Message.warning(suc.data.message);
                    }
                })
            },
            cancel() {
                this.modal1 = false;
                this.formValidate = {}
            },     
        }
    }
</script>

<style lang="less">
    .view-archives-archivesIndex {
        .aa{

        }
    }
    .page {
        margin: 10px;
        text-align: center;
    }
</style>