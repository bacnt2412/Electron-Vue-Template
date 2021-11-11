<template>
    <v-dialog v-model="dialog" persistent max-width="1000px">
        <v-card>
            <v-card-title>
                <span class="">Logs</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="pb-0">
                <v-container>
                    <v-textarea solo name="input-7-4" :rows="20" v-model="log"></v-textarea>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['log'],
    data() {
        return {
            dialog: false,
        };
    },
    methods: {
        show() {
            this.dialog = true;
        },
        hide() {
            this.dialog = false;
        },
    },
};
</script>

<style></style>
