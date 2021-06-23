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
      <el-table-column label="标题" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
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
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="temp.status" >
            <el-radio :label="index" v-for="(status,index) in statusList" :key="status">
              {{status}}
            </el-radio>
          
          </el-radio-group>
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
const statusList = ["正常", "禁用", "无效"];

export default {
  name: "Category",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = ["success", "info", "danger"];
      return statusMap[status];
    },
    statusValue(status) {
      return statusList[status];
    },
  },
  
  data() {
    return {
      list: [
        { id: 1, title: "dwqdqw", status: 0 },
        { id: 2, title: "dwqdqw", status: 0 },
        { id: 3, title: "dwqdqw", status: 0 },
        { id: 4, title: "dwqdqw", status: 0 },
      ],
      total: 4,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
      },
      dialogFormVisible: false,
      statusList: statusList,
      temp: {
        id: undefined,
        title: "",
        status: 0,
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
      this.temp = {
        id: undefined,
        title: "",
        status: 0,
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
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.title = "vue-element-admin";
          createCategory(this.temp).then(() => {
            this.list.unshift(this.temp);
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
      this.temp = Object.assign({}, row); // copy obj
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
