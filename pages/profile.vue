<template>
  <div class="settings">
    <div class="settings_info" v-if="user.email">
      <p class="display-1 text--primary">Профиль</p>
      <ul>
        <li><span>Email:</span> {{ user.email }}</li>
        <li v-if="user.name"><span>Имя:</span> {{ user.name }}</li>
        <li v-if="user.surname"><span>Фамилия:</span> {{ user.surname }}</li>
      </ul>
    </div>

    <div class="settings_wrap">
      <v-card class="mx-auto">
        <v-form ref="formPassword">
          <v-card-text>
            <p class="v-toolbar__title text--primary">Изменить пароль</p>
            <div class="text--primary">
              <v-text-field
                type="password"
                v-model="changePass.password"
                label="Новый пароль"
                :rules="[rules.required, rules.minLength]"
              ></v-text-field>
              <v-text-field
                type="password"
                v-model="changePass.passwordDuplicate"
                label="Повтор нового пароля"
                :rules="[rules.required, rules.minLength]"
              ></v-text-field>
            </div>
            <v-card-actions>
              <v-btn color="blue darken-1" @click="sendPass"
                >Изменить пароль</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>

      <v-card class="mx-auto">
        <v-form ref="formEmail">
          <v-card-text>
            <p class="v-toolbar__title text--primary">Изменить Email</p>
            <div class="text--primary">
              <v-text-field
                v-model="changeEmail.email"
                label="Новый Email"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
            </div>
            <v-card-actions>
              <v-btn color="blue darken-1" @click="sendEmail"
                >Изменить email</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      changeEmail: {
        email: "",
      },
      changePass: {
        password: "",
        passwordDuplicate: "",
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
  computed: {
    ...mapState({
      user: (state) => state.profile.data,
    }),
  },
  methods: {
    ...mapActions({
      changeEmailAction: "user/changeEmail",
      changePasswordAction: "user/changePassword",
    }),
    async sendEmail() {
      if (!this.$refs.formEmail.validate()) return;
      await this.changeEmailAction(this.changeEmail);
      this.changeEmail = { email: "" };
    },
    async sendPass() {
      if (!this.$refs.formPassword.validate()) return;
      await this.changePasswordAction(this.changePass);
      this.changePass = { password: "", passwordDuplicate: "" };
    },
  },
};
</script>
