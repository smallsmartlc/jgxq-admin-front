import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    redirect: '/home',
    children: [{
      path: 'home',
      name: '控制台',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制台', icon: 'dashboard' }
    }]
  },

  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/account',
    meta: {
      title: '管理员',
      icon: 'admin'
    },
    children: [
      {
        path: 'account',
        name: 'account',
        component: () => import('@/views/admin/index'),
        meta: { title: '账户管理', icon: 'role' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/admin/role'),
        meta: { title: '角色管理', icon: 'tree' }
      },
    ]
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: '/user',
        name: 'Form',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },

  {
    path: '/team',
    component: Layout,
    meta: {
      title: '球队管理',
      icon: 'team'
    },
    children: [
      {
        hidden : true,
        path: '',
        name: 'teamList',
        meta: { title: '球队列表' },
        component: () => import('@/views/team/index'),
      },
      {
        hidden : true,
        path: 'add',
        name: 'addTeam',
        meta: { title: '添加' },
        component: () => import('@/views/team/add'),
      },
      {
        hidden : true,
        path: ':id',
        name: 'editTeam',
        meta: { title: '编辑' },
        component: () => import('@/views/team/edit'),
      },
      {
        hidden : true,
        path: 'player/:id',
        name: 'teamPlayer',
        meta: { title: '队员' },
        component: () => import('@/views/team/player'),
      },
    ]
  },
  {
    path: '/player',
    component: Layout,
    meta: {
      title: '球员管理',
      icon: 'player'
    },
    children: [
      {
        hidden : true,
        path: '',
        name: 'playerList',
        meta: { title: '球员列表' },
        component: () => import('@/views/player/index'),
      },
      {
        hidden : true,
        path: 'add',
        name: 'addPlayer',
        meta: { title: '添加' },
        component: () => import('@/views/player/add'),
      },
      {
        hidden : true,
        path: 'transfer',
        name: 'transfer',
        meta: { title: '转会' },
        component: () => import('@/views/player/transfer'),
      },
      {
        hidden : true,
        path: ':id',
        name: 'editPlayer',
        meta: { title: '编辑' },
        component: () => import('@/views/player/edit'),
      },
    ]
  },
  {
    path: '/match',
    component: Layout,
    meta: {
      title: '比赛管理',
      icon: 'match'
    },
    children: [
      {
        hidden : true,
        path: '',
        meta: { title: '比赛列表' },
        component: () => import('@/views/match/index'),
      },      
      {
        hidden : true,
        path: 'add',
        name: 'addMatch',
        meta: { title: '添加' },
        component: () => import('@/views/match/add'),
      },
      {
        hidden : true,
        path: ':id',
        name: 'editMatch',
        meta: { title: '编辑' },
        component: () => import('@/views/match/edit'),
      },
    ]
  },
  {
    path: '/news',
    component: Layout,
    meta: {
      title: '新闻管理',
      icon: 'el-icon-document'
    },
    children: [
      {
        hidden : true,
        path: '',
        meta: { title: '新闻列表'},
        component: () => import('@/views/news/index'),
      },
      {
        hidden : true,
        path: ':id',
        name: 'editNews',
        meta: { title: '编辑' },
        component: () => import('@/views/news/edit'),
      },
    ]
  },
  {
    path: '/talk',
    component: Layout,
    meta: {
      title: '闲聊管理',
      icon: 'talk'
    },
    children: [
      {
        hidden : true,
        path: '',
        component: () => import('@/views/talk/index'),
      },
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history',
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
