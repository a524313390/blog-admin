import { ActionTree } from "vuex";
import { routes } from "../router";
const actions: ActionTree<any, any> = {
  setUser({ state, commit }, user: any) {
    let newRoute = filterRouter(routes, user.username);
    commit("SET_USER", user);
    commit("SET_ROUTERS", newRoute);
  },
  setMenu({ commit }, menuFlag: boolean) {
    commit("SET_MENU", menuFlag);
  },
  setName({ commit }, name: string) {
    commit("SET_ARTICLE_NAME", name);
  }
};

//把符合role字段的路由筛选出来
let filterRouter = (arr: Array<any>, key: string) => {
  var newArr = arr.filter((item: any) => {
    //如果当前路由存在role，代表需要身份验证
    if (item.meta && item.meta.role) {
      if (item.meta.role.indexOf(key) > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      if (item.children) {
        item.children = filterRouter(item.children, key);
      }
      return true;
    }
  });
  return newArr;
};

export default actions;
