<template>
    <el-button
      :loading="downloadLoading"
      :list="list"
      :theader="theader"
      :filterVal="filterVal"
      :filename="filename"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="handleDownload"
    >
      导出
    </el-button>

</template>

<script>
export default {
  name: "Export",
  props: {
    list: {
        type: Array,
        default:[],
    },
    theader: {
        type: Array,
        default() {
            return ['id']
        }
    },
    filterVal: {
        type: Array,
        default() {
            return ['id']
        }
    },
    filename: {
       type: String,
       default: 'export-excel',
    }
  },
  data() {
    return {
      downloadLoading:false,
    }
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = this.theader;
        const filterVal = this.filterVal;
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  },
};
</script>
