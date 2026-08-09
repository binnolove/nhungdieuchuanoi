# Deploy V5 lên Vercel

## 1. Repository

Root của repository phải chứa:

- `package.json`
- `vercel.json`
- `public/`
- `api/`

Không cần đặt `index.html` ở root.

## 2. Vercel Settings

- Framework Preset: Other / để Vercel tự nhận diện
- Build Command: để trống
- Output Directory: để trống
- Root Directory: `/`

`public/` được dùng làm static asset directory.

## 3. Environment Variables

Thêm:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Không đặt service role key trong `public/` hoặc frontend JavaScript.

## 4. Deploy

Deploy repository lên Vercel.

Sau deploy kiểm tra:

```text
GET /api/health
```

Khi Supabase đã cấu hình đúng, kết quả mong đợi:

```json
{"ok":true,"service":"nhung-dieu-chua-noi","version":"v5-serverless"}
```

Sau đó test:

1. Vào HOME.
2. Mở từng phòng và quay lại HOME.
3. Vào “Nếu bạn muốn kể” và hoàn thành 15 câu.
4. Vào “Gửi vào hư không”.
5. Viết và gửi thư.
6. Nhận thư.
7. Mở thư.
8. Hồi đáp.
9. Kiểm tra màn hình `END`.

## Local nhanh

```powershell
npm install
npm start
```

Mở `http://localhost:3000`.

Local server dùng file `.local-letters.json`; production dùng Supabase.
