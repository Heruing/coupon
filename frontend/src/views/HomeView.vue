<template>
    <div class="content-outer">
        <div class="content-wrapper">
            <div class="header-text">
                <h1 style="text-align: center;">쿠폰 발급</h1>
            </div>
            <div class="input-label" style="margin-top:10px">이름</div>
            <input v-model="inputUsername" id="inputUsername" type="text" placeholder="이름을 입력하세요." @keypress.enter="requestCoupon">
            <div class="input-label" style="margin-top:10px">휴대전화</div>
            <input v-model="inputPhonenumber" id="inputPhonenumber" type="text" maxlength="11" placeholder="숫자만 입력하세요." v-on:input="checkInput" @keypress.enter="requestCoupon">
            <div class="input-label" style="margin-top:10px">쿠폰종류</div>
            <div class="selectBox" @click="isSelectOpen=!isSelectOpen">
                <span v-if="selectedType ">{{ selectedName }}</span>
                <span v-if="!selectedType ">선택해주세요</span>
            </div>
            
            <div v-show="isSelectOpen" class="select-option-wrapper">
                    <div
                        class="select-option"
                        v-for="(item, index) in selectList"
                        :key="index"
                        :value="item.coupon_type"
                        @click="changeType(item.coupon_type, item.coupon_name)"
                        >{{ item.coupon_name }}</div
                    >
                </div>
            <div class="button-wrapper">
                <button @click="requestCoupon">발급받기</button>
            </div>
        </div>
    </div>
    <div v-show="isOpenModal" class="modal-background" id="modal-wrapper-background" @click="isOpenModal=false">
    </div>
    <div class="modal-outer">
        <transition name="modalLeft" appear>
            <div v-show="isOpenModal"  class="modal-wrapper">
                <div class="modal" id="modal-request">
                    <div class="status-header"><h1>{{ statusHeader }}</h1></div>
                    <span v-if="isModalTable" v-show="isModalTable">
                        <div class="coupon-tab coupon-header">
                            <span class="coupon-column coupon-head coupon-code">쿠폰 번호</span>
                            <span class="coupon-column coupon-head coupon-copy">복사</span>
                        </div>
                        <div class="coupon-tab coupon-content">
                            <span class="coupon-column coupon-content coupon-code">
                                <span class="coupon-slpit" v-for="idx in Math.floor(getCode.length / 4)">
                                    <span class="coupon-slpiter" v-if="idx - 1">-</span>
                                    {{ getCode.slice((idx-1) * 4, (idx) * 4) }}
                                </span>
                            </span>
                            <span class="coupon-column coupon-content coupon-copy" @click="copyClipboard()">●</span>
                        </div>
                    </span>
                    <span v-show="!isModalTable" class="status-message">
                        {{ getCode }}
                    </span>
                    <button class="button-close-modal" @click="isOpenModal=false">닫기</button>
                </div>
            </div>
        </transition>
    </div>
</template>



<script>
import { inject } from "vue";

export default {
    data () {
        return {
            inputUsername: "",
            inputPhonenumber: "",
            selectedName: "",
            selectedType: "",
            selectList: "",
            statusHeader: "",
            getCode: "",
            isOpenModal:false,
            isModalTable: false,
            isSelectOpen: false,
        }
    },
    methods: {
        requestCoupon() {
            if (this.inputUsername && this.inputPhonenumber && this.selectedType){
                if (this.inputPhonenumber.length < 10) {
                    this.statusHeader = "오류"
                    this.getCode = "휴대전화 번호가 너무 짧습니다.";
                    this.isModalTable = false;
                    return;
                }
                const userdata = {
                    userName: this.inputUsername,
                    phoneNumber : this.inputPhonenumber,
                    couponType : this.selectedType,
                };
                this.axios.post("http://localhost:3000/api", userdata)
                    .then((res) => {
                        if (res.data.type === "approve") {
                            this.statusHeader = "쿠폰이 발급되었습니다.";
                            this.isModalTable = true;
                        } else if (res.data.type === "inapprove") {
                            this.statusHeader = "이미 받은 쿠폰입니다.";
                            this.isModalTable = true;
                        } else {
                            this.statusHeader = "오류"
                            this.isModalTable = false;
                        }
                        this.getCode = res.data.message;
                    })
                    .catch((err) => {
                        console.log(err);
                        return;
                    })
                } else {
                    this.statusHeader = "오류"
                    this.getCode = "모든 값을 입력해주세요.";
                    this.isModalTable = false;
                }
            this.isModalTable = false;
            this.isOpenModal = true;
        },
        checkInput() {
            const str = this.inputPhonenumber;
                if (this.inputPhonenumber === str.replace(/\D/g, '')) {
                } else {
                    this.inputPhonenumber = str.replace(/\D/g, '');
                }
        },
        copyClipboard() {
            const element = document.createElement('textarea');
            element.value = this.getCode;
            element.setAttribute('readonly', '');
            element.style.position = 'absolute';
            element.style.left = '-9999px';
            document.body.appendChild(element);
            element.select();
            document.execCommand('copy');
            document.body.removeChild(element);
        },
        changeType(type, name) {
            this.selectedType = type;
            this.selectedName = name;
            this.isSelectOpen = false;
        }
    },
    beforeMount() {
        this.selectList = inject("couponAvailables");
    },
    mounted() {
        document.body.style.transform = "rotateY(1deg)";
        document.body.style.backgroundImage = "url('https://d2x8kymwjom7h7.cloudfront.net/live/application_no/96001/default/COMMUNITY/10281f50220846e9a21feef67fae6ac8/4c0dc883ef174ff2a053dea06432803f.png')";
    }
}

</script>


<style scoped>
@import '/src/assets/modal.css';
.button-wrapper {
    margin-top: 10px;
}
.coupon-code {
    width: 84%;
}
.coupon-copy {
    width: 16%;
}
</style>