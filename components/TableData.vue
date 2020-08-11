<template>
  <v-data-table
    :headers="headers"
    :items="data.entities"
    sort-by="calories"
    class="elevation-1 full-width-table"
    :loading="!isLoad"
    :server-items-length="data.totalCount"
    :items-per-page="itemsPerPage"
    :hide-default-footer="hideFooter"
    :footer-props="{ 'disable-items-per-page': true }"
    @pagination="changePagination"
    :key="keyDialog"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="900px">
          <div class="close-dialog" @click="close">
            <svg
              height="329pt"
              viewBox="0 0 329.26933 329"
              width="329pt"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"
              />
            </svg>
          </div>

          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Добавить
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-form ref="form">
                <v-container>
                  <v-row>
                    <template v-for="(field, i) in editedItem">
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                        :key="i"
                        v-if="
                          !editedItem[i].hide &&
                            !(editedIndex === -1 && editedItem[i].readonly)
                        "
                      >
                        <v-file-input
                          v-if="editedItem[i].type === 'image'"
                          accept="image/png, image/jpeg"
                          small-chips
                          :label="editedItem[i].name"
                          :disabled="editedItem[i].disabled"
                          v-model="editedItem[i].value"
                          :rules="getRules(editedItem[i].rules)"
                        >
                          <template v-slot:selection="{ index, text }">
                            <v-chip dark small>
                              {{ editedItem[i].value[64] ? "Uploaded" : text }}
                            </v-chip>
                          </template>
                        </v-file-input>

                        <Autocomplete
                          v-else-if="editedItem[i].type === 'autocomplete'"
                          :label="editedItem[i].name"
                          :multiple="editedItem[i].multiple"
                          :facility="editedItem[i].autocompleteFacility"
                          @change="changeAutocomplete(i, ...arguments)"
                          :selectedValue="
                            editedItem.products ? editedItem.products.value : []
                          "
                          placeholder="Начните вводить название"
                        />


                        <v-select
                          v-else-if="editedItem[i].type === 'select'"
                          :items="editedItem[i].options"
                          :multiple="editedItem[i].multiple"
                          v-model="editedItem[i].value"
                          :label="editedItem[i].name"
                          :rules="getRules(editedItem[i].rules)"
                        ></v-select>

                        <v-select
                          v-else-if="editedItem[i].type === 'checkbox'"
                          :items="[
                            { text: 'Да', value: true },
                            { text: 'Нет', value: false },
                          ]"
                          :multiple="editedItem[i].multiple"
                          v-model="editedItem[i].value"
                          :label="editedItem[i].name"
                        ></v-select>

                        <v-datetime-picker
                          v-if="editedItem[i].type === 'dateTime'"
                          v-model="editedItem[i].value"
                          dateFormat="yyyy-MM-dd"
                          timeFormat="HH:mm"
                          clearText="Очистить"
                          okText="Сохранить"
                          :timePickerProps="{ format: '24hr' }"
                          :datePickerProps="{ locale: 'ru-Ru', min: today }"
                          :label="editedItem[i].name"
                          :textFieldProps="{
                            rules: [
                              rules.dateEnd(
                                i,
                                editedItem[i].value,
                                editedItem.dateTimeStart.value
                              ),
                            ],
                          }"
                        >
                          <template v-slot:timeIcon>
                            <v-icon>mdi-alarm</v-icon>
                          </template>
                          <template v-slot:dateIcon>
                            <v-icon>mdi-calendar</v-icon>
                          </template>
                        </v-datetime-picker>

                        <v-text-field
                          v-else-if="editedItem[i].type === 'email'"
                          v-model="editedItem[i].value"
                          :label="editedItem[i].name"
                          :disabled="editedItem[i].disabled"
                          :rules="getRules(editedItem[i].rules)"
                        ></v-text-field>

                        <template v-else-if="editedItem[i].type === 'password'">
                          <v-text-field
                            v-if="editedIndex === -1"
                            type="password"
                            v-model="editedItem[i].value"
                            :label="editedItem[i].name"
                            :disabled="editedItem[i].disabled"
                            :rules="getRules(editedItem[i].rules)"
                          ></v-text-field>
                        </template>

                        <v-text-field
                          v-else-if="editedItem[i].type === 'number'"
                          type="number"
                          class="input-number"
                          v-model="editedItem[i].value"
                          :label="editedItem[i].name"
                          :disabled="
                            editedItem[i].disabled || editedItem[i].readonly
                          "
                          :rules="getRules(editedItem[i].rules)"
                          @keypress="isNumber"
                          :readonly="editedItem[i].readonly"
                        ></v-text-field>

                        <v-textarea
                          v-else-if="editedItem[i].type === 'textarea'"
                          v-model="editedItem[i].value"
                          :label="editedItem[i].name"
                          :disabled="editedItem[i].disabled"
                          :rules="getRules(editedItem[i].rules)"
                          v-show="
                            checkVisibleField(
                              editedItem,
                              editedItem[i].relationship
                            )
                          "
                        ></v-textarea>

                        <v-text-field
                          v-else-if="editedItem[i].type === 'string'"
                          :items="editedItem[i].options"
                          :multiple="editedItem[i].multiple"
                          v-model="editedItem[i].value"
                          :label="editedItem[i].name"
                          :rules="getRules(editedItem[i].rules)"
                          v-show="
                            checkVisibleField(
                              editedItem,
                              editedItem[i].relationship
                            )
                          "
                        ></v-text-field>

                        <v-text-field
                          v-else-if="
                            editedItem[i].type !== 'select' &&
                              editedItem[i].type !== 'categories' &&
                              editedItem[i].type !== 'password' &&
                              editedItem[i].type !== 'email' &&
                              editedItem[i].type !== 'dateTime' &&
                              editedItem[i].type !== 'image' &&
                              editedItem[i].type !== 'products' &&
                              editedItem[i].type !== 'checkbox' &&
                              editedItem[i].type != 'textarea' &&
                              editedItem[i].type !== 'number' &&
                              editedItem[i].type !== 'autocomplete' &&
                              editedItem[i].type !== 'streamer'
                          "
                          v-model="editedItem[i].value"
                          :label="editedItem[i].name"
                          :disabled="
                            editedItem[i].disabled || editedItem[i].readonly
                          "
                          :rules="getRules(editedItem[i].rules)"
                          :readonly="editedItem[i].readonly"
                        ></v-text-field>
                      </v-col>
                    </template>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="close">Отменить</v-btn>
              <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.created_at="{ item }">
      <span>{{ item.created_at | date }}</span>
    </template>

    <template v-slot:item.dateTimeStart="{ item }">
      <span>{{ item.dateTimeStart | dateTime }}</span>
    </template>

    <template v-slot:item.dateTimeEnd="{ item }">
      <span>{{ item.dateTimeEnd | dateTime }}</span>
    </template>

    <template v-slot:item.headliner="{ item }">
      <v-simple-checkbox v-model="item.headliner" disabled></v-simple-checkbox>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)" title="Редактировать">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)" title="Удалить">
        mdi-delete
      </v-icon>
    </template>

    <template v-slot:no-data>
      Тут пока ничего нет
    </template>

    <template v-slot:footer.page-text="{ pageStart, pageStop, itemsLength }">
      {{ pageStart }} - {{ pageStop }} из {{ itemsLength }}
    </template>
  </v-data-table>
</template>

<script>
const clone = require("rfdc")();
import moment from "moment";

import { mapActions } from "vuex";

import Autocomplete from "@/components/Autocomplete";

export default {
  name: "TableData",
  props: {
    headers: {
      type: Array,
      require: true,
    },
    data: {
      type: Object,
      default: () => { return { entities: [] }}
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
    tableTitle: {
      type: String,
      default: "",
    },
    defaultItem: {
      type: Object,
      require: true,
    },
    isLoad: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: Array,
    },
    streamers: {
      type: Array,
    },
    products: {
      type: Array,
    },
    facility: {
      type: String,
      required: true,
    },
    apiPath: {
      type: String,
      required: true,
    },
  },
  components: {
    Autocomplete,
  },
  data: () => ({
    keyDialog: 0,
    isAutoOpenedFileInput: false,
    dialog: false,
    editedIndex: -1,
    editedItem: {},
    today: moment().format("YYYY-MM-DD"),
    rules: {
      required: (value) => {
        const result =
          typeof value === "array" ? value.trim().length != 0 : !!value;
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
      dateEnd: (key, end, start) => {
        if (key !== "dateTimeEnd" || !start || !end) return true;
        const check = moment(end) - moment(start) > 0;
        return check
          ? true
          : "Дата и время окончания должны быть после даты и времени начала";
      },
      isJson: (value) => {
        try {
          return JSON.parse(value) && !!value;
        } catch (e) {
          return "Должно быть в формате JSON";
        }
      },
    },
    checkVisibleField: (fields, relationship) => {
      if (!relationship) return true;
      return !fields[relationship[0]]
        ? true
        : fields[relationship[0]].value === relationship[1];
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Добавить" : "Редактировать";
    },
    computedCategories() {
      if (!this.categories) return [];
      return this.categories.reduce((a, b) => {
        return [...a, { text: b.title, value: b.id }];
      }, []);
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      if (val) {
        this.disableScrollInputNumber();
      }
    },
  },

  created() {
    this.editedItem = clone(this.defaultItem);
  },

  methods: {
    ...mapActions({
      addOne: "addOne",
      editOne: "editOne",
      deleteOne: "deleteOne",
      getData: "getData",
    }),
    changePagination(paginationObj) {
      this.$emit("pagination", paginationObj);
    },
    setAvatar(field, file) {
      this.editedItem[field].value = file;
    },
    editItem(item) {
      this.editedIndex = this.data.entities.indexOf(item);

      if (this.editedIndex > -1) {
        const newItem = Object.entries(clone(this.defaultItem)).map((elem) => {
          if (elem[0] === "dateTimeStart" || elem[0] === "dateTimeEnd") {
            elem[1].value = new Date(item[elem[0]]);
          } else if (elem[0] === "categories") {
            try {
              elem[1].value = item[elem[0]].reduce((a, b) => {
                return [...a, b.id];
              }, []);
            } catch (err) {}
          } else if (elem[0] === "streamer") {
            try {
              elem[1].value = item[elem[0]].id;
            } catch (err) {}
          } else if (
            (elem[0] === "image" || elem[0] === "smallImage") &&
            !item[elem[0]] &&
            item[`${elem[0]}Url`]
          ) {
            elem[1].value = { 64: item[`${elem[0]}Url`] };
          } else if (elem[0] === "data") {
            elem[1].value = item[elem[0]] ? JSON.stringify(item[elem[0]]) : "";
          } else {
            elem[1].value = item[elem[0]];
          }
          return elem;
        });
        this.editedItem = Object.fromEntries(newItem);
      } else {
        this.editedItem = clone(item);
        console.log("this.editedItem", this.editedItem);
      }

      if (this.editedItem.password) {
        this.editedItem.password.value = "";
      }
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.data.entities.indexOf(item);
      confirm("Вы действительно хотите удалить?") &&
        this.deleteOne({
          facility: this.facility,
          path: this.apiPath,
          index,
          id: item.id,
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = clone(this.defaultItem);
        this.editedIndex = -1;
        this.keyDialog++;
      });
    },

    async save() {
      if (!this.$refs.form.validate()) return;

      const item = Object.entries(this.editedItem).map((item) => {
        item[1] = item[1].value;
        return item;
      });

      let saveAction;

      if (this.editedIndex > -1) {
        saveAction = await this.editOne({
          facility: this.facility,
          path: this.apiPath,
          data: Object.fromEntries(item),
          index: this.editedIndex,
        });
      } else {
        saveAction = await this.addOne({
          facility: this.facility,
          path: this.apiPath,
          data: Object.fromEntries(item),
        });
      }

      if (saveAction) {
        this.close();
      }
    },

    isNumber(evt) {
      evt = evt ? evt : window.event;
      let charCode = evt.which ? evt.which : evt.keyCode;

      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    changeAutocomplete(key, value) {
      this.editedItem[key].value = value;
    },
    getRules(rules) {
      if (!rules) return [];
      return rules.map((item) => this.rules[item]);
    },
    disableScrollInputNumber() {
      setTimeout(() => {
        const inputs = document.querySelectorAll(".input-number input");
        inputs.forEach((input) => {
          input.addEventListener("mousewheel", function(event) {
            this.blur();
          });
        });
      }, 200);
    },
  },
};
</script>
