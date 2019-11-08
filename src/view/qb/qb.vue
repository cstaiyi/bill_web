<template>
    <Row >
        <DatePicker type="month" v-model="pageParams.billDate"  @click="queryData" placeholder="选择查询日期" style="width: 200px;height: 50px;"></DatePicker>
        <Select placeholder="请选择一级消费" clearable  style="margin-left:10px;width:150px;" v-model="pageParams.firstConsumptionId" @on-change="changeFirstSearch">
            <Option v-for="item in firstListName" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <Select placeholder="请选择二级消费" clearable  style="margin-left:10px;width:150px;" v-model="pageParams.secondConsumptionName">
            <Option v-for="item in secondListName" :value="item.name" :key="item.name">{{ item.name }}</Option>
        </Select>
        <Button type="primary" style="margin-left: 10px;" @click="queryData">查询</Button>
        <Table :loading="loading" border :columns="tbColumns" :data="tbData"></Table>
    </Row>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                pageParams: {
                    billDate: "",
                    firstConsumptionId:"",
                    secondConsumptionName:""
                },
                firstListName:[],
                secondListName:[],
                tbColumns: [
                    {
                        title: "成员姓名",
                        key: "name",
                        width: 300,
                    },
                    {
                        title: "消费总额",
                        key: "sumMoney",
                        width: 300,
                    },
                    {
                        title: "创建时间",
                        key: "billDate",
                        minWidth: 300
                    },
                ],
                tbData: [],
            }
        },
        mounted() {
            var userStr = window.localStorage.getItem("userInfo");
            this.userInfo = JSON.parse(userStr);
            this.firstList();
        },
        methods: {
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
            queryData() {
                var url = this.$api.billmember.ListAll;
                if (this.pageParams.billDate) {
                    url = this.$api.billmember.ListSum;
                    if (typeof this.pageParams.billDate === 'object') {
                        this.pageParams.billDate = this.pageParams.billDate.format("yyyy-MM");
                    }
                }
                this.loading  = true;
                this.$axios.request({
                    url: url,
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
        }
    }
</script>

<style scoped>

</style>