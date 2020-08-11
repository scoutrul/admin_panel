<template>
  <div class="auth">
    <v-card width="360">
      <v-card-title>
        <span class="headline">Авторизация</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="formLogin">
          <v-container>
            <v-text-field
              v-model="form.email"
              label="Email"
              :rules="[rules.required, rules.email]"
            ></v-text-field>

            <v-text-field
              label="Пароль"
              v-model="form.password"
              type="password"
              :rules="[rules.required, rules.minLength]"
            ></v-text-field>

            <v-btn color="primary" @click="send">Войти</v-btn>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  layout: "clear",
  data() {
    return {
      form: {
        email: "email@yandex.ru",
        password: "somepass",
      },
      rules: {
        required: (value) => {
          const result = typeof value === "array" ? value.length != 0 : !!value;
          return result || "Обязательное поле";
        },
        minLength: (value) => {
          return value.length >= 6
            ? !!value
            : "Пароль должен быть не менее 6 символов";
        },
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Некорректный email";
        },
      },
    };
  },
  methods: {
    ...mapActions({
      logIn: "profile/logIn",
    }),
    send() {
      if (!this.$refs.formLogin.validate()) return;

      this.logIn(this.form);
    },
  },
};
</script>
