# Hướng dẫn Thiết lập SSL cho Angular Localhost (Không cảnh báo bảo mật) (Windows)

Tài liệu này hướng dẫn cách chạy ứng dụng Angular ở chế độ HTTPS (`https://localhost:4200`) mà không gặp lỗi "Your connection is not private" (Màn hình đỏ) trên trình duyệt. Chúng ta sẽ sử dụng công cụ **mkcert** để tạo chứng chỉ Trusted CA giả lập.

## 1. Cài đặt công cụ `mkcert`

Tùy thuộc vào hệ điều hành bạn đang sử dụng, hãy chạy lệnh tương ứng:    
Tạo folder chứa ssl để trỏ, cd vào đó và:

Sử dụng Chocolatey (Run as Administrator):

```bash
choco install mkcert
```
```bash
mkcert -install
```

thêm ssl vào `angular.json` / `project.json` (nx)

```json
{
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "ssl": true,
      "sslKey": "{{yourSSLPath}}/localhost+1-key.pem",
      "sslCert": "{{yourSSLPath}}/localhost+1.pem"
    }
  }
}

```