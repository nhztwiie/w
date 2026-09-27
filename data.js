// data.js - Cấu hình dữ liệu Bio Link cho Nhật Huy
const bioData = {
  profile: {
    name: "Nhật Huy",
    bio: "ung dung.",
    // Điền tên file ảnh đại diện của bạn (ví dụ: "avatar.jpg" hoặc URL)
    avatar: "avatar.jpg", 
    // Để trống "" sẽ tự động sử dụng link trang web hiện tại để tạo mã QR
    shareUrl: "" 
  },
  tabs: {
    social: [
      {
        id: "facebook",
        title: "Facebook",
        url: "https://www.facebook.com/nhzt.wiie",
        icon: "logo-facebook.png" // File ảnh logo Facebook
      },
      {
        id: "tiktok",
        title: "Tiktok",
        url: "https://www.tiktok.com/@nhzt.wiie",
        icon: "logo-tiktok.png" // File ảnh logo Tiktok
      },
      {
        id: "instagram",
        title: "Instagram",
        url: "https://www.instagram.com/nhzt.wiie",
        icon: "logo-instagram.png" // File ảnh logo Instagram
      },
      {
        id: "locket",
        title: "Locket",
        url: "https://locket.com/l.nhathuyy",
        icon: "logo-locket.png" // File ảnh logo Locket
      }
    ],
    work: [
      {
        id: "zalo",
        title: "Zalo",
        url: "https://zalo.me/0398476794",
        icon: "logo-zalo.png" // File ảnh logo Zalo
      },
      {
        id: "email",
        title: "E-mail",
        url: "mailto:lnh.quii@gmail.com",
        icon: "logo-email.png" // File ảnh logo Email
      }
    ]
  }
};
