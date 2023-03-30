# Frontend

```python
📂 frontend
│
├─ 📁 public
├─ 📂 src
│   ├─ 📂 assets
│	│   ├─ 📄 base.css		# 공용 요소CSS 관리
│	│   ├─ 📄 main.css		# css import
│	│   └─ 📄 modal.css		# 모달 CSS
│	├─ 📁 components
│   ├─ 📂 router
│	│   └─ 📄 index.js		# router 관리
│   ├─ 📂 views
│   ├─ 📄 app.vue
│   └─ 📄 main.js			# 서버에서 coupon정보 받고 app mount
├─ 📄 .gitignore
├─ 📄 index.html
├─ 📄 package.json
├─ 📄 README.md
└─ 📄 vite.config.js		# 프록시 설정
```

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
