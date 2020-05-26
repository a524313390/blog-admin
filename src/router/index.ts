import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
import { ifTokenTime } from "../utils";
import NProgress from "nprogress";
import { Message } from "element-ui";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    name: "home",
    meta: { title: "首页", icon: "el-icon-s-home" },
    component: () =>
      import(/* webpackChunkName: "Home" */ "../layout/index.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        hidden: true,
        meta: { title: "首页", icon: "el-icon-s-home" },
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/home/home.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    hidden: true,
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login/login.vue")
  },
  {
    path: "/user",
    name: "user",
    component: () =>
      import(/* webpackChunkName: "user" */ "../layout/index.vue"),
    redirect: "/user/userlist",
    meta: { title: "用户中心", icon: "el-icon-user-solid" },
    children: [
      {
        path: "/user/userlist",
        name: "userlist",
        meta: { title: "用户列表" },

        component: () =>
          import(
            /* webpackChunkName: "userlist" */ "../views/users/userList.vue"
          )
      },
      {
        path: "/user/userdata",
        name: "userdata",
        meta: { title: "用户管理", role: ["admin"] },

        component: () =>
          import(/* webpackChunkName: "userdata" */ "../views/users/users.vue")
      }
    ]
  },
  {
    path: "/tags",
    name: "tags",

    component: () =>
      import(/* webpackChunkName: "tags" */ "../layout/index.vue"),
    redirect: "/tags/tagsList",
    meta: { title: "标签", icon: "el-icon-collection-tag" },
    children: [
      {
        path: "/tags/tagsList",
        name: "tagsList",
        meta: { title: "标签列表" },

        component: () =>
          import(
            /* webpackChunkName: "userlist" */ "../views/tags/tagsList.vue"
          )
      },
      {
        path: "/tags/tagsdata",
        name: "tagsdata",
        meta: { title: "标签管理", role: ["admin"] },

        component: () =>
          import(/* webpackChunkName: "tagsdata" */ "../views/tags/tags.vue")
      }
    ]
  },
  {
    path: "/article",
    name: "article",

    component: () =>
      import(/* webpackChunkName: "article" */ "../layout/index.vue"),
    redirect: "/article/list",
    meta: { title: "文章管理", icon: "el-icon-reading" },
    children: [
      {
        path: "/article/list",
        name: "articleList",
        meta: { title: "文章列表" },

        component: () =>
          import(
            /* webpackChunkName: "articleList" */ "../views/article/articleList.vue"
          )
      },
      {
        path: "/article/add",
        name: "articleAdd",
        meta: { title: "添加文章", role: ["admin"] },

        component: () =>
          import(
            /* webpackChunkName: "articleAdd" */ "../views/article/articleAdd.vue"
          )
      },
      {
        path: "/article/edit",
        name: "articleEdit",
        hidden: true,
        meta: { title: "修改文章", role: ["admin"] },

        component: () =>
          import(
            /* webpackChunkName: "articleEdit" */ "../views/article/articleEdit.vue"
          )
      }
    ]
  },
  {
    path: "/guestbook",
    name: "guestbook",

    component: () =>
      import(/* webpackChunkName: "article" */ "../layout/index.vue"),
    redirect: "/guestbook/list",
    meta: { title: "留言管理", icon: "el-icon-s-comment" },
    children: [
      {
        path: "/guestbook/list",
        name: "guestbookList",
        meta: { title: "留言列表" },

        component: () =>
          import(
            /* webpackChunkName: "articleList" */ "../views/guestbook/guestbook.vue"
          )
      }
    ]
  },
  {
    path: "/image",
    name: "image",

    component: () =>
      import(/* webpackChunkName: "image" */ "../layout/index.vue"),
    redirect: "/image/list",
    meta: { title: "图片管理", icon: "el-icon-folder-opened" },

    children: [
      {
        path: "/image/list",
        name: "imageList",
        meta: { title: "图片列表" },

        component: () =>
          import(
            /* webpackChunkName: "articleList" */ "../views/image/image.vue"
          )
      }
    ]
  },
  {
    path: "/timeLine",
    name: "timeLine",

    component: () =>
      import(/* webpackChunkName: "timeLine" */ "../layout/index.vue"),
    redirect: "/timeLine/list",
    meta: { title: "发表说说", icon: "el-icon-s-flag" },

    children: [
      {
        path: "/timeLine/list",
        name: "timeLineList",
        meta: { title: "发表列表" },

        component: () =>
          import(
            /* webpackChunkName: "timeLineList" */ "../views/timeLine/timeLine.vue"
          )
      }
    ]
  },
  {
    path: "/banner",
    name: "banner",

    component: () =>
      import(/* webpackChunkName: "banner" */ "../layout/index.vue"),
    redirect: "/banner/list",
    meta: { title: "轮播图管理", icon: "el-icon-c-scale-to-original" },

    children: [
      {
        path: "/banner/list",
        name: "bannerList",
        meta: { title: "轮播图管理" },

        component: () =>
          import(
            /* webpackChunkName: "bannerList" */ "../views/banner/banner.vue"
          )
      }
    ]
  },
  {
    path: "/system",
    name: "system",
    meta: { title: "系统设置", icon: "el-icon-s-tools", role: ["admin"] },
    redirect: "/system/systemlist",
    component: () =>
      import(/* webpackChunkName: "system" */ "../layout/index.vue"),
    children: [
      {
        path: "/system/systemlist",
        name: "systemlist",
        meta: { title: "个人信息设置", role: ["admin"] },

        component: () =>
          import(
            /* webpackChunkName: "tagsdata" */ "../views/system/system.vue"
          )
      }
    ]
  },

  {
    path: "/403",
    name: "403",
    hidden: true,
    component: () =>
      import(/* webpackChunkName: "403" */ "../views/403/403.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  const user: any = localStorage.getItem("user_token");
  const userObj: any = JSON.parse(user);

  //如果用户没有登陆，就返回登录页面,如果当前在登录页在直接next()
  if (to.path == "/login") {
    next();
    return;
  } else {
    //用户已经登陆判断逻辑
    //判断当前token是否失效
    if (userObj) {
      let tokenFlag: boolean = ifTokenTime(userObj.exp);
      if (tokenFlag) {
        //每次进入路由的时候都会得到当前路由信息，查看当前路由信息是否有权访问
        if (hasPermission(userObj.username, to)) {
          next();
          return;
        } else {
          next("/403");
          return;
        }
      } else {
        if (to.path != "/login") {
          Message.warning("登陆信息失效，请重新登陆");
        }

        localStorage.removeItem("user_token");
        localStorage.removeItem("token");
        next("/login");
        return;
      }
    }
  }
});
router.afterEach(() => {
  NProgress.done();
});
/**
 * 判断是否有权限
 * @param roles 当前角色
 * @param route 当前路由对象
 * */
function hasPermission(roles: string, route: any) {
  if (route.meta && route.meta.role) {
    // 如果meta.roles是否包含角色的key值,如果包含那么就是有权限,否则无权限
    return route.meta.role.some((role: string) => role.indexOf(roles) >= 0);
  } else {
    // 默认不设置有权限
    return true;
  }
}
export default router;
