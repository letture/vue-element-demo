<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="rules"
      label-position="left"
      label-width="70px"
      class="form-container"
      border="1px solid"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" width="100" />
      </el-form-item>
      <el-form-item label="分类" prop="category_id">
        <el-select v-model="dataForm.category_id" placeholder="请选择分类">
          <el-option :label="item.title" :value="item.id" v-for="item in categoryList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio
            :label="index"
            v-for="(status, index) in statusList"
            :key="status"
          >
            {{ status }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内容" prop="content" style="margin-bottom: 30px">
        <Tinymce ref="editor" v-model="dataForm.content" :height="400" />
      </el-form-item>

      <el-form-item label="LOGO" prop="image_uri" style="margin-bottom: 30px">
        <Upload v-model="dataForm.image_uri" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/SingleImage3";
import { createArticle, updateArticle, detailArticle } from "@/api/article";
import { fetchList as categoryList } from "@/api/category";

const statusList = ["待审核", "未发布", "已发布"];

const defaultForm = {
  status: 1,
  category_id: "",
  title: "", // 文章题目
  content: "", // 文章内容
  content_short: "", // 文章摘要
  source_uri: "", // 文章外链
  image_uri: "", // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
};

export default {
  name: "ArticleDetail",
  components: { Tinymce, Upload },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rules: {
        title: [{ required: true, message: "请输入内容", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        author: [{ required: true, message: "请选择状态", trigger: "blur" }],
        category_id: [
          { required: true, message: "请选择分类", trigger: "change" },
        ],
      },
      dataForm: Object.assign({}, defaultForm),
      statusList: statusList,
      tempRoute: {},
      categoryList: [],
    };
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    }
    this.tempRoute = Object.assign({}, this.$route);
    this.getCategory();
  },
  methods: {
    handleSubmit() {
      console.log(this.isEdit);
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          var obj = this.isEdit ? updateArticle : createArticle;
          obj(this.dataForm).then((res) => {
              this.$notify({
                title: "成功",
                message: "发布文章成功",
                type: "success",
                duration: 2000,
              });
              this.$router.push({ path: this.redirect || '/article', query: this.otherQuery })
              this.loading = false;
          }).catch((err) => {
            this.$message.error(err.message)
            this.loading = false;
          })
          
          
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCategory() {
      categoryList("").then((res) => {
        if (res.code == 20000) {
          this.categoryList = res.data;
        }
        console.log(this.categoryList)
      });
    },
    fetchData() {
      const id = this.$route.params && this.$route.params.id;
      detailArticle(id).then((res) => {
        console.log(res);
        if (res.code == 20000) {
          this.dataForm = res.data;
        } else {
          this.$message.error("请求失败");
        }
      }).catch(err => {
         this.$message.error("请求失败");
      });
    },
  },
};
</script>