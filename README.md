# 과제

**할 일**

- mvp 형태 구현
    - front
        - 이름, 휴대전화 번호 유효성 검사(1차 프론트)
        - 발급 이력을 위한 쿠폰 종류 선택 추가
    - back
        - 프론트에서 요청하면 백에서 쿠폰 번호 전송
- DB
    - 쿠폰 서비스 규모가 상대적으로 크지 않고, 안정성을 고려하여 SQL기반 DB 선택
    - 요청할 때 필요한 내용
        - 이름, 휴대전화 번호, 쿠폰 타입(이력 확인을 위한 임의 추가)
        - 생성할 때 `created_at` 추가
    - 이력 확인할 때 필요한 내용
        - 이름, 휴대전화 번호
        - 쿠폰 번호, 쿠폰 타입, 발급 일자



**구현 절차**

1. `vue3`기반의  `vite` 사용한 템플릿 구성

2. "쿠폰 받기" 및 "내역 확인" 두 종류의 탭으로 구성

3. `axios` 통신 기능 생성

    1. `axios` 전역 변수로 지정

    2. CORS에러 대응

4. 쿠폰 코드 반환

5. `POST` 요청으로 변경

    1. `body-parser` 필요: `body`로 들어오는 데이터를 검증하는 미들웨어

        ```js
        // express - app.js
        const bodyParser = require('body-parser');
        app.use(bodyParser.json());
        ```

    2. `body`에 데이터 담아서 전송

        ```js
        // vue - HomeView.vue
        const userdata = {
            userName: this.inputUsername,
            phoneNumber : this.inputPhonenumber,
            couponType : this.selectedType,
        };
        ```

6. MySQL 연결하기

7. MySQL 조회 함수

    - 함수화 했을 때 `undefined`가 출력되는 문제

        - `asynchronous`, 비동기 특성으로 나오는 문제

        - `db_query.js`의 함수를 `Promise`객체로 만들어 해결

    - `getUserInfo`: 입력된 이름과 휴대전화 번호에 맞는 사용자를 확인, 없으면 생성

    - `getCoupon`: `getUserInfo`를 통해 반환된 `userid`를 이용하여 쿠폰 발급 여부 체크

    - 동일 휴대전화 번호, 다른 이름으로 조회 시 예외 처리

8. CSS

    - 중간중간 업데이트
    - `color theme`
        - 바탕색: `rgba(255, 80, 0, 0.25)`
        - 중요 강조색: `rgb(255, 80, 0)`
        - 일반 강조색:`rgb(255, 150, 0)`
        - 이외 `black`, `white`

9. 기타

    1. 프론트 유효성 검사 추가
        1. 휴대전화 번호는 10자리 미만일 경우, 혹은 전체 선택지에 대해서 비어있는 경우 `alert`
        2. 휴대전화 번호에 숫자 외에 다른 정보가 있는 경우
            - `checkInput` 함수를 통해  정규식 검사 및 자동 수정
    2. 쿠폰 종류 Backend에서 받아오기
        1. 기간에 맞는 쿠폰 호출





> 남은 일
>
> 1. 발급 이력 없을 때 출력하기
>     1. 일단 유저가 있다는 건 무조건 발급 이력은 있음
>     2. 에러 케이스만 관리하면 될 듯
> 2. 쿠폰 코드 출력 방법
> 3. DB에서 발급 가능한 쿠폰 종류 받아오기
>     1. key-value 연결
>     2. DB에서 2차 검증(존재하는 쿠폰 타입인지)