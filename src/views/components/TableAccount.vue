<template>
    <div>
        <v-data-table
            :items="listAccount"
            :items-per-page="100"
            :height="$vuetify.breakpoint.height - 200"
            :headers="getHeader"
            :single-select="false"
            item-key="_id"
            fixed-header
            class="elevation-1"
            dense
            id="table-account"
            :footer-props="{
                'items-per-page-options': [100, 500, 1000, -1],
            }"
            hide-default-header
        >
            <template #header="{ props: { headers } }">
                <thead class="v-data-table-header">
                    <tr>
                        <th v-for="header in headers" :key="header.value" class="text-uppercase text-center" scope="col">
                            <span v-if="header.text !== 'Chọn'"> {{ header.text }} </span>
                            <span v-else>
                                <input style="cursor: pointer" type="checkbox" v-model="checkAll" />
                                Chọn</span
                            >
                        </th>
                    </tr>
                </thead>
            </template>
            <template v-slot:[`item`]="{ item, index }">
                <tr @contextmenu="openMenu(item)" ref="rowTable" @mousedown="onMouseDown(item._id)" @mouseover="onMouseOver(item._id)" @mouseup="onMouseup(item._id)" :key="selectedAccoount.includes(item._id) + 'row' + item._id" :class="{ 'row-selected': selectedAccoount.includes(item._id) }">
                    <td @click="onSelectAccount(item._id)" style="cursor: pointer; text-align: center">
                        <input style="cursor: pointer" type="checkbox" v-model="selectedAccoount" :value="item._id" />
                    </td>
                    <td>
                        <div class="text-center">
                            {{ index + 1 }}
                        </div>
                    </td>

                    <td v-for="headerFiel in getHeader.filter((item) => item.value !== 'stt').filter((item) => item.value !== 'select')" :key="headerFiel.value">
                        <div class="truncate">
                            {{ item[headerFiel.value] }}
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <MenuAction @onUnSelectAll="onUnSelectAll" :rowAccountSelected="rowAccountSelected" :selectedAccoount="selectedAccoount" :listAccount="listAccount" ref="MenuAction" @reloadAccount="$emit('reloadAccount')" />
    </div>
</template>

<script>
import MenuAction from './MenuAction.vue';
var isMouseDown = false;
export default {
    props: ['listAccount'],
    components: {
        MenuAction,
    },
    data() {
        return {
            listFieldHeaderMap: {
                stt: 'STT',
                name: 'Tên Tk',
                email: 'Email',
                password: 'MK Paypal',
                passwordEmail: 'Mk Email',
                amount: 'Số dư',
                history: 'Lịch sử',
                resultKTGD: 'Kết Quả KTGD',
                resultLimit: 'KT Limits',
                countTransaction: 'Số giao dịch',
                status: 'Tình trạng',
                idTransaction: 'ID giao dịch',
                mailReceive: 'Mail nhận',
                dateCreate: 'Ngày tạo',
                address: 'Địa chỉ',
                cmndNumber: 'Số CMND',
                birthday: 'Ngày sinh',
                phone: 'Số phone',
                note: 'Note tạm',
                proxy: 'IP Proxy',
                ttVeryMail: 'TT Very Mail',
                securityQuestion: 'Câu hỏi BM',
                '2fa': '2FA',
                cookie: 'Cookie',
                log: 'Log',
            },
            rowAccountSelected: null,
            selectedAccoount: [],
            checkAll: false,
        };
    },
    computed: {
        getHeader() {
            let headers = [
                {
                    text: 'Chọn',
                    align: 'center',
                    sortable: false,
                    width: 30,
                    value: 'select',
                    width: 100
                },
                {
                    text: 'STT',
                    align: 'start',
                    sortable: false,
                    value: 'stt',
                    width: 100
                },
                { text: 'Fname', value: 'fname', width: 100 },
                { text: 'Address', value: 'address', width: 100 },
                { text: 'City', value: 'city', width: 120 },
                { text: 'State', value: 'state', width: 120 },
                { text: 'Zipcode', value: 'zipcode', width: 120 },
                { text: 'Phone', value: 'phone', width: 120 },
                { text: 'Ssn', value: 'ssn', width: 120 },
                { text: 'Visa', value: 'visa', width: 120 },
                { text: 'Mail', value: 'mail', width: 120 },
                { text: 'Pass Mail', value: 'passMail', width: 120 },
                { text: 'Mail KP', value: 'mailRecovery', width: 120 },
                { text: 'Pass Merch', value: 'passMerch', width: 120 },
                { text: 'Bank Name', value: 'bankName', width: 120 },
                { text: 'Bank Number', value: 'bankNumber', width: 140 },
                { text: 'Routing Name', value: 'routingName', width: 140 },
                { text: 'Authen', value: 'authen', width: 120 },
                {
                    text: 'Log',
                    value: 'log',
                    width: 100,
                },
            ];
            headers = headers.filter((item) => {
                return this.$store.state.headerField.includes(item.value);
            });
            headers.splice(0, 0, {
                text: 'Chọn',
                align: 'center',
                sortable: false,
                width: 30,
                value: 'select',
            });
            headers.splice(1, 0, {
                text: 'STT',
                align: 'center',
                sortable: false,
                value: 'stt',
                width: 30,
            });
            headers.push({
                text: 'Log',
                value: 'log',
                width: 100,
            });
            return headers;
        },
        headerField() {
            return this.$store.state.headerField;
        },
    },
    methods: {
        onUnSelectAll() {
            this.selectedAccoount = [];
            this.$refs.MenuAction.closeMenu();
        },
        onSelectAccount(id) {
            if (this.selectedAccoount.includes(id)) {
                this.selectedAccoount = this.selectedAccoount.filter((item) => item != id);
            } else {
                this.selectedAccoount.push(id);
            }
        },
        onMouseDown(id) {
            if (event.which === 3) {
                return;
            }
            isMouseDown = true;
            if (!this.selectedAccoount.includes(id)) {
                this.selectedAccoount.push(id);
            }
        },
        onMouseOver(id) {
            if (isMouseDown && !this.selectedAccoount.includes(id)) {
                this.selectedAccoount.push(id);
            }
        },
        onMouseup(id) {
            isMouseDown = false;
        },
        resetSelectedAccount() {
            this.selectedAccoount = [];
        },
        async onDeleteAccount() {
            try {
                let result = await this.$swal.fire({
                    icon: 'question',
                    text: 'Xác nhận xóa những account đã chọn.!',
                    showCancelButton: true,
                });
                if (result && result.isConfirmed) {
                    for (const idAccountDelete of this.selectedAccoount) {
                        await ipcRenderer.sendSync('DB-deleteAccount', {
                            _id: idAccountDelete._id,
                        });
                    }
                    await this.getAccount();
                    this.selectedAccoount = [];
                }
            } catch (error) {
                this.$swal.fire({
                    icon: 'error',
                    text: error.message,
                });
            }
        },
        openMenu(data) {
            this.rowAccountSelected = data;
            this.$refs.MenuAction.openMenu(event, data);
        },
    },
    watch: {
        checkAll() {
            this.selectedAccoount = [];
            if (this.checkAll) {
                for (const acc of this.listAccount) {
                    this.selectedAccoount.push(acc._id);
                }
            }
        },
    },
};
</script>

<style scoped>
#table-account {
    border: 1px solid gray;
    border-radius: 0px;
}
#virtual-scroll-table {
    max-height: 600px;
    overflow: auto;
}
.truncate {
    max-width: 20vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* user-select: none; */
}
.row-selected {
    background: #9bd4ff !important;
}
</style>
