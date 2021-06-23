<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 50">
      <el-button type="primary" icon="el-icon-edit" @click="handleCreate"
        >新增</el-button
      >
    </div>
    <el-table
      :data="list"
      v-loading="listLoading"
      border
      highlight-current-row
      fit
      style="width: 100%"
    >
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="auto">
        <template slot-scope="{ row }">
          <el-tag type="primary" v-for="role of row.role" :key="role">{{ row.role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusValue }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作"
        width="230"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(row, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="rules"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dataForm.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="角色" prop="role" width="100%">
          <el-select v-model="dataForm.role" clearable multiple filterable placeholder="请选择角色" width="100%">
            <el-option :label="role.name" :value="role.id" v-for="role of roleList" :key="role.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="dataForm.status" active-text="正常" inactive-text="禁用"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  fetchList,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/category";
const statusList = ["禁用","正常"];

export default {
  name: "Category",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = ["info", "success"];
      return statusMap[status];
    },
    statusValue(status) {
      return statusList[status];
    },
  },
  data() {
    return {
      list: [
        { id: 1, username: 'admin', role:[1,2], name: "dwqdqw", status: 0 },
        { id: 2, username: 'admin', role:[1], name: "dwqdqw", status: 0 },
        { id: 3, username: 'admin', role:[2], name: "dwqdqw", status: 0 },
        { id: 4, username: 'admin', role:[1], name: "dwqdqw", status: 0 },
      ],
      total: 4,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
      },
      dialogFormVisible: false,
      statusList: statusList,
      dataForm: {
        id: undefined,
        name: "",
        username: "",
        status: 0,
        role: "",
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增",
      },
      rules: {
        title: [{ required: true, message: "请输入内容", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      roleList: [{'id': 1, 'name': 'admin'},{'id': 2, 'name': '财务'}, {'id': 3, 'name': '出纳'}],
    };
  },
  created() {},
  methods: {
    getList() {
      this.listLoading = false;
      //   fetchList(this.listQuery).then(response => {
      //     this.list = response.data.items
      //     this.total = response.data.total

      //     // Just to simulate the time of the request
      //     setTimeout(() => {
      //       this.listLoading = false
      //     }, 1.5 * 1000)
      //   })
    },
    resetTemp() {
      this.dataForm = {
        id: undefined,
        name: "",
        username: "",
        status: 0,
        role: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate();
      });
    },
    createData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.dataForm.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.dataForm.title = "vue-element-admin";
          createCategory(this.dataForm).then(() => {
            this.list.unshift(this.dataForm);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleEdit(row) {
      this.dataForm = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate();
      });
    },
    updateData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateCategory(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      deleteCategory(row.id).then((res) => {
        console.log(res)
        this.$notify({
          title: "Success",
          message: "Delete Successfully",
          type: "success",
          duration: 2000,
        });
        this.list.splice(index, 1);
      });
    },
  },
};
</script>
