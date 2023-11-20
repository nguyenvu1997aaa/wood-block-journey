# Coding Style

> Sau đây là một số coding style mà các anh em cần phải mần theo.

1.  Indent line: **4 space**.
2.  Độ dài một dòng tối đa (Print Width): **100**.
3.  Không sử dụng **dấu chấm phẩy**, sau mỗi dòng.
4.  End of Line Sequence (EOL) phải luôn là **LF**.
5.  Sử dụng **\n** để sử lý các chuỗi lớn khi xuống dòng.
6.  Tên của thư mục phải đặt theo định dạng: **kebab-case**.
7.  Tên file bình thường sẽ đặt tên theo định dạng: **camelCase**.
8.  Tên file của class thì đặt theo định dạng: **PascalCase**.
    -   Tên file của class luôn đặt theo class name.
    -   Nếu trùng trên của thư mục (_Loader/Loader_) thì tạo thêm một file **index.ts** để export class từ class file **index.ts**.
9.  Với typescript, không sử dụng type là **any** cho bất cứ tình huống nào.
    -   Nếu không có type đó thì phải **tạo ra** hoặc cài từ **@types/[module]** nếu có.
    -   Đã khai báo nhưng không sử dụng, thì đặt là: **unused**.
    -   Trường hợp không thể xác định, thì sử dụng type là: **unknown**.
10. Các method trong class điều phải khai báo rõ các thuộc tính như: **public, private, protected,..**
11. Các hàm trong typescript phải định nghĩa đầy đủ **type, interface** cho **input** và **output**.
12. Luôn định nghĩa các interface, type,.. trong một file **[name].d.ts** ở trong thư mục **types**.
