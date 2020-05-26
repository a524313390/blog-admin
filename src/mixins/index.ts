import { Component, Mixins, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
@Component
export class EditAuth extends Vue {
  @Getter user: any;
  get editFlag(): boolean {
    return this.user.username == "admin" ? true : false;
  }
}
