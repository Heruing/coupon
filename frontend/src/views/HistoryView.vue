<template>
    <div class="content-outer">
        <div class="content-wrapper">
            <div class="header-text">
                <h1 style="text-align: center;">쿠폰 조회</h1>
            </div>
            <div class="input-label" style="margin-top:10px">이름</div>
            <input v-model="inputUsername" id="inputUsername" type="text" placeholder="이름을 입력하세요." @keypress.enter="requestCouponHistory">
            <div class="input-label" style="margin-top:10px">휴대전화</div>
            <input v-model="inputPhonenumber" id="inputPhonenumber" type="text" maxlength="11" placeholder="숫자만 입력하세요." v-on:input="checkInput" @keypress.enter="requestCouponHistory">
            <div class="button-wrapper">
                <button @click="requestCouponHistory" style="margin-top: 105px;">확인하기</button>
            </div>
        </div>
    </div>
    
    <div v-show="openHistoryModal" class="modal-background" id="modal-history-wrapper-background" @onclick="isModalTable=false">
    </div>
    <div class="modal-outer">
        <transition name="modalRight">
            <div v-show="openHistoryModal" class="modal-wrapper" id="modal-history-wrapper">
                <span class="status-header"><h1>{{ getType }}</h1></span>
                <div class="modal" id="modal-history">
                    <span v-if="isModalTable" v-show="isModalTable">
                        <div class="status-message"><span style="color: rgb(255, 80, 0)">{{ inputUsername }}</span>님의 쿠폰 발급 기록입니다.</div>
                        <div class="coupon-tab coupon-header" id="coupon-header">
                            <span class="coupon-column coupon-head coupon-index">구분</span>
                            <span class="coupon-column coupon-head coupon-code">쿠폰 번호</span>
                            <span class="coupon-column coupon-head coupon-type">종류</span>
                            <span class="coupon-column coupon-head coupon-created">생성일자</span>
                            <span class="coupon-column coupon-head coupon-copy">복사</span>
                        </div>
                        <div class="modal-content-wrapper">
                            <div class="coupon-tab coupon-content" id="coupon-content" v-for="(item, index) in getMessage">
                                <span class="coupon-column coupon-index">{{ index+1 }}</span>
                                <span class="coupon-column coupon-code">
                                    <span class="coupon-slpit" v-for="idx in Math.floor(item.coupon_code.length / 4)">
                                        <span class="coupon-slpiter" v-if="idx - 1">-</span>
                                        {{ item.coupon_code.slice((idx-1) * 4, (idx) * 4) }}
                                    </span>
                                </span>
                                <span class="coupon-column coupon-type">{{ couponTypes[item.coupon_type] }}</span>
                                <span class="coupon-column coupon-created">{{ item.created_at.slice(0,10) }}</span>
                                <span class="coupon-column coupon-copy" @click="copyClipboard(item.coupon_code)">●</span>
                            </div>
                        </div>
                    </span>
                    <span v-show="!isModalTable" class="status-message">
                        {{ getMessage }}
                    </span>
                </div>
                <button class="button-close-modal" @click="openHistoryModal=false">닫기</button>
            </div>
        </transition>
    </div>
</template>

<script>
import { inject } from "vue";

export default {
    data() {
        return {
            inputUsername: "",
            inputPhonenumber: "",
            openHistoryModal: false,
            isModalTable: false,
            getType:"",
            getMessage:"",
            couponTypes: {},
        }
  },
    methods: {
        requestCouponHistory() {
            const userdata = {
                userName: this.inputUsername,
                phoneNumber : this.inputPhonenumber,
            };
            if (this.inputUsername && this.inputPhonenumber) {
                this.axios.post("http://localhost:3000/api/history", userdata)
                    .then((res) => {
                        if (res.data.type === "error") {
                            this.getType = "ERROR";
                            this.getMessage = res.data.message;
                            return;
                        } else if (res.data.type === "none") {
                            this.getType = "확인";
                            this.getMessage = res.data.message;
                            this.isModalTable = false;
                        } else if (res.data.type === "history") {
                            this.getType = "발급 이력";
                            this.getMessage = res.data.message;
                            this.isModalTable = true;
                            this.openHistoryModal = true;
                        } else if (res.data.type === "unmatched") {
                            this.getType = "오류";
                            this.getMessage = res.data.message;
                            this.isModalTable = false;
                        } 
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } else {
                this.getType = "오류";
                this.getMessage = "모든 값을 입력해주세요.";
                this.isModalTable = false;
            }
            this.openHistoryModal = true;
        },
        copyClipboard(code) {
            const element = document.createElement('textarea');
            element.value = code;
            element.setAttribute('readonly', '');
            element.style.position = 'absolute';
            element.style.left = '-9999px';
            document.body.appendChild(element);
            element.select();
            document.execCommand('copy');
            document.body.removeChild(element);
        },
        checkInput() {
            const str = this.inputPhonenumber;
                if (this.inputPhonenumber === str.replace(/\D/g, '')) {
                } else {
                    this.inputPhonenumber = str.replace(/\D/g, '');
                }
        },
    },
    mounted() {
        document.body.style.transform = "rotateY(-1deg)";
        document.body.style.backgroundImage = "url('https://newsroom.smilegate.com/s3/multi/destroyer_3840x2160.jpg')";
        for (let i=0; i < inject("couponTypes").length; i++) {
            this.couponTypes[inject("couponTypes")[i].coupon_type] = inject("couponTypes")[i]["coupon_name"];
        }
    }
}
</script>

<style scoped>
@import '/src/assets/modal.css';
@media (min-width:600px) {
    .coupon-index {
        width: 8%;
    }
    .coupon-code {
        width: 38%;
    }
    .coupon-type {
        width: 28%;
    }
    .coupon-created {
        width: 18%;
    }
    .coupon-copy {
        width: 8%;
    }
}
@media (max-width:600px) {
    .coupon-index {
        display: none;
    }
    .coupon-code {
        width: 84%;
    }
    .coupon-type {
        display: none;
    }
    .coupon-created {
        display: none;
    }
    .coupon-copy {
        width: 16%;
    }
}


</style>