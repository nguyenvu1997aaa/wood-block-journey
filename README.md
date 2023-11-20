# Các bước thiết lập Game Core

1.  Chạy **yarn install**
2.  Chạy lệnh khởi tạo game core: **yarn init-core --appid [appID] --developer [your-name] --apptoken [apptoken]**
    -   Tham số **appId** là App ID của game trên facebook.
    -   Tham số **developer** là tên của bạn, sử dụng để định danh ai là người deploy.
    -   Tham số **apptoken** là App Secret của game trên facebook.
    -   Lệnh này sẽ tạo một số file env.local và config.custom và một game template.
3.  Tạo một bản phaser tùy biến bằng: **yarn build:phaser**

# Quy định khi nâng cấp dependents

-   Chỉ nâng phiên bản mới sau **1 tháng** kể từ lần cập nhật cuối.
-   Những dependent đơn giản có thể code được thì code thành module hoặc plugin.
