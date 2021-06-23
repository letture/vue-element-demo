<template>
  <div class="app-container">
    <el-row>
        <el-col :span="12" :offset="6">
      <el-form
        ref="resetForm"
        :model="resetForm"
        :rules="resetRules"
        auto-complete="on"
        label-width="80"
      >
        <el-form-item label="密码" prop="password">
          <el-input v-model="resetForm.password" type="password" name="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="resetForm.newPassword" type="password" name="newPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="submit('resetForm')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    return {
      resetForm: {
        password: "",
        newPassword: "",
      },
      resetRules: {
        password: [
          { required: true, trigger: "blur", validator: validatePass },
        ],
        newPassword: [
          { required: true, trigger: "blur", validator: validatePass },
        ],
      },
      loading: false,
    };
  },
  methods: {
    submit() {
      console.log(this.$refs);
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/reset", this.resetForm)
            .then(() => {
              this.$router.push("/");
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
