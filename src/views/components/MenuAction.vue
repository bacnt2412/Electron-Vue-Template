<template>
    <div>
        <ul style="user-select: none" id="right-click-menu" tabindex="-1" ref="right" v-show="viewMenu" @blur="closeMenu" :style="`top: ${top};left: ${left};`" class="child">
            <li class="li-first" @click="$emit('onUnSelectAll')">
                <img src="https://img.icons8.com/color/24/000000/refund-2--v1.png" />
                Bỏ chọn tất cả
            </li>
            <li @click="onCopyRow('all')">
                <img src="https://img.icons8.com/dusk/24/000000/copy.png" />
                Copy All
            </li>
            <li @click="onCopyRow('mail|authen')">
                <img src="https://img.icons8.com/dusk/24/000000/copy.png" />
                Copy Mail|Authen
            </li>
            <li @click="onCopyRow('mail|passMail')">
                <img src="https://img.icons8.com/dusk/24/000000/copy.png" />
                Mail|passMail
            </li>
            <li @click="onCopyRow('mail|passMail|mailRecovery')">
                <img src="https://img.icons8.com/dusk/24/000000/copy.png" />
                Mail|passMail|mailRecovery
            </li>
            <li @click="onCopyRow('log')">
                <img src="https://img.icons8.com/dusk/24/000000/copy.png" />
                Log
            </li>
            <li @click="onStartAction('REGISTER_MERCH')">
                <img src="https://img.icons8.com/color/24/000000/refund-2--v1.png" />
                Đăng ký Merch
            </li>
            <li @click="onDeleteAccountSelected">
                <img src="https://img.icons8.com/plasticine/24/000000/filled-trash.png" />
                Xóa
            </li>
        </ul>
    </div>
</template>

<script>
import { ipcRenderer, clipboard } from 'electron';
import Vue from 'vue';

export default {
    props: ['selectedAccoount', 'rowAccountSelected', 'listAccount'],
    data() {
        return {
            viewMenu: false,
            top: '0px',
            left: '0px',
        };
    },
    methods: {
        async onDeleteAccountSelected() {
            try {
                let result = await this.$swal.fire({
                    icon: 'question',
                    text: 'Xác nhận xóa tài khoản đã chọn.!',
                    showCancelButton: true,
                });
                if (result && result.isConfirmed) {
                    if (this.selectedAccoount.length > 0) {
                        for (const idAccount of this.selectedAccoount) {
                            await ipcRenderer.sendSync('DB-deleteAccount', {
                                _id: idAccount,
                            });
                        }
                    } else {
                        await ipcRenderer.sendSync('DB-deleteAccount', {
                            _id: this.rowAccountSelected._id,
                        });
                    }
                    this.$emit('reloadAccount');
                }
            } catch (error) {
                this.$swal.fire({
                    icon: 'error',
                    text: error.message,
                });
            }
        },
        async sleep(secound) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, secound * 1000);
            });
        },
        async onStartAction(action) {
            let listAccount = this.listAccount.filter((item) => {
                return this.selectedAccoount.includes(item._id);
            });
            if (listAccount.length > 0) {
                ipcRenderer.send('startPuppeteer', {
                    action: action,
                    accounts: listAccount,
                });
            } else {
                ipcRenderer.send('startPuppeteer', {
                    action: action,
                    accounts: [this.rowAccountSelected],
                });
            }

            this.viewMenu = false;
        },
        onCopyRow(type) {
            let stringCopy = '';

            let listAccount = this.listAccount.filter((item) => {
                return this.selectedAccoount.includes(item._id);
            });
            if (listAccount.length > 0) {
                for (const account of listAccount) {
                    if (type === 'all') {
                        let listAttr = 'name|mail|password|passwordEmail|address|cmndNumber|birthday|phone|note|proxy|securityQuestion|2fa|cookie'.split('|');
                        for (const typex of listAttr) {
                            let data = account[typex] || '';
                            stringCopy += data + '|';
                        }
                    } else {
                        if (type.includes('|')) {
                            let listType = type.split('|').filter((item) => item.trim() !== '');
                            for (const typex of listType) {
                                let data = account[typex] || '';
                                stringCopy += data + '|';
                            }
                            stringCopy = stringCopy.substring(0, stringCopy.length - 1);
                        } else {
                            stringCopy = account[type];
                        }
                    }
                    stringCopy += '\n';
                }
            } else {
                if (type === 'all') {
                    let listAttr = 'name|email|password|passwordEmail|address|cmndNumber|birthday|phone|note|proxy|securityQuestion|2fa|cookie'.split('|');
                    for (const typex of listAttr) {
                        let data = this.rowAccountSelected[typex] || '';
                        stringCopy += data + '|';
                    }
                } else {
                    if (type.includes('|')) {
                        let listType = type.split('|').filter((item) => item.trim() !== '');
                        for (const typex of listType) {
                            let data = this.rowAccountSelected[typex] || '';
                            stringCopy += data + '|';
                        }
                        stringCopy = stringCopy.substring(0, stringCopy.length - 1);
                    } else {
                        stringCopy = this.rowAccountSelected[type] || '';
                    }
                }
            }

            if (stringCopy) {
                clipboard.writeText(stringCopy, 'selection');
            }
            this.closeMenu();
        },
        setMenu: function (top, left) {
            let largestHeight = window.innerHeight - this.$refs.right.offsetHeight - 25;
            let largestWidth = window.innerWidth - this.$refs.right.offsetWidth - 25;
            if (top > largestHeight) top = largestHeight;
            if (left > largestWidth) left = largestWidth;
            this.top = top - 40 + 'px';
            this.left = left + 10 + 'px';
        },
        closeMenu: function () {
            this.viewMenu = false;
        },
        openMenu: function (e, data) {
            this.viewMenu = true;
            Vue.nextTick(
                function () {
                    this.$refs.right.focus();
                    this.setMenu(e.y, e.x);
                }.bind(this)
            );
            e.preventDefault();
        },
    },
};
</script>

<style scoped>
img {
    margin-right: 5px;
}
.parent {
    display: block;
    position: relative;
    line-height: 30px;
}
.parent span {
    color: #ffffff;
    text-decoration: none;
}
.parent:hover > ul {
    display: block;
    position: absolute;
}
.child {
    display: none;
    border: 1px solid rgb(97, 97, 97);
    border-radius: 5px;
    font-size: 14px;
    width: 250px;
}
.li-first {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.li-end {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
.child li {
    background-color: white;
    line-height: 20px;
    width: 100%;
    padding: 10px 10px;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
    align-items: center;
    display: flex;
}
.child li span {
    color: #000000;
}
ul {
    list-style: none;
    margin: 0;
    padding: 0px;
    min-width: 10em;
}
ul ul {
    left: 100%;
    top: 0;
    margin-left: 1px;
}
li:hover {
    background-color: #95b4ca;
}
.parent li:hover {
    background-color: #f0f0f0;
}
.expand {
    font-size: 12px;
    float: right;
    margin-right: 5px;
}

#right-click-menu {
    background: #fafafa;
    border: 1px solid rgb(59, 59, 59) !important;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    width: 230px;
    z-index: 999999;
}
</style>
