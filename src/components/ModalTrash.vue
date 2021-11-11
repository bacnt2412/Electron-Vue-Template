<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <v-card>
      <v-card-title>
        <span class="">Account đã xóa</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-container>
          <v-data-table
            v-model="selectedAccoount"
            :items="listAccount"
            :items-per-page="-1"
            :headers="headers"
            :single-select="false"
            :height="$vuetify.breakpoint.height - 400"
            item-key="_id"
            show-select
            fixed-header
            class="elevation-1"
            dense
            id="table-account"
            hide-default-footer
          >
            <template v-slot:[`item.stt`]="{ item }">
              <div>
                {{ listAccount.indexOf(item) + 1 }}
              </div>
            </template>
            <template v-slot:[`item.name`]="{ item }">
              <div class="truncate">
                {{ item.name }}
              </div>
            </template>
            <template v-slot:[`item.email`]="{ item }">
              <div class="truncate">
                {{ item.email }}
              </div>
            </template>
            <template v-slot:[`item.password`]="{ item }">
              <div class="truncate">
                {{ item.password }}
              </div>
            </template>
            <template v-slot:[`item.passwordEmail`]="{ item }">
              <div class="truncate">
                {{ item.passwordEmail }}
              </div>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
      <v-card-actions class="text-center d-block pb-5">
        <v-btn color="light" @click="dialog = false"> Hủy </v-btn>
        <v-btn color="success" class="px-10 ml-3" @click="onSave"> Lưu </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data() {
    return {
      dialog: false,
      headerField: [],
      selectedAccoount: [],
      listAccount: [],
      headers: [
        {
          text: "STT",
          align: "start",
          sortable: false,
          width: 100,
        },
        { text: "Tên Tk", value: "name", width: 100 },
        { text: "Email", value: "email", width: 100 },
        { text: "MK Paypal", value: "password", width: 120 },
        { text: "Mk Email", value: "passwordEmail", width: 120 },
      ],
    };
  },
  methods: {
    async getAccount() {
      try {
        this.listAccount = await ipcRenderer.sendSync("DB-getAccountDeleted");
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          text: error.message,
        });
      }
    },
    onSave() {
      this.hide();
    },
    show() {
      this.getAccount();
      this.headerField = this.$store.state.headerField;
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
  },
};
</script>

<style scoped >
#table-account {
  border: 1px solid gray;
  border-radius: 0px;
}
</style>