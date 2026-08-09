# NHỮNG ĐIỀU CHƯA NÓI — V5 Serverless + Supabase

## 1. Supabase

Mở Supabase SQL Editor và chạy toàn bộ `supabase_schema.sql`.

Schema tạo:

- `public.letters`
- `claim_next_letter()`
- `reply_to_letter(...)`

## 2. Vercel Environment Variables

Thêm:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

`SUPABASE_SERVICE_ROLE_KEY` chỉ được đọc trong `api/_db.js`; không được đưa vào frontend.

## 3. API

- `GET /api/health` — kiểm tra API/database.
- `POST /api/letters` — gửi thư.
- `POST /api/letters-next` — nhận và khóa một thư đang chờ.
- `POST /api/reply?id=<LETTER_ID>` — hồi đáp và tạo thư mới.

## 4. Frontend

Frontend nằm hoàn toàn trong `public/`. Vercel phục vụ các file này như static assets.

Không có frontend JavaScript nào nằm trong `api/`.
Do đó các lệnh như `document.querySelector(...)`, `new Audio(...)` chỉ xuất hiện trong `public/main.js` và không được Vercel load như Serverless Function.

## 5. Local

```powershell
npm install
npm start
```

Local server dùng `.local-letters.json` để mô phỏng API, không cần Supabase.

Để chạy đúng serverless Vercel locally:

```powershell
npx vercel dev
```

và cấu hình các biến môi trường Supabase trong môi trường local.
