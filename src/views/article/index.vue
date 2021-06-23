<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="fliter-left">
        <router-link :to="'/article/add'">
          <el-button type="primary" icon="el-icon-edit">新增</el-button>
        </router-link>
      </div>
      <div class="filter-right">
        <el-input
          v-model="listQuery.title"
          placeholder="Title"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.status"
          placeholder="状态"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="(item, index) in statusList"
            :key="item"
            :label="item"
            :value="index"
          />
        </el-select>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
        <Export
      :list="list"
      :theader="theader"
      :filterVal="filterVal"
      :filename="filename"/>
      </div>
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
      <el-table-column label="分类">
        <template slot-scope="{ row }">
          <span>{{ categoryFilter(row.category_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
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
          <router-link :to="'/article/edit/' + row.id" style="margin: 0 10px">
            <el-button type="primary" size="mini"> 编辑 </el-button>
          </router-link>
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/SingleImage3";
import { fetchList as articleList, deleteArticle } from "@/api/article";
import { fetchList as categoryList } from "@/api/category";
import Export from "@/components/Export";

const statusList = ["待审核", "未发布", "已发布"];
const theader = ["ID", "标题", "分类", "作者", "状态"];
const filterVal = ["id", 'title', 'category_id', 'author', 'status'];
export default {
  name: "Category",
  components: { Pagination, Tinymce, Upload, Export },
  filters: {
    statusFilter(status) {
      const statusMap = ["warning", "info", "success"];
      return statusMap[status];
    },
    statusValue(status) {
      return statusList[status];
    },
  },
  
  data() {
    return {
      list: [
        { id: 1, title: "dwqdqw", status: 0, author: "2018", category_id: 123 },
        {
          id: 2,
          title: "dwqdqw",
          status: 1,
          author: "20181",
          category_id: 1,
        },
        {
          id: 3,
          title: "dwqdqw",
          status: 2,
          author: "20181",
          category_id: 1,
        },
        {
          id: 4,
          title: "dwqdqw",
          status: 0,
          author: "20181",
          category_id: 2,
        },
      ],
      total: 4,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        title: "",
        status: "",
        sort: "",
      },
      categoryList: [],
      statusList: statusList,
      //导出
      theader:theader,
      filterVal:filterVal,
      filename:"文章列表"
    };
  },
  created() {
    this.getCategory();
    this.getList();
  },

  methods: {
    getList() {
      this.listLoading = false;
      articleList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
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
    handleDelete(row, index) {
      deleteArticle(row.id).then((res) => {
        this.$notify({
          title: "Success",
          message: "Delete Successfully",
          type: "success",
          duration: 2000,
        });
        this.list.splice(index, 1);
      });
    },
    categoryFilter(status) {
      for (var item of this.categoryList) {
        if (status == item.id) {
          return item.title;
        }
      }
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    
  },
};
</script>
