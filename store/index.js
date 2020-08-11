import toFormData from "@/utils/toFormData";

export const state = () => ({
  clients: { entities: [] },
  isLoading: false,
});

export const actions = {
  async getData(
    { state, commit, dispatch },
    { facility, path = false, params }
  ) {
    commit("updLoading", true);
    try {
      const res = await this.$api.admin.get(path ? path : facility, { params });
      commit("setData", {
        facility,
        data: {
          entities: res.entities || res.users,
          totalCount: res.totalCount,
        },
      });
    } catch (err) {
      this.$notify.error(err.response);
    } finally {
      commit("updLoading", false);
    }
  },
  async addOne({ state, commit, dispatch }, { facility, path, data = {} }) {
    commit("updLoading", true);
    try {
      const res = await this.$api.admin.post(path, toFormData(data));

      commit("pushOne", { facility, data: { ...data, id: res.id } });

      this.$notify.success("Успешно добавлено");

      return true;
    } catch (err) {
      this.$notify.error(err.response);

      return false;
    } finally {
      commit("updLoading", false);
    }
  },
  async editOne(
    { state, commit, dispatch },
    { facility, path, data = {}, index }
  ) {
    commit("updLoading", true);
    try {
      const res = await this.$api.admin.patch(
        `${path}/${data.id}`,
        toFormData(data)
      );

      commit("mergeItems", { facility, data, index });
      this.$notify.success(`Обновлено`);
      return true;
    } catch (err) {
      this.$notify.error(err.response);

      return false;
    } finally {
      commit("updLoading", false);
    }
  },
  async deleteOne({ state, commit, dispatch }, { facility, path, index, id }) {
    commit("updLoading", true);
    try {
      const res = await this.$api.admin.delete(`${path}/${id}`);

      console.log("res", res);

      commit("deleteItem", { facility, index });
      this.$notify.success(`Удалено`);
    } catch (err) {
      this.$notify.error(err.response);
    } finally {
      commit("updLoading", false);
    }
  },
  async search({}, [facility, value]) {
    try {
      const res = await this.$api.admin.post(`${facility}/search`, {
        title: value,
      });
      return res.entities.map((item) => {
        return { value: item.id, name: item.title };
      });
    } catch (err) {
      this.$notify.error(err.response);
    }
  },
};

export const mutations = {
  setData(state, { facility, data }) {
    state[facility] = data;
  },
  pushOne(state, { facility, data }) {
    state[facility].entities.push(data);
    state[facility].totalCount++;
  },
  mergeItems(state, { facility, data, index }) {
    Object.assign(state[facility].entities[index], data);
  },
  deleteItem(state, { facility, index }) {
    state[facility].entities.splice(index, 1);
    state[facility].totalCount--;
  },
  updLoading(state, status) {
    state.isLoading = status;
  },
};
