<template>
  <div class="app-container">
      <el-button type="primary" @click="handleAddMenu">新增</el-button>
      <el-button type="danger" @click="handleDelMenu">删除</el-button>
    <el-table
      :data="routes"
      ref="multipleTable" 
      style="width: 100%; margin-bottom: 20px"
      border
      fit
      row-key="path"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @select="rowSelect" 
      @select-all="selectAll" 
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="title" label="标题" width="180">
      </el-table-column>
      <el-table-column prop="path" label="路由" width="180">
      </el-table-column>
      <el-table-column label="操作" width="180">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="danger" size="small" icon="">删除</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import path from 'path'
import { getRoutes } from '@/api/role'

export default {
  data() {
    return {
      routes: [],
    };
  },
  created() {
     this.getRoutes()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes();
      this.routes = this.generateRoutes(res.data);
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    filterSelect(selection) {
      let arr = [];
　　　　// 循环children取值
      function filterData(val){
        arr.push(val)
        if (val.children) {
          val.children.map(item => {
            filterData(item)
          })
        }
      }
　　　　// 源数据中取出选中的数据
      this.routes.map(item => {
        selection.map(val => {
          if (val.path === item.path) {
            filterData(val)
          }
        })
      })
      return arr
    },
    selectAll(selection) {
      let arr = this.filterSelect(selection)
      // 正反选， 过滤后有值勾选，空值清除所有，
      if (arr.length) {
        this.toggleSelection(arr)
      } else {
        // 清除所有
        this.$refs.multipleTable.clearSelection(selection);
      }
    },
    rowSelect(selection, row) {
      let selectArr = []
      if (selectArr.indexOf(row) === -1) {
        selectArr = this.filterSelect(selection)
        // 正反选， 过滤后有值勾选，空值清除所有，
        if (selectArr.length) {
          this.toggleSelection(selectArr)
        } else {
          // 清除所有
          this.$refs.multipleTable.clearSelection(selection);
        }
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
　　　　　　// toggleRowSelection有两个参数，第一个是每个选中数据，第二个是点击勾选的这行是否选中，树形结构需要，不然子集选中，本身不给选中
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleAddMenu() {

    },
    handleDelMenu() {
        let data = this.$refs.multipleTable.selection
        let list = [];
        data.map(item => {
            list.push(item.path)
        })
        console.log(list.join(','));
        
    }
  },
};
</script>