# Hướng dẫn sử dụng VSCode cho GameCore
Chào anh em đồng chí, để sử dụng GameCore với các project khác, chung ta cần làm các bước sau.

## Cài đặt các tiện ích trong VSCode

 1. **ESLint** (*bắt buộc*): để sử dụng các quy tắt code chung, dành cho javascript và typescript.
 2. **Prettier ESLint** (*bắt buộc*): là trình định dạng code (*formatter*), sử dụng kết hợp với code styling và code rules đã được định nghĩa. 
 3. **Better Comments** (*bắt buộc*): hiển thị định dạng khác nhau cho một số comment quan trọng.
 4. **Hide Gitignored**: giúp ẩn các thư mục, tệp đã được liệt kê trong file .gitignore
 5. **Code Spell Checker**: kiểm tra chính tả dành cho code.
 6. **Visual Studio IntelliCode**: một AI hỗ trợ gợi ý, cú pháp, định nghĩa,...
 7. **Jira and Bitbucket (Atlassian Labs)**: theo dõi và quản lý các task nhanh chóng và đơn giản.

>Các tiện ích này là cần thiết để sử dụng cùng với GameCore và các project khác trong tương lai.

>Hầu hết các tiện ích này đã được cấu hình tự động, không cần làm gì thêm.

## Cấu hình trước khi bắt đầu

Sau khi cài đặt các tiện ích ở trên, bước tiếp theo sẽ cấu hình một số cái để có thể chạy được.

### Cấu hình Prettier ESLint
Mặt định VSCode đã có trình formatter riêng, để chuyển qua tiện ích này, cần làm các bước sau:

 1. Nhấn **Ctrl + Shift + P** và tìm nội dung: **Format document with..**
 2. Chọn mục: **Configure Default Formatter..**
 3. Chọn tiếp vào mục: **Prettier ESLint**

### Cấu hình VSCode

 1. **Eol**: \n (*tương ứng lf*)
 2. **Tab Size**: 4
 3. **Insert Spaces**: true
