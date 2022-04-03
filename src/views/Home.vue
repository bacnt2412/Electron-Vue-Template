<template>
    <v-container fluid>
        <div class="d-flex mb-2">

            <v-btn small color="success" class="mx-2">Tạo Gmail</v-btn>
            
        </div>
    </v-container>
</template>

<script>
import { ipcRenderer } from 'electron';
import lodash from 'lodash';

export default {
    name: 'Home',
    components: {
    },
    data() {
        return {
        };
    },
    computed: {},
    async mounted() {},
    methods: {},
};
</script>

<style scoped>
.wraper-folder {
    border: 1px solid gray;
    padding: 0px 10px;
    border-radius: 3px;
}
</style>
