<template>
    <div>
        <div class="view-archives-archivesIndex" v-if="!detailShow">
            <Button type="primary" style="margin-bottom: 10px;" @click="addClick">添加成员</Button>
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
        title="成员信息"
        @on-ok="ok('refVallidate')"
        @on-cancel="cancel('refVallidate')"
        >
        <div class="form">
            <i-form ref="refVallidate" :model="formValidate" :label-width="100">
                <Form-item label="成员名称：" v-if="editFlag == 1" prop>
                    <Input v-model="formValidate.name" style="width:300px"/>             
                </Form-item>
                <Form-item label="成员名称：" v-if="editFlag == 2" prop>
                    <Input disabled v-model="formValidate.name" style="width:300px"/>             
                </Form-item>                
                <Form-item label="成员金额：" v-if="editFlag == 2" prop>
                    <Input v-model="formValidate.money" style="width:300px"/>             
                </Form-item>
            </i-form> 
            <p  v-if="editFlag == 2" style="margin-left:20px;color:red;">提示：要缴纳多少就填对应金额，比如缴纳500，就填500，如果想取出，就填负数</p>        
        </div>
        </Modal>   
        <newsDetail v-if="detailShow" @goback="goback" :id="detailId" :money="money" :memberName="memberName"></newsDetail>       
    </div>
        
</template>
<script>
    import newsDetail from "./member-detail.vue";
    export default {
        name: 'archivesIndex',
        components: {newsDetail},
        data() {
            return {
                pageParams: {
                    current: 1,
                    size: 10,
                    registerId: "",
                },
                userInfo:{},
                total:0,
                detailId: "",
                memberName: "",
                money: 0,
                editFlag:1,//1、新增 2、修改
                addShow: false,
                detailShow: false,
                loading: false,
                modal1: false,
                detailId: "",
                formValidate: {
                    id:"",
                    name:"",
                    money:0,
                    registerId: "",
                },
                tbColumns: [
                    {
                        title: "成员名称",
                        key: "name",
                        width: 300,
                    },
                    {
                        title: "成员金额",
                        key: "money",
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
                                        type="info"
                                        onClick={() => {
                                            this.detailClick(params.row);
                                        }}
                                        size="small"
                                    >
                                    详情
                                    </i-button>
                                    &nbsp;&nbsp;                              
                                    <i-button
                                        type="warning"
                                        onClick={() => {
                                            this.updateClick(params.row);
                                        }}
                                        size="small"
                                    >
                                    缴纳
                                    </i-button>
                                    &nbsp;&nbsp;
                                    <i-button type="error"
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
            var userStr = window.localStorage.getItem("userInfo");
            this.userInfo = JSON.parse(userStr);           
            this.queryData()
        },
        methods: {           
            queryData() {
                this.pageParams.registerId = this.userInfo.id
                this.$axios.request({
                    url: this.$api.member.pageMember,
                    params: this.pageParams,
                    method: 'get'
                }).then(suc => {
                    if (suc.data.code === 200) {
                        this.total = suc.data.total;
                        this.tbData = suc.data.data;


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
                this.formValidate.name = row.name;
                this.formValidate.money = 0;
                this.editFlag = 2;
                this.modal1 = true;
            },            
            // 分页
            onChange (e) {
                this.pageParams.current = e
                this.queryData();
            },
            goback () {
                this.detailShow = false;
                this.queryData();
            },
            detailClick(row) {
                this.money = row.money;
                this.memberName = row.name;
                this.detailId = row.id;
                this.detailShow = true;
            }, 
            deleteClick(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: '<h4>确认删除该条数据吗？</h4>',
                    onOk: () => {
                        this.$axios.request({
                            url: this.$api.member.delete,
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
                this.formValidate.registerId = this.userInfo.id      
                this.$axios.request({
                    url: this.$api.member.addOrUpdate,
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