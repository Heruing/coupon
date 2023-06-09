# About

## 개요

- 사전 과제를 위해 작성한 쿠폰 발급 페이지

## 요구사항

### 기술 스택

1. FrontEnd: React, Vue // 택 1
2. Backend: Spring boot, nodejs // 택 1
3. DB: 자유

### 구현 내용

1. 게임 쿠폰 발급 페이지 개발
    - 게임 쿠폰을 발급할 수 있는 페이지
    - 조건 1: 이름, 휴대전화 번호 입력
    - 조건 2: 중복되지 않은 쿠폰 번호 발급 (12 자리) ex) xxxx-xxxx-xxxx 
    - 조건 3: 이미 발급받은 휴대전화 번호 체크 후 발급 제한, 중복에 대한 알림 표기

<hr>

### 사전 작업

- mvp 형태 구현
    - front
        - 이름, 휴대전화 번호 유효성 검사(1차 프론트)
        - 발급 이력을 위한 쿠폰 종류 선택 추가
    - back
        - 프론트에서 요청하면 백에서 쿠폰 번호 전송
- DB
    - 쿠폰 서비스의 안정성을 고려하여 SQL기반 DB 선택
    - 요청할 때 필요한 내용
        - 이름, 휴대전화 번호, 쿠폰 타입(이력 확인을 위한 임의 추가)
        - 생성할 때 `created_at` 추가
    - 이력 확인할 때 필요한 내용
        - 이름, 휴대전화 번호
        - 쿠폰 번호, 쿠폰 타입, 발급 일자

<hr>

### 실제 과정

1. `vue3`기반의  `vite` 사용한 템플릿 구성
    1. "쿠폰 받기" 및 "내역 확인" 두 종류의 탭으로 구성
2. `nodejs` 및 `express` Backend 환경 구성
3. `axios` 통신 기능 생성
    1. `axios` 전역 변수로 지정

    2. CORS에러 대응
4. 쿠폰 코드 반환(`get`)
5. `POST` 요청으로 변경
    1. `body-parser` 필요: `body`로 들어오는 데이터를 검증하는 미들웨어

    2. `body`에 데이터 담아서 전송
        - `name`, `phonenumber`
6. MySQL 연결
7. MySQL 함수

    - 함수화 했을 때 `undefined`가 출력되는 문제

        - `asynchronous`, 비동기 특성으로 나오는 문제

        - `db_query.js`의 함수를 `Promise`객체로 만들어 해결

    - 동일 휴대전화 번호, 다른 이름으로 조회 시 예외(`-1`) 처리
8. CSS

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
        1. DB에서 요청 온 쿠폰 타입에 대해서 검증 후 생성
    3. 동일한 쿠폰 체크 로직 검사
    4. `alert` 로직 모달로 이동
    6. 모달 애니메이션
10. 코드 정비
    1. 주요 함수들에 JSDoc 주석 추가
    2. `node-cron`모듈 사용하여 매 정각마다 사용 가능 쿠폰 갱신
    3. 백그라운드 클릭 시 팝업 모달 닫히게 변경
    4. 배경 이미지 추가
    5. 가독성을 위한 텍스트 효과 추가
