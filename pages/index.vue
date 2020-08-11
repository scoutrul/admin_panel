<template>
  <v-layout column justify-center align-center>
    <div class="dashboard-container">
      <v-card v-for="(item, i) in nav" :key="i">
        <v-card-title class="headline">
          <v-icon>{{ item.icon }}</v-icon>
          <span style="margin-left: 12px;">{{ item.title }}</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(child, i) in item.child"
              :key="i"
              :to="child.to"
              router
              exact
            >
              <v-list-item-content>
                <v-list-item-title
                  v-text="child.title"
                  :style="{ color: child.mark }"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </div>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      items: [],
    };
  },
  computed: {
    ...mapState({
      nav: (state) => state.profile.nav,
    }),
  },
};
</script>
