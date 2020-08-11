<template>
  <v-layout column justify-center align-center>
    <TableData
      :headers="headers"
      :data="users"
      :defaultItem="defaultItem"
      :isLoad="!isLoading"
      :facility="facility"
      :tableTitle="tableTitle"
      :apiPath="apiPath"
      @pagination="pagination"
    />
  </v-layout>
</template>

<script>
import TableData from "@/components/TableData";
import { headers, defaultItem } from "@/models/users";

import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      headers,
      defaultItem,
      tableTitle: "Пользователи",
      facility: "clients",
      apiPath: "users/clients",
    };
  },
  components: {
    TableData,
  },
  computed: {
    ...mapState({
      users: (state) => state.clients,
      isLoading: (state) => state.isLoading,
    }),
  },
  methods: {
    ...mapActions({
      getData: "getData",
    }),
    pagination(paginationObj) {
      let params = {
        limit: paginationObj.itemsPerPage,
        offset: paginationObj.pageStart,
      };
      this.getData({ facility: this.facility, path: this.apiPath, params });
    },
  },
};
</script>
