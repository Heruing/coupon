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
            <select v-model="selectedType">
                <option disabled value="">선택</option>
                <option
                    v-for="(item, index) in selectList"
                    :key="index"
                    :value="item.value"
                    >{{ item.name }}</option
                >
            </select>
            <div class="button-wrapper">
                <button @click="requestCoupon">발급받기</button>
            </div>
        </div>
    </div>
    <div v-show="isOpenModal" class="modal-background" id="modal-wrapper-background" >
        <div class="modal-outer">
            <div class="modal-wrapper">
                <div class="modal" id="modal-request">
                    <div class="status-message">{{ getMessage }}</div>
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
                            <span class="coupon-column coupon-content coupon-copy" @click="copyClipboard()">클릭</span>
                        </div>
                    </span>
                    <span v-show="!isModalTable" style="margin-left: 10px;">
                        {{ getCode }}
                    </span>
                    <button class="button-close-modal" @click="isOpenModal=false">닫기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            inputUsername: "",
            inputPhonenumber: "",
            selectedType: "",
            selectList:[
                { name: "만우절", value: "event20230401" },
                { name: "신학기", value: "event20230301" },
                { name: "설날", value: "event20230122" },
            ],
            getMessage: "",
            getCode: "",
            isOpenModal:false,
            isModalTable: false,
        }
    },
    methods: {
        requestCoupon() {
            const userdata = {
                userName: this.inputUsername,
                phoneNumber : this.inputPhonenumber,
                couponType : this.selectedType,
            };
            this.axios.post("http://localhost:3000/api", userdata)
                .then((res) => {
                    if (res.data.type === "approve") {
                        this.getMessage = "쿠폰번호가 발급되었습니다.";
                        this.isModalTable = true;
                    } else if (res.data.type === "inapprove") {
                        this.getMessage = "해당 쿠폰에 대한 발급이력이 이미 있습니다.";
                        this.isModalTable = true;
                    } else if (res.data.type === "duplicated") {
                        this.getMessage = "정보가 불일치합니다."
                        this.isModalTable = false;
                    } else if (res.data.type === "error") {
                        alert(this.getCode = res.data.message);
                        return;
                    }
                    this.getCode = res.data.message;
                    this.isOpenModal = true;
                })
                .catch((err) => {
                    console.log(err);
                })
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
        }



        // requestCoupon() {
        //     // node-express 기본 포트인 3000번 포트로 요청합니다.
        //     if (this.inputUsername && this.inputPhonenumber && this.selectedType){
        //         let phonenum = this.inputPhonenumber;
        //         if (phonenum.toString().length < 10) {
        //             alert('휴대전화 번호가 너무 짧습니다.');
        //             return;
        //         }
        //         const userdata = {
        //             userName: this.inputUsername,
        //             phoneNumber : this.inputPhonenumber,
        //             couponType : this.selectedType,
        //         };
        //         this.axios.post("http://localhost:3000/api", userdata)
        //             .then((res) => {
        //                 if (res.data.type === "approve") {
        //                     this.getCode = res.data.message;
        //                     // 4자리씩 표현해주기
        //                     // this.codeWithDelimiter = "";
        //                     // let temp = res.data.split();
        //                 } else {
        //                     alert(this.getCode = res.data.message);
        //                 }
        //             })
        //             .catch((err) => {
        //                 console.log(err);
        //             })
        //     } else {
        //         alert('모든 값을 입력해주세요!');
        //     }
        // },
    },
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