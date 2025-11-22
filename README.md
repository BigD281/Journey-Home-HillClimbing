
# 🧭 Journey Home: HillClimbing Pathfinding Visualization

Ứng dụng trực quan hóa thuật toán tìm đường **Leo Đồi (Hill Climbing Algorithm)** trên lưới 25 x 25 được xây dựng bằng React và TypeScript.

## 📋 Tổng quan

Dự án này là một công cụ giáo dục, giúp người dùng trực quan quan sát cách một thuật toán tìm kiếm cục bộ tham lam (greedy local search algorithm) hoạt động để tìm con đường từ điểm **Bắt đầu (Start)** đến điểm **Kết thúc (End)** trong một môi trường có chướng ngại vật (Walls).

## 🚀 Tính năng

- ✅ **Trực quan hóa Thời gian thực:** Xem thuật toán Hill Climbing di chuyển từng bước trên lưới.
- ✅ **Heuristic:** Sử dụng **Khoảng cách Euclidean** làm hàm Heuristic để định hướng.
- ✅ **Mắc kẹt (Local Optima Demo):** Minh họa rõ ràng hạn chế nổi tiếng của thuật toán khi bị mắc kẹt tại điểm cực trị cục bộ.
- ✅ **Điều khiển Linh hoạt:** Khởi động, dừng, và thiết lập lại lưới dễ dàng.
- ✅ **Tạo Lưới Ngẫu nhiên:** Tạo ngẫu nhiên các bức tường để tạo ra các kịch bản thử thách khác nhau.
- ✅ **Tùy chỉnh Kích thước Lưới:** Dễ dàng điều chỉnh kích thước lưới (hiện tại là 25 x 25).

## 📦 Công nghệ Sử dụng

| Công nghệ | Vai trò |
| :--- | :--- |
| **React + Vite** | Nền tảng phát triển giao diện người dùng nhanh và hiện đại. |
| **TypeScript** | Đảm bảo tính nhất quán và kiểu dữ liệu mạnh mẽ cho logic thuật toán. |
| **Tailwind CSS** | Xây dựng giao diện UI hiện đại và responsive (Grid, Overlay, Controls). |
| **Lucide React** | Bộ icon đơn giản và rõ ràng cho các nút điều khiển. |
| **React Hot Toast** | Hiển thị các thông báo (thành công, mắc kẹt, lỗi). |

## 🛠️ Cấu trúc Dự án

```
Journey Home HillClimbing/
├── src/
│   ├── components/
│   │   └── GameGrid.tsx      # Component hiển thị lưới (UI Rendering)
│   ├── lib/
│   │   └── grid.ts           # Logic thuần túy (Node, Point, getDistance, getNeighbors)
│   ├── App.tsx               # Logic chính (Thuật toán Hill Climbing, State Management)
│   ├── main.tsx              # Điểm khởi động React
│   └── index.css             # Tailwind CSS directives 
├── BG.jpg                    # File ảnh nền tĩnh
├── climbing.jpg              # Logo
├── vite.config.ts            # Cấu hình Build Tool (Vite)
├── package.json              # Danh sách thư viện (Dependencies)
├── tailwind.config.js        # Cấu hình Tailwind CSS
└── README.md                 # Just readme XD
```

## 🚀 Cài đặt và Chạy

### 1\. Clone Repository

```bash
git clone https://github.com/BigD281/Journey-Home-HillClimbing.git
cd Journey-Home-HillClimbing
```

### 2\. Cài đặt Dependencies

Sử dụng `npm` hoặc `pnpm` để cài đặt các thư viện cần thiết:

```bash
npm install 
# HOẶC
pnpm install
```

### 3\. Chạy Dự án

Sử dụng lệnh dev script để khởi động máy chủ phát triển cục bộ:

```bash
npm run dev
# HOẶC
pnpm run dev
```

Sau đó, mở trình duyệt của bạn tại địa chỉ: `http://localhost:5173/` (hoặc cổng được hiển thị trong terminal).

## ⚙️ Cấu hình Thuật toán

Bạn có thể thay đổi các tham số chính của ứng dụng trong các tệp sau:

  * **Kích thước Lưới:** Chỉnh sửa hằng số `GRID_SIZE` trong **`src/lib/grid.ts`** (Ví dụ: từ 25 lên 40).
  * **Tốc độ Chạy:** Chỉnh sửa giá trị `speedRef.current` (đơn vị {ms}) trong **`src/App.tsx`** để thay đổi tốc độ chạy thuật toán.
  * **Vị trí Kết thúc:** Chỉnh sửa `endPos` trong **`src/App.tsx`** (Ví dụ: \{ x: 23, y: 23 \} cho lưới 25 x 25).

## 🤝 Đóng góp

Mọi đóng góp nhằm cải thiện tính năng, hiệu suất hoặc giao diện người dùng đều được hoan nghênh.

1.  Fork repository này.
2.  Tạo branch mới cho tính năng của bạn (`git checkout -b feature/tinh-nang-moi`).
3.  Commit các thay đổi của bạn (`git commit -m 'feat: them tinh nang A'`).
4.  Push lên branch đó (`git push origin feature/tinh-nang-moi`).
5.  Mở một Pull Request.

-----

## 👨‍💻 Tác giả
BigD281
- Happy Pathfinding\! 🚀
