import { MutationTree } from "vuex";

const mutations: MutationTree<any> = {
  SET_USER(state: any, user: {}): void {
    state.user = user;
  },
  SET_ROUTERS(state: any, routers: Array<any>): void {
    state.routers = routers;
  },
  SET_MENU(state: any, menuFlag: boolean): void {
    state.menuFlag = menuFlag;
  },
  SET_ARTICLE_NAME(state: any, name: string): void {
    state.artilename = name;
  }
};

export default mutations;
