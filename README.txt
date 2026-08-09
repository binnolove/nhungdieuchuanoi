# NHỮNG ĐIỀU CHƯA NÓI — V5

Frontend là HTML/CSS/JavaScript thuần và được Vercel phục vụ như static files từ `public/`.
Backend là Vercel Serverless Functions trong `api/` và dùng Supabase PostgreSQL.

## Cấu trúc

- `public/index.html` — entrypoint frontend
- `public/main.js` — toàn bộ DOM/UI/audio logic; chỉ chạy trong browser
- `public/style.css` — giao diện
- `public/audio/` — âm thanh
- `public/fonts/` — font local
- `api/*.js` — Serverless Functions, không chứa DOM code
- `supabase_schema.sql` — schema + RPC cho Supabase
- `local-server.cjs` — server local mô phỏng API bằng file JSON, chỉ dùng để test local

## Flow

HOME → 5 phòng → quay lại HOME

Phòng “Nếu bạn muốn kể”:
Bắt đầu → đủ 15 câu → kết quả

Flow hòm thư:
Gửi vào hư không → gửi thư → nhận thư → mở thư → hồi đáp → END

## Deploy Vercel

Vercel không cần build command cho frontend này. Chỉ cần deploy repository và cấu hình hai biến môi trường:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Service role key chỉ được dùng trong Serverless Functions, tuyệt đối không đưa vào `public/`.

## Local

```powershell
npm install
npm start
```

Mở `http://localhost:3000`.

Server local dùng `.local-letters.json` và không thay thế Supabase production.

## Kiểm tra

```powershell
npm run check
```

Lệnh này kiểm tra syntax của toàn bộ JavaScript frontend/backend.
