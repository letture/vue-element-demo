import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import permissionRouter from './modules/permission'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/reset',
    component: Layout,
    redirect: '/reset/index',
    children: [{
      path: 'index',
      name: "Reset",
      component: () => import('@/views/user/reset'),
      meta: { title: '重置密码', icon: 'dashboard' }
    }],
    hidden: true,
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/category',
    name: 'Category',
    component: Layout,
    redirect: '/category/index',
    meta: { title: '分类管理', icon: 'tree'},
    children: [
      {
        path: 'index',
        name: 'Category',
        component: () => import('@/views/category/index'),
        meta: {title: '分类列表'},
      },
      {
        path: 'add',
        name: 'CategoryAdd',
        meta: {title: '分类新增'},
        hidden: true
      },
      {
        path: 'edit',
        name: 'CategoryEdit',
        meta: {title: '分类编辑'},
        hidden: true
      },
      {
        path: 'delete',
        name: 'CategoryDelete',
        meta: {title: '分类删除'},
        hidden: true
      }
    ]
  },

  {
    path: '/article',
    name: 'Article',
    component: Layout,
    redirect: '/article/index',
    meta: { title: '文章管理', icon: 'el-icon-collection'},
    children: [
      {
        path: 'index',
        name: 'Article',
        component: () => import('@/views/article/index'),
        meta: {title: '文章列表'},
      },
      {
        path: 'add',
        name: 'ArticleAdd',
        component: () => import('@/views/article/add'),
        meta: {title: '文章新增'},
        hidden: true
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'ArticleEdit',
        component: () => import('@/views/article/edit'),
        meta: {title: '文章编辑'},
        hidden: true
      },
      
    ]
  },
  permissionRouter,
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router