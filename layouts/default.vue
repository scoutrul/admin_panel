<template>
  <v-app>
    <v-navigation-drawer :mini-variant="miniVariant" fixed app>
      <v-expansion-panels flat hover v-model="panel">
        <v-expansion-panel v-for="(item, i) in nav" :key="i">
          <v-expansion-panel-header @click="openNavbar">
            <v-icon class="accordion-icon">{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
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
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>
    <v-app-bar fixed app>
      <v-btn icon @click.stop="toggleNav">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>

      <nuxt-link to="/" class="tollbar-title-link">
        <v-toolbar-title v-text="title" />
      </nuxt-link>

      <v-spacer />

      <v-btn text @click="clickLogOut">
        <span>{{ $store.state.profile.data.email }}</span>
        <span>Выйти</span>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { getNavByRole } from "@/data/nav";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      panel: null,
      miniVariant: true,
      title: "Title",
    };
  },
  computed: {
    ...mapState({
      nav: (state) => state.profile.nav,
    }),
  },
  watch: {
    panel() {
      localStorage.setItem("openAccordionIndex", this.panel);
    },
  },
  methods: {
    ...mapActions({
      logOut: "profile/logOut",
      getProfile: "profile/getProfile",
    }),
    getOpenAccordionIndex() {
      try {
        const index = localStorage.getItem("openAccordionIndex");
        if (index) {
          this.panel = Number(index);
        }
      } catch (err) {}
    },
    clickLogOut() {
      this.logOut();
    },
    openNavbar() {
      this.miniVariant = false;
      this.setStorageVavbar();
    },
    toggleNav() {
      this.miniVariant = !this.miniVariant;
      if (this.miniVariant) {
        this.panel = [];
      }
      this.setStorageVavbar();
    },
    setStorageVavbar() {
      localStorage.setItem(
        "isOpenNavbar",
        !this.miniVariant ? "open" : "close"
      );
    },
    getStateNavbar() {
      let local = localStorage.getItem("isOpenNavbar") || "close";
      this.miniVariant = local === "open" ? false : true;
    },
  },
  mounted() {
    this.getProfile();
    this.getStateNavbar();
    this.getOpenAccordionIndex();
  },
};
</script>
