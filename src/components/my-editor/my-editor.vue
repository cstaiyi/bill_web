<template>
    <div class="components-myEditor">
        <quill-editor
                ref="myQuillEditor"
                v-model="contextHtml"
                class="ql-editor"
                style="width: 800px; height: 500px"
                @change="onEditorChange($event)"
                :options="editorOption">
        </quill-editor>
        <input @change="fileChange" type="file" id="inputFile" ref="uploadFile" style="display: none"/>
    </div>
</template>
<script>
    import { quillEditor } from "vue-quill-editor";
    import { uploadFile } from '@/api/upload'
    export default {
        name: 'MyEditor',
        props: {
            value: String,
        },
        data() {
            return {
                contextHtml: this.value,
                editorOption:{
                    modules: {
                        toolbar: {
                            container: [
                                ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                                [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
                                [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
                                [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
                                [{ 'direction': 'rtl' }],             // 文本方向
                                [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                                [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                                [{ 'font': [] }],     //字体
                                [{ 'align': [] }],    //对齐方式
                                ['clean'],    //清除字体样式
                                ['image']    //上传图片、上传视频
                            ],
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        document.getElementById("inputFile").click();
                                    }
                                },
                                /*'video': function (value) {
                                    if (value) {
                                        document.getElementById("inputFile").click();
                                    }
                                },*/
                            }
                        }
                    },
                    placeholder: '请输入内容',
                    theme: 'snow'  // or 'bubble'
                },
            }
        },
        methods: {
            fileChange() {
                const _this = this;
                const imgFile = this.$refs.uploadFile.files[0];
                const imgType = imgFile.type.split('/')[1];
                if (imgType !== 'jpeg' && imgType !== 'png' && imgType !== 'jpg' && imgType !== 'mp4') {
                    this.$Message.warning({
                        content: "文件 " + imgFile.name + " 格式不正确，请上传 jpg 或 png、jpeg、mp4 格式的文件。",
                        duration: 3,
                        className: "ivu-message-error-g"
                    });
                    return;
                }

                if (imgFile.size > 50 * 1024 * 1204) {
                    this.$Message.error({
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

                    let quill = _this.$refs.myQuillEditor.quill;
                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    quill.insertEmbed(length, 'image', res.data.data);
                    // 插入图片  res.info为服务器返回的图片地址
                    // 调整光标到最后
                    quill.setSelection(length + 1)
                    _this.$refs.uploadFile.value = null;
                });
            },
            onEditorChange({ editor, html, text }) {
                this.$emit("input", html);
                this.$emit("change", {
                    html,
                    text
                })
            },
        },
        components: {
            quillEditor
        },
        watch: {
            value(val) {
                this.contextHtml = val;
            }
        }
    }
</script>
<style lang="less">
    .components-myEditor {
        .ql-container{
            height: 80% !important;
        }
    }
</style>