<template>
    <v-container fluid>
        <div class="d-flex mb-2">
            <v-btn small color="success" class="mx-2" >Tạo Gmail</v-btn>
        </div>
        <ModalLogs :log="log" ref="ModalLogs" />
    </v-container>
</template>

<script>
import ModalLogs from './components/ModalLogs.vue';
import TableAccount from './components/TableAccount.vue';
import { ipcRenderer } from 'electron';
import lodash from 'lodash';

export default {
    name: 'Home',
    components: {
        TableAccount,
        ModalLogs,
    },
    data() {
        return {
            txtSearch: '',
            listFolder: [],
            folderSelected: null,
            selectedSearchField: 'mail',
            searchField: [
                {
                    text: 'Email',
                    value: 'mail',
                },
                {
                    text: 'Tên',
                    value: 'fname',
                },
                {
                    text: 'Logs',
                    value: 'log',
                },
            ],
            listAccount: [],
            resultSearchAccount: null,
            log: '',
        };
    },
    computed: {
     
    },
    async mounted() {
    },
    methods: {
    },
};
</script>

<style scoped>
.wraper-folder {
    border: 1px solid gray;
    padding: 0px 10px;
    border-radius: 3px;
}
</style>
