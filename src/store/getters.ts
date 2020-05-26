import { GetterTree } from "vuex";

const getters: GetterTree<any, any> = {
  user(state: any): {} {
    return state.user;
  },
  routes(state: any): [] {
    return state.routers;
  },
  menuFlag(state: any): boolean {
    return state.menuFlag;
  },
  getArticleName(state: any): string {
    return state.artilename;
  }
};

export default getters;
