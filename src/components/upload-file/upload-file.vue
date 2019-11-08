<template>
    <div class="components-uploadFile">
        <div class="demo-upload-list" v-if="url">
                <img :src="url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
                </div>
        </div>
        <div class="ivu-upload" style="display: inline-block; width: 58px;" v-show="!url">
            <div class="ivu-upload ivu-upload-drag" @click="uploadClick">
                <input @change="fileChange" type="file" id="inputFile" ref="uploadFile" style="display: none"/>
                <div style="width: 58px; height: 58px; line-height: 58px;">
                    <Icon type="md-camera" size="18" />
                </div>
            </div>
        </div>

        <Modal title="查看大图" v-model="visible">
            <img :src="url" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    import { uploadFile } from '@/api/upload'
    export default {
        name: 'UploadFile',
        props: {
            value: {
                type: String,
                default: ""
            },
        },
        data() {
            return {
                visible: false,
                url: "",
            }
        },
        methods: {
            uploadClick() {
                this.$refs.uploadFile.click();
            },
            handleView (index) {
                this.visible = true;
            },
            handleRemove (index) {
                this.$Modal.confirm({
                    title: "温馨提示",
                    content: "确认移除图片！",
                    onOk: () => {
                        this.url = "";
                        this.$refs.uploadFile.value = null;
                        this.$emit("input", this.url);
                    }
                });
            },
            fileChange() {
                const _this = this;
                const imgFile = this.$refs.uploadFile.files[0];
                const imgType = imgFile.type.split('/')[1];
                if (imgType !== 'jpeg' && imgType !== 'png' && imgType !== 'jpg') {
                    this.$Message.warning({
                        content: "文件 " + imgFile.name + " 格式不正确，请上传 jpg 或 png、jpeg 格式的文件。",
                        duration: 3,
                        className: "ivu-message-error-g"
                    });
                    return;
                }

                if (imgFile.size > 50 * 1024 * 1204) {
                    this.$Message.warning({
                        content: "文件太大，不能超过 50M。",
                        duration: 3,
                        className: "ivu-message-error-g"
                    });
                    return;
                }
                var formdata = new FormData();
                formdata.append("file", imgFile);
                uploadFile({formdata}).then(res => {
                    if (res.data.code !== 200) {
                        this.$Message.warning("上传文件失败");
                        return;
                    }
                    this.url = res.data.data;
                    this.$emit("input", this.url);
                    _this.$refs.uploadFile.value = null;
                });
            },
        },
        components: {
        },
        watch: {
            value(val) {
                this.url = val;
            }
        }
    }
</script>
<style lang="less">
    .components-uploadFile {
        .demo-upload-list{
            display: inline-block;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0,0,0,.2);
            margin-right: 4px;
        }
        .demo-upload-list img{
            width: 100%;
            height: 100%;
        }
        .demo-upload-list-cover{
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,.6);
        }
        .demo-upload-list:hover .demo-upload-list-cover{
            display: block;
        }
        .demo-upload-list-cover i{
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
        }
    }
</style>