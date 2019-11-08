<template>
    <div>
        <div class="view-archives-archivesIndex">
            <Button type="primary" style="margin-bottom: 10px;" @click="addClick">新增流水</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;查询：
            <Select placeholder="请选择一级消费" filterable style="width:150px;margin-top:-8px;" v-model="pageParams.firstConsumptionId" @on-change="changeFirstSearch">
                <Option v-for="item in firstListName" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Select placeholder="请选择二级消费" filterable style="margin-left:10px;width:150px;margin-top:-8px;" v-model="pageParams.secondConsumptionName">
                <Option v-for="item in secondListName" :value="item.name" :key="item.name">{{ item.name }}</Option>
            </Select>
            <Button type="primary" style="margin-left: 10px;margin-top:-8px;" @click="queryData">查询</Button>
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
        title="流水信息"
        @on-ok="ok('refVallidate')"
        @on-cancel="cancel('refVallidate')"
        >
        <div class="form">
            <i-form ref="refVallidate" :model="formValidate" :label-width="100">
                <Form-item label="发生时间：" prop>
                    <Col span="12" offset="1">
                        <DatePicker v-model="formValidate.billDate" @on-change="dateChange" format="yyyy-MM-dd HH:mm:ss" :clearable="false" type="datetime" placeholder="请选择" style="margin-left:-15px;width: 200px"></DatePicker>
                    </Col>          
                </Form-item> 
                <Form-item label="消费类型：" prop>
                    <Select placeholder="请选择" filterable v-model="formValidate.firstConsumptionId" style="width:150px;" @on-change="changeFirst">
                        <Option v-for="item in firstConsumptionList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select placeholder="请选择" filterable v-model="formValidate.secondConsumptionName" style="margin-left:10px;width:150px;">
                        <Option v-for="item in secondConsumptionList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                    </Select>                    
                </Form-item>
                <Form-item label="金额(元)：" prop>
                    <InputNumber type="number" :max="100000" :min="0" v-model="formValidate.money" style="width: 70px;"></InputNumber> 
                </Form-item>
                <Form-item label="支付方式：" prop>
                    <Select placeholder="请选择" filterable v-model="formValidate.style" style="width:90px;">
                        <Option value="微信支付" >微信支付</Option>
                        <Option value="混合支付" >混合支付</Option>
                        <Option value="支付宝" >支付宝</Option>
                        <Option value="银行卡" >银行卡</Option>
                        <Option value="现金" >现金</Option>
                        <Option value="其他" >其他</Option>
                    </Select>
                </Form-item>
                <Form-item label="支付成员：" prop>
                    <Select placeholder="请选择" filterable v-model="selectMemberId" style="width:90px;">
                        <Option v-for="item in memberList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select placeholder="请选择" filterable v-model="sortId" style="margin-left:10px;width:90px;">
                        <Option v-for="item in sortList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>     
                    <InputNumber type="number" :max="100000" :min="0" v-model="payNumber" style="margin-left:10px;width: 70px;"></InputNumber>                             
                    <i-button icon="ios-plus-empty" style="margin-left:10px;" type="dashed" @click="addMemberClick">添加&nbsp;&nbsp;</i-button>  
                </Form-item>
                <Form-item v-if="payMemberList != null" label="" style="margin-left:-80px;" prop>
                    <Tag v-for="data in payMemberList" @on-close="payMemberClose(data.name)" type="dot" closable color="blue">{{ data.showName }}</Tag>           
                </Form-item> 
                <Form-item v-if="payMemberList[0] == null" label="请注意：" prop>
                    <span>至少要添加一位支付成员</span>     
                </Form-item>
                <Form-item label="备注：">
                <i-input v-model="formValidate.mark" style="width:300px;" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }"></i-input>
                </Form-item>                              
            </i-form>         
        </div>
        </Modal>          
    </div>

</template>
<script>
    Date.prototype.format = function(fmt) {
        var o = { 
            "M+" : this.getMonth()+1,                 //月份 
            "d+" : this.getDate(),                    //日 
            "h+" : this.getHours(),                   //小时 
            "m+" : this.getMinutes(),                 //分 
            "s+" : this.getSeconds(),                 //秒 
            "q+" : Math.floor((this.getMonth()+3)/3), //季度 
            "S"  : this.getMilliseconds()             //毫秒 
        }; 
        if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt; 
    }
    export default {

        name: 'archivesIndex',
        components: {},
        data() {
            return {
                pageParams: {
                    current: 1,
                    size: 10,
                    registerId: "",
                    firstConsumptionId: "",
                    secondConsumptionName: "",
                },
                userInfo:{},
                total:0,
                detailId: "",
                editFlag:1,//1、新增 2、修改
                addShow: false,
                detailShow: false,
                loading: false,
                modal1: false,
                firstConsumptionList: [],
                secondConsumptionList: [],
                memberList: [],
                selectMemberId: "",
                payMemberList: [],
                firstListName:[],
                secondListName:[],
                formValidate: {
                    id:"",
                    registerId: "",
                    billDate:"",
                    firstConsumptionId:"",
                    secondConsumptionName:"",
                    money: 0,
                    payMemberList: [],
                    mark: "",
                    style: "",
                },
                payNumber:0,
                sortId: 1,
                sortList: [
                {
                    id: "1",
                    name: "比例支付"
                },
                {
                    id: "2",
                    name: "具体金额"
                },
                ],
                tbColumns: [
                    {
                        title: "发生时间",
                        key: "billDate",
                        width: 150,
                    },
                    {
                        title: "一级消费类型",
                        key: "firstConsumptionName",
                        width: 120,
                    },
                    {
                        title: "二级消费类型",
                        key: "secondConsumptionName",
                        width: 120,
                    },
                    {
                        title: "支付方式",
                        key: "style",
                        minWidth: 100,
                    },
                    {
                        title: "金额(元)",
                        key: "money",
                        width: 100,
                    },
                    {
                        title: "支付成员",
                        key: "payName",
                        minWidth: 200,
                    },
                    {
                        title: "创建时间",
                        key: "createTime",
                        width: 150
                    },
                    {
                        title: "备注",
                        key: "mark",
                        minWidth: 200,
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
            var userStr = window.localStorage.getItem("userInfo");
            this.userInfo = JSON.parse(userStr);
            console.log("====================");
            this.firstList();
        },
        methods: {       
            dateChange(event) {
                this.formValidate.billDate = event;
            },
            changeFirst(id) {
                if(this.modal1){
                    this.$axios.request({
                        url: this.$api.consumption.findSecondDetail,
                        params: {id: id},
                        method: 'get'
                    }).then(suc => {
                        if (suc.data.code === 200) {
                            this.secondConsumptionList = suc.data.data;
                            this.secondListName = suc.data.data;
                        } else {
                            this.$Message.warning(suc.data.message);
                        }
                        this.loading = false;
                    }) 
                }               
            },
            changeFirstSearch(id) {
                    this.$axios.request({
                        url: this.$api.consumption.findSecondDetail,
                        params: {id: id},
                        method: 'get'
                    }).then(suc => {
                        if (suc.data.code === 200) {
                            this.secondConsumptionList = suc.data.data;
                            this.secondListName = suc.data.data;
                        } else {
                            this.$Message.warning(suc.data.message);
                        }
                        this.loading = false;
                    })
            },
            addMemberClick() {         
                if(this.sortId == 1 && this.payNumber != Math.floor(this.payNumber)){
                    this.$Message.warning("比例支付的数值目前只整数");
                    return;
                }

                for (let i = 0; i < this.memberList.length; i++) {
                    if(this.memberList[i].id == this.selectMemberId){
                        this.payMemberList.push({
                            id:this.selectMemberId,
                            name:this.memberList[i].name,
                            payNumber:this.payNumber,
                            sortId:this.sortId,
                            showName:this.sortId == "1"?(this.memberList[i].name + '-' + this.payNumber + '%'):(this.memberList[i].name + '-' + this.payNumber + '元')
                            }); 
                        this.memberList.splice(i,1);
                        if(this.memberList[0] != null){
                            this.selectMemberId = this.memberList[0].id;
                        } else {
                            this.selectMemberId = "";
                        }
                        break;
                    }
                }   
            },
            payMemberClose(name) {
                for (let i = 0; i < this.payMemberList.length; i++) {
                    if(this.payMemberList[i].name == name){
                        this.memberList.push(this.payMemberList[i]);
                        if(this.memberList[1] == null){
                            this.selectMemberId = this.memberList[0].id;
                        }
                        this.payMemberList.splice(i,1);
                        break;
                    }
                }
            },         
            queryData() {
                this.pageParams.registerId = this.userInfo.id
                this.$axios.request({
                    url: this.$api.bill.pageBill,
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
            firstList() {
                this.$axios.request({
                    url: this.$api.consumption.findFirstList,
                    params: {id:this.userInfo.id},
                    method: 'get'
                }).then(suc => {
                    if (suc.data.code === 200) {
                        this.firstListName = suc.data.data;
                        this.queryData();
                    } else {
                        this.$Message.warning(suc.data.message);
                    }
                    this.loading = false;
                })
            },
            // 点击新增
            addClick() {
                this.payNumber = 0;
                this.sortId = "1";
                this.selectMemberId = "";
                this.payMemberList = [];
                this.secondConsumptionList = [];
                this.editFlag = 1;
                this.modal1 = true;
                this.$axios.request({
                    url: this.$api.consumption.findFirstList,
                    params: {id:this.userInfo.id},
                    method: 'get'
                }).then(suc => {
                    if (suc.data.code === 200) {
                        this.firstConsumptionList = suc.data.data;

                        this.$axios.request({
                            url: this.$api.member.findMemberList,
                            params: {id:this.userInfo.id},
                            method: 'get'
                        }).then(suc => {
                            if (suc.data.code === 200) {
                                this.memberList = suc.data.data;
                                
                            } else {
                                this.$Message.warning(suc.data.message);
                            }
                            this.loading = false;
                        })  

                    } else {
                        this.$Message.warning(suc.data.message);
                    }
                    this.loading = false;
                })                
            },
            updateClick(row) {
                this.payNumber = 0;
                this.sortId = "1";
                this.selectMemberId = "";
                this.payMemberList = [];                
                this.editFlag = 2;
                this.modal1 = true;
                //第一次查询 一级消费类型下拉框
                this.$axios.request({
                    url: this.$api.consumption.findFirstList,
                    params: {id:this.userInfo.id},
                    method: 'get'
                }).then(suc => {
                    if (suc.data.code === 200) {
                        this.firstConsumptionList = suc.data.data;
                        //第二次查询 成员下拉框
                        this.$axios.request({
                            url: this.$api.member.findMemberList,
                            params: {id:this.userInfo.id},
                            method: 'get'
                        }).then(suc => {
                            if (suc.data.code === 200) {
                                this.memberList = suc.data.data;
                                //第三次查询 要修改的这条数据
                                this.$axios.request({
                                    url: this.$api.bill.findBillById,
                                    params: {id:row.id},
                                    method: 'get'
                                }).then(suc => {
                                    if (suc.data.code === 200) {
                                        this.formValidate = suc.data.data;
                                        this.changeFirst(this.formValidate.firstConsumptionId);
                                        //添加分担的成员
                                        for (let i = 0; i < this.formValidate.payMemberList.length; i++) {
                                            this.payMemberList.push({
                                                id:this.formValidate.payMemberList[i].memberId,
                                                name:this.formValidate.payMemberList[i].name,
                                                payNumber:this.formValidate.payMemberList[i].typeNumber,
                                                sortId:this.formValidate.payMemberList[i].type,
                                                showName:this.formValidate.payMemberList[i].type == "1"?(
                                                        this.formValidate.payMemberList[i].name + 
                                                        '-' + 
                                                        this.formValidate.payMemberList[i].typeNumber 
                                                        + '%'
                                                    ):(
                                                        this.formValidate.payMemberList[i].name + 
                                                        '-' + 
                                                        this.formValidate.payMemberList[i].typeNumber + 
                                                        '元'
                                                    )
                                                }); 
                                            //每添加一个，成员列表里面就要删除一个
                                            
                                            for (let j = 0; j < this.memberList.length; j++) {
                                                if(this.memberList[j].id == this.formValidate.payMemberList[i].memberId){
                                                    this.memberList.splice(j,1);   
                                                    break; 
                                                }
                                            }    
                                        }   
                                    } else {
                                        this.$Message.warning(suc.data.message);
                                    }
                                    this.loading = false;
                                })                                  
                            } else {
                                this.$Message.warning(suc.data.message);
                            }
                            this.loading = false;
                        })  

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
                    content: '<h4>确认删除该条数据吗？</h4>',
                    onOk: () => {
                        this.$axios.request({
                            url: this.$api.bill.deleteById,
                            params: {id:row.id},
                            method: 'get'
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
                var payMemberListNew = []
                for (let i = 0; i < this.payMemberList.length; i++) {
                    var temp = {
                        'memberId': this.payMemberList[i].id,
                        'type': this.payMemberList[i].sortId,
                        'typeNumber': this.payMemberList[i].payNumber,
                    }   
                    payMemberListNew.push(temp); 
                }        
                this.formValidate.registerId = this.userInfo.id  
                this.formValidate.payMemberList = payMemberListNew 
                if (typeof(this.formValidate.billDate) !== 'string') {
                    this.formValidate.billDate = this.formValidate.billDate.format("yyyy-MM-dd hh:mm:ss")
                }

                if (this.formValidate.billDate == null || this.formValidate.billDate == "") {
                    this.$Message.warning("发生时间不能为空");
                    return;
                }      
                if (this.formValidate.firstConsumptionId == null || this.formValidate.firstConsumptionId == "") {
                    this.$Message.warning("一级消费类型不能为空");
                    return;
                }      
                if (this.formValidate.secondConsumptionName == null || this.formValidate.secondConsumptionName == "") {
                    this.$Message.warning("二级消费类型不能为空");
                    return;
                }                      
                if (this.formValidate.money == 0) {
                    this.$Message.warning("金额不能为0");
                    return;
                }            
                if (this.formValidate.payMemberList == null || this.formValidate.payMemberList[0] == null) {
                    this.$Message.warning("至少要添加一位支付成员");
                    return;
                }  

                this.$axios.request({
                    url: this.$api.bill.addOrUpdate,
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