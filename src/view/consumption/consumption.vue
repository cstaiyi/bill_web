<template>
    <div>
        <div class="view-archives-archivesIndex">
            <Button type="primary" style="margin-bottom: 10px;" @click="addClick">新增一级消费类型</Button>
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
        title="一级消费类型"
        @on-ok="ok('refVallidate')"
        @on-cancel="cancel('refVallidate')"
        >
        <div class="form">
            <i-form ref="refVallidate" :model="formValidate" :label-width="150">
                <Form-item label="一级消费类型名称：" prop>
                    <Input v-model="formValidate.name" placeholder="例如：生活缴费" style="width:200px"/>             
                </Form-item> 
                <Form-item label="二级消费类型名称：" prop>
                    <Input v-model="secondName" placeholder="例如：水费" style="width:135px"/>  
                    <i-button icon="ios-plus-empty" style="margin-left:7px;" type="dashed" @click="addSecondClick">添加&nbsp;&nbsp;</i-button>  
                </Form-item>
                <Form-item v-if="secondList != null" label="" style="margin-left:-120px;" prop>
                    <Tag v-for="data in secondList" @on-close="secondClose(data.name)" type="dot" closable color="blue">{{ data.name }}</Tag>           
                </Form-item> 
                <Form-item v-if="secondList[0] == null" label="请注意：" prop>   
                    <span>至少要添加一个二级消费类型</span>     
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
                    registerId: "",
                },
                total:0,
                secondList: [
                    // name: "",
                ],
                detailId: "",
                editFlag:1,//1、新增 2、修改
                addShow: false,
                detailShow: false,
                loading: false,
                modal1: false,
                secondName: "",
                formValidate: {
                    id:"",
                    name:"",
                    registerId: "",
                    secondList: [],
                },
                tbColumns: [
                    {
                        title: "一级消费类型名称",
                        key: "name",
                        width: 400,
                    },
                    {
                        title: "创建时间",
                        key: "createTime",
                        minWidth: 400
                    },
                    {
                        title: "操作",
                        key: "action",
                        width: 300,
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
            var userStr = window.localStorage.getItem("userInfo");
            this.userInfo = JSON.parse(userStr);  
            this.queryData()
        },
        methods: {       
            queryData() {
                this.pageParams.registerId = this.userInfo.id
                this.$axios.request({
                    url: this.$api.consumption.pageFirstConsumption,
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
                this.secondName = "";
                this.secondList = [];
                this.editFlag = 1;
                this.modal1 = true;
            },
            addSecondClick() {
                var singel = 0

                if(this.secondName == null || this.secondName.trim() == ''){
                    singel = 2
                } else {
                    for (let i = 0; i < this.secondList.length; i++) {
                        if(this.secondList[i].name == this.secondName.trim()){
                            singel = 1;
                            break;
                        }
                    }  
                }

                if (singel == 1) {
                    this.$Message.warning("二级消费类型名称不能重复");
                    return;
                } else if (singel == 2){
                    this.$Message.warning("二级消费类型名称不能为空");
                    return;                  
                }  else{
                    var list = {name: this.secondName.trim()}
                    this.secondList.push(list); 
                    this.secondName = "";                   
                }              
                
            },
            secondClose(name) {
                if(this.editFlag == 1){
                    this.closeFunc(name);
                } else if(this.editFlag == 2){
                    this.$Modal.confirm({
                        title: '删除',
                        content: '<h4>删除后相关联流水记录的二级消费类型也会消失，仍然删除？</h4>',
                        onOk: () => {
                            this.closeFunc(name);   
                        }
                    });
                }         
            },
            closeFunc(name){
                for (let i = 0; i < this.secondList.length; i++) {
                    if(this.secondList[i].name == name){
                        this.secondList.splice(i,1);
                        break;
                    }
                }  
            },
            updateClick(row) {
                this.formValidate.id = row.id;
                this.formValidate.name = row.name;
                this.editFlag = 2;
                this.modal1 = true;           
                this.$axios.request({
                    url: this.$api.consumption.findSecondDetail,
                    params: {id:row.id},
                    method: 'get'
                }).then(suc => {
                    if (suc.data.code === 200) {
                        this.secondList = suc.data.data;
                    } else {
                        this.$Message.warning(suc.data.message);
                    }
                    this.loading = false;
                })                
            },            
            // 分页
            onChange (e) {
                this.pageParams.current = e
                this.queryData();
            },
            deleteClick(row) {
                this.$Modal.confirm({
                    title: '删除',
                    content: '<h4>删除后相关联流水记录的消费类型也会消失，仍然删除？</h4>',
                    onOk: () => {
                        this.$axios.request({
                            url: this.$api.consumption.delete,
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
                if(this.secondList.length == 0){
                    this.$Message.warning("至少要添加一个二级消费类型");
                    return;                      
                }
                this.formValidate.registerId = this.userInfo.id    
                this.formValidate.secondList = this.secondList
                this.$axios.request({
                    url: this.$api.consumption.addOrUpdate,
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