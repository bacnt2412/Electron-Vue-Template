<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="">Cấu hình hiển thị</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-container>
          <table style="width: 100%">
            <tr>
              <td>
                <v-checkbox
                  v-for="item in f1"
                  :key="item.value"
                  hide-details
                  :label="item.label"
                  :value="item.value"
                  v-model="headerField"
                ></v-checkbox>
              </td>
              <td>
                <v-checkbox
                  v-for="item in f2"
                  :key="item.value"
                  hide-details
                  :label="item.label"
                  :value="item.value"
                  v-model="headerField"
                ></v-checkbox>
              </td>
              <td>
                <v-checkbox
                  v-for="item in f3"
                  :key="item.value"
                  hide-details
                  :label="item.label"
                  :value="item.value"
                  v-model="headerField"
                ></v-checkbox>
              </td>
              <td>
                <v-checkbox
                  v-for="item in f4"
                  :key="item.value"
                  hide-details
                  :label="item.label"
                  :value="item.value"
                  v-model="headerField"
                ></v-checkbox>
              </td>
            </tr>
          </table>
        </v-container>
      </v-card-text>
      <v-card-actions class="text-center d-block">
        <v-btn color="light" @click="dialog = false"> Hủy </v-btn>
        <v-btn color="success" class="px-5 ml-3" @click="onSave"> Lưu </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      headerField: [],
      f1: [
        {
          label: "Fname",
          value: "fname",
        },
        {
          label: "Address",
          value: "address",
        },
        {
          label: "City",
          value: "city",
        },
        {
          label: "State",
          value: "state",
        },
      ],
      f2: [
        {
          label: "Zipcode",
          value: "zipcode",
        },
        {
          label: "Phone",
          value: "phone",
        },
        {
          label: "Ssn",
          value: "ssn",
        },
        {
          label: "Visa",
          value: "visa",
        },
      ],
      f3: [
        {
          label: "Mail",
          value: "mail",
        },
        {
          label: "Pass Mail",
          value: "passMail",
        },
        {
          label: "Mail KP",
          value: "mailRecovery",
        },
        {
          label: "Pass Merch",
          value: "passMerch",
        },
      ],
      f4: [
        {
          label: "Bank Name",
          value: "bankName",
        },
        {
          label: "Bank Number",
          value: "bankNumber",
        },
        {
          label: "Routing Name",
          value: "routingName",
        },
        {
          label: "Authen",
          value: "authen",
        },
      ],
    };
  },
  methods: {
    onSave() {
      this.$store.dispatch("setHeaderField", this.headerField);
      this.hide();
    },
    show() {
      this.headerField = this.$store.state.headerField;
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
  },
};
</script>

<style>
</style>