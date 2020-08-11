<template>
  <v-autocomplete
    v-model="selected"
    :loading="loading"
    :items="items"
    :search-input.sync="search"
    chips
    cache-items
    hide-no-data
    hide-details
    :label="label"
    item-text="name"
    item-value="value"
    :placeholder="placeholder"
    multiple
    @change="changeValues"
  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        @click="data.select"
        @click:close="remove(data.item)"
      >
        {{ data.item.name }}
      </v-chip>
    </template>

    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title v-html="data.item.name"></v-list-item-title>
        <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapActions } from "vuex";

import debounce from "lodash.debounce";

export default {
  props: {
    label: {
      type: String,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    facility: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    selectedValue: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      items: [],
      search: null,
      selected: [],
    };
  },
  watch: {
    search(val) {
      if (val && val.length > 1) {
        this.querySelections(val, this);
      }
    },
  },
  methods: {
    ...mapActions({
      searchAction: "search",
    }),
    changeValues() {
      this.search = null;
      this.$emit("change", this.selected);
    },
    querySelections: debounce(
      async (val, that) => {
        that.loading = true;
        that.items = await that.searchAction([that.facility, val]); // [{name: 'Название', value: 123}, ...]
        that.loading = false;
      },
      500,
      { maxWait: 1000 }
    ),

    remove(item) {
      const index = this.selected.indexOf(item.value);
      if (index >= 0) this.selected.splice(index, 1);
    },
  },
  mounted() {
    if (this.selectedValue && this.selectedValue.length > 0) {
      this.selected = this.selectedValue.reduce((a, b) => {
        return [...a, b.id];
      }, []);
      this.items = this.selectedValue.reduce((a, b) => {
        return [...a, { value: b.id, name: b.title }];
      }, []);
    }
  },
};
</script>
