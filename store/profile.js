import TokenStorage from "@/utils/token-storage";
import { getNavByRole } from "@/data/nav";

export const state = () => ({
  data: {},
  nav: [],
});

export const actions = {
  async logIn({ commit, dispatch }, data) {
    try {
      let res = await this.$api.auth.post("login", data);
      TokenStorage.setToken(res);
      dispatch("getProfile");
      this.$router.push("/");
    } catch (err) {
      this.$notify.error(err.response);
    }
  },
  async logOut({ commit, dispatch }) {
    try {
      await this.$api.auth.post("logout");
      TokenStorage.clearToken();
      commit("updUser", {});
      this.$router.push("/auth");
    } catch (err) {
      this.$notify.error(err.response);
    }
  },
  async getProfile({ state, commit, dispatch }) {
    try {
      let res = await this.$api.profile.get("");
      // dispatch("getNav"); // TODO uncomment
      commit("updUser", res.user);
    } catch (err) {
      this.$notify.error(err.response);
    }
    finally {
      dispatch("getNav"); // TODO delete
    }
  },
  async changePassword({ commit }, data) {
    try {
      let res = await this.$api.profile.post("change-password", data);
      this.$notify.success("Пароль был успешно изменен");
    } catch (err) {
      this.$notify.error(err.response);
    }
  },
  async changeEmail({ commit }, data) {
    try {
      const fromData = new FormData();
      for (let i in data) {
        fromData.append(i, data[i]);
      }
      let res = await this.$api.profile.patch("", fromData);
      commit("updEmail", data.email);
      this.$notify.success("Email был успешно изменен");
    } catch (err) {
      this.$notify.error(err.response);
    }
  },
  getNav({ state, commit }) {
    commit("updNav", getNavByRole(state.data.role));
  },
};

export const mutations = {
  updUser(state, data) {
    state.data = data;
  },
  updEmail(state, email) {
    state.data.email = email;
  },
  updNav(state, data) {
    state.nav = data;
  },
};
