<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class=""> Cài đặt chung</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="pb-0">
                <v-container>
                    <div class="d-flex align-center">
                        <span style="width: 120px">Database:</span>
                        <v-text-field class="mx-2" dense hide-details outlined v-model="databaseFile"></v-text-field>
                        <v-btn small color="primary" @click="onClickChoseDatabse">Chọn</v-btn>
                    </div>
                    <div class="d-flex align-center my-2">
                        <span style="width: 120px">Chrome Profile:</span>
                        <v-text-field class="mx-2" dense hide-details outlined v-model="chromeProfilePath"></v-text-field>
                        <v-btn small color="primary" @click="onClickChoseChromePath">Chọn</v-btn>
                    </div>

                    <div class="d-flex align-center my-2">
                        <span>Số luồng chạy trình duyệt:</span>
                        <v-text-field style="max-width: 120px" class="mx-2" dense hide-details outlined type="number" v-model="countChromeThread"></v-text-field>
                    </div>
                    <div class="d-flex align-center my-2">
                        <span class="mr-2">Tự động đóng trình duyệt khi chạy xong:</span>
                        <v-checkbox v-model="autoCloseBrowser" dense hide-details="" class="ma-0" color="indigo accent-4"></v-checkbox>
                    </div>
                    <div class="d-flex align-center my-2">
                        <span style="width: 180px">Code Sim Api:</span>
                        <v-text-field class="mx-2" dense hide-details outlined v-model="codeSimApi"></v-text-field>
                    </div>
                    <div class="d-flex align-center my-2">
                        <span style="width: 180px">Cho Thue Sim Code Api:</span>
                        <v-text-field class="mx-2" dense hide-details outlined v-model="choThueSimCodeApi"></v-text-field>
                    </div>
                    <div class="d-flex align-center my-2">
                        <span style="width: 180px">Tinsoft Api:</span>
                        <v-textarea class="mx-2" outlined dense hide-details="" rows="3" v-model="tinsoftApi"> </v-textarea>
                    </div>
                    <div class="d-flex align-center my-2">
                        <span style="width: 180px">TMproxy Api:</span>
                        <v-textarea class="mx-2" outlined dense hide-details="" rows="3" v-model="tmProxyApi"> </v-textarea>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions class="text-center d-block pb-4">
                <v-btn color="light" @click="dialog = false"> Hủy </v-btn>
                <v-btn color="success" class="px-10 ml-3" @click="onSaveSettings"> Lưu </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
const Store = require('electron-store');
const store = new Store();

import { ipcRenderer } from 'electron';
export default {
    data() {
        return {
            dialog: false,
            databaseFile: '',
            chromeProfilePath: '',
            countChromeThread: 0,
            apiSms: '',
            autoCloseBrowser: false,
            codeSimApi: '',
            choThueSimCodeApi: '',
            tinsoftApi: '',
            tmProxyApi: '',
        };
    },
    methods: {
        async onClickChoseDatabse() {
            let result = ipcRenderer.sendSync('File-OpenFile');
            if (result) {
                this.databaseFile = result;
            }
        },
        async onClickChoseChromePath() {
            let result = ipcRenderer.sendSync('File-OpenFolder');
            if (result) {
                this.chromeProfilePath = result;
            }
        },

        onSaveSettings() {
            this.hide();
            store.set('autoCloseBrowser', this.autoCloseBrowser);
            if (this.databaseFile !== store.get('databaseFile')) {
                store.set('databaseFile', this.databaseFile);
                ipcRenderer.sendSync('DB-loadDatabase', this.databaseFile);
            }
            if (this.chromeProfilePath) {
                store.set('chromeProfilePath', this.chromeProfilePath);
            }
            if (this.countChromeThread) {
                store.set('countChromeThread', this.countChromeThread);
            }
            if (this.codeSimApi) {
                store.set('codeSimApi', this.codeSimApi);
            }
            if (this.choThueSimCodeApi) {
                store.set('choThueSimCodeApi', this.choThueSimCodeApi);
            }
            if (this.tinsoftApi) {
                store.set('tinsoftApi', this.tinsoftApi);
            }
            if (this.tmProxyApi) {
                store.set('tmProxyApi', this.tmProxyApi);
            }
        },
        getSettings() {
            if (!store.get('countChromeThread')) {
                store.set('countChromeThread', 5);
            }
            this.databaseFile = store.get('databaseFile') || '';
            this.chromeProfilePath = store.get('chromeProfilePath') || '';
            this.countChromeThread = store.get('countChromeThread') || 2;
            this.codeSimApi = store.get('codeSimApi') || '';
            this.choThueSimCodeApi = store.get('choThueSimCodeApi') || '';
            this.tinsoftApi = store.get('tinsoftApi') || '';
            this.tmProxyApi = store.get('tmProxyApi') || '';
            this.autoCloseBrowser = store.get('autoCloseBrowser') == null ? true : store.get('autoCloseBrowser');
        },
        show() {
            this.dialog = true;
            this.getSettings();
        },
        hide() {
            this.dialog = false;
        },
    },
};
</script>

<style></style>
