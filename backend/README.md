# Backend

```python
📂 backend
│
├─ 📁 node_modules
├─ 📂 src
│   ├─ 📂 plugins
│	│   ├─ 📄 db_query.js	    # DB 조작 함수
│	│   ├─ 📄 db_set.js		    # DB 세팅
│	│   └─ 📄 temp_db_set.js	# coupon type DB 임시 항목 삽입
│   └─ 📄 db_config.json		# MYSQL 계정 정보
├─ 📄 .gitignore
├─ 📄 app.js                    # main 실행 파일
├─ 📄 erd.drawio                # ERD
├─ 📄 package.json
└─ 📄 README.md		            # 프록시 설정
```

## Project Setup

```sh
npm install
```

### Project Start

```sh
npm app.js
```
