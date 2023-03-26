<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="container">
        <nav>
            <RouterLink to="/">쿠폰 받기</RouterLink>
            <RouterLink to="/history">내역 확인</RouterLink>
        </nav>
        <div class="container-content">
            <RouterView />
        </div>
    </div>
</template>
<script>
</script>
<style scoped>
nav {
    width: 100%;
    height: 50px;
    font-size: 1.5rem;
    text-align: center;
    align-items: center;
    background-color: black;
    display: flex;
    justify-content: space-around;
    border-bottom: 2px solid rgb(255,80,0);
}
nav a{
    text-decoration: none;
    color: white;
    font-weight: 800;
    width:50%;
    height: 100%;
    line-height: 50px;
    transition: 0.3s;
}
nav a:hover {
    background-color: white;
    color: rgb(255,80,0);
}
nav a.router-link-exact-active {
    color: rgb(255,80,0);
}
nav a.router-link-exact-active:hover {
    background-color: transparent;
}
</style>
