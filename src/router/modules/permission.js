import Layout from '@/layout'

const permissionRouter = {
    name: 'Permission',
    component: Layout,
    path: '/permission',
    redirect: 'noRedirect',
    meta: {title: '权限管理', icon: 'lock'},
    children: [
        {
            path: 'admins',
            component: () => import('@/views/permission/admin'),
            name: 'AdminPermission',
            meta: {title: '管理员', icon: 'el-icon-s-custom'}
        }, 
        {
            path: 'roles',
            component: () => import('@/views/permission/role'),
            name: 'RolePermission',
            meta: {title: '角色管理', icon: 'el-icon-user-solid'}
        },
        {
            path: 'menu',
            component: () => import('@/views/permission/menu'),
            name: 'MenuPermission',
            meta: {title: '路由管理', icon: 'tree'}
        },
        {
            path: 'logs',
            component: () => import('@/views/permission/log'),
            name: 'LogPermission',
            meta: {title: '操作日志', icon: 'el-icon-s-operation'}
        },
    ],
}

export default permissionRouter