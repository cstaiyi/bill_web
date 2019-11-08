<template>
    <div>
        <div class="icon" @click="goback">
          <Button type="dashed"><Icon style="fontSize:16px;" type="reply"></Icon>返回</Button>
        </div>
        <div style="margin-top:40px;">
            <span style="font-size:20px;">成员 {{this.memberName}} 流水详细信息：(目前余额：{{this.money}}元)</span>
            <p>&nbsp;</p>  
            <Table :loading="loading" border :columns="tbColumns" :data="tbData"></Table>
            <Row>
                <Col span="24">
                    <div class="page">
                        <Page :total="total" :current="pageParams.current" :page-size="pageParams.size" @on-change="onChange" show-total></Page>
                    </div>
                </Col>
            </Row>
        </div>        
    </div>

</template>
<script>
    export default {
        props: ["id","money","memberName"],
        name: 'archivesIndex',
        components: {},
        data() {
            return {
                pageParams: {
                    current: 1,
                    size: 10,
                    id: "",
                },
                userInfo:{},
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
                    money:0,
                    registerId: "",
                },
                tbColumns: [
                    {
                        title: "一级消费类型",
                        key: "firstConsumptionName",
                        width: 150,
                    },
                    {
                        title: "二级消费类型",
                        key: "secondConsumptionName",
                        width: 150,
                    },
                    {
                        title: "总金额",
                        key: "billMoney",
                        width: 100,
                    },
                    {
                        title: "发生时间",
                        key: "billDate",
                        width: 150,
                    },
                    {
                        title: "支付类型",
                        key: "typeName",
                        width: 100,
                    },
                    {
                        title: "支付比例/数值",
                        key: "typeNumberName",
                        width: 120,
                    },
                    {
                        title: "实际支付金额",
                        key: "money",
                        width: 120,
                    },
                    {
                        title: "创建时间",
                        key: "createTime",
                        width: 150
                    },
                    {
                        title: "备注",
                        key: "mark",
                        minWidth: 60,
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
                this.pageParams.id = this.id;
                this.$axios.request({
                    url: this.$api.billmember.pageBillMember,
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
            // 分页
            onChange (e) {
                this.pageParams.current = e
                this.queryData();
            },            
            goback () {
                this.$emit("goback");
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
    .icon {
      float: right;
      font-size: 28px;
      margin-right: 10px;
      margin-top: -40px;
    }    
</style>