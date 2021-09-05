# download-image-instagram

## hướng dẫn sử dụng:
Tải modules về bằng câu lệnh sau
```
npm install
```

**index.js** : tại dòng 30 của file này chỉnh sửa lại đường dẫn mở chromnium.

```
    executablePath: 'C:/Users/Drom/Downloads/chrome-win/chrome-win/chrome.exe'
```
Thành
```
    executablePath : 'Đường dẫn'
```

**config.json** : trong đây có username facebook, password facebook, thư mục lưu trữ, url profile cần tải. Chỉnh sửa xong rồi mới chạy./

Để chạy:
```
node index.js
```

File tải về sẽ nằm trong đường dẫn đã lưu trong **config.json**
