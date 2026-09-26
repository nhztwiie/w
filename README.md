<!DOCTYPE html>
<html lang="vi" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bio Link Cá Nhân</title>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        pastel: {
                            blue: '#E0F2FE',       /* Xanh lam nhạt dịu mắt */
                            accent: '#38BDF8',     /* Điểm nhấn xanh tươi sáng */
                            hover: '#0284C7',      /* Xanh lam đậm khi hover */
                            darkBg: '#0F172A',     /* Nền tối Midnight Slate */
                            darkCard: '#1E293B',   /* Card tối dịu mắt */
                            cardLight: '#FFFFFF'   /* Card sáng */
                        }
                    },
                    animation: {
                        'float': 'float 4s ease-in-out infinite',
                        'fade-in': 'fadeIn 0.8s ease-out forwards',
                        'slide-up': 'slideUp 0.6s ease-out forwards',
                        'pulse-glow': 'pulseGlow 2s infinite'
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-8px)' }
                        },
                        fadeIn: {
                            '0%': { opacity: '0' },
                            '100%': { opacity: '1' }
                        },
                        slideUp: {
                            '0%': { opacity: '0', transform: 'translateY(20px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' }
                        },
                        pulseGlow: {
                            '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
                            '50%': { opacity: '0.8', transform: 'scale(1.05)' }
                        }
                    }
                }
            }
        }
    </script>

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Google Font (Inter) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- QRCode JS Library Generator -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

    <style>
        body {
            font-family: 'Inter', sans-serif;
            transition: background-color 0.4s ease, color 0.4s ease;
        }

        /* Hiệu ứng Glassmorphism mượt mà */
        .glass-card {
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .dark .glass-card {
            background: rgba(30, 41, 59, 0.75);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Nút hiệu ứng Ripple & Hover kính */
        .glass-btn {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(224, 242, 254, 0.8);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dark .glass-btn {
            background: rgba(51, 65, 85, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-btn:hover {
            transform: translateY(-3px) scale(1.01);
            box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.25);
        }

        /* Nút chia sẻ góc màn hình */
        .action-btn {
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .action-btn:hover {
            transform: scale(1.1) rotate(5deg);
        }
    </style>
</head>
<body class="bg-gradient-to-br from-sky-100 via-sky-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100 min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 transition-colors duration-500">

    <!-- GÓC TRÊN: NÚT ĐỔI THEME VÀ CHIA SẺ -->
    <header class="w-full max-w-md flex justify-between items-center mb-6 pt-2 z-10">
        <!-- Nút Chia Sẻ / QR Code -->
        <button onclick="openShareModal()" class="action-btn p-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 shadow-md hover:shadow-lg border border-white/50 dark:border-slate-700/50 focus:outline-none" title="Chia sẻ trang">
            <i class="fa-solid font-bold fa-share-nodes text-lg"></i>
        </button>

        <!-- Nút Chuyển Dark / Light Mode -->
        <button id="theme-toggle" onclick="toggleTheme()" class="action-btn p-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 shadow-md hover:shadow-lg border border-white/50 dark:border-slate-700/50 focus:outline-none" title="Đổi giao diện">
            <i id="theme-icon" class="fa-solid fa-moon text-lg text-sky-500"></i>
        </button>
    </header>

    <!-- THẺ BIO CHÍNH (MAIN CARD) -->
    <main class="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-slide-up my-auto">
        
        <!-- Vòng phát sáng trang trí phía sau avatar -->
        <div class="absolute -top-12 -left-12 w-40 h-40 bg-sky-300/30 dark:bg-sky-600/20 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-2xl pointer-events-none"></div>

        <div class="flex flex-col items-center text-center relative z-10">
            
            <!-- 1. AVATAR (ẢNH ĐẠI DIỆN) -->
            <!-- BẠN THAY ĐỔI URL ẢNH TẠI ĐÂY -->
            <div class="relative group mb-4">
                <div class="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse-glow"></div>
                <img id="user-avatar" 
                     src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop" 
                     alt="Avatar" 
                     class="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md transition-transform duration-500 group-hover:scale-105"
                     onerror="this.src='https://placehold.co/150x150/38BDF8/FFFFFF?text=AVATAR'">
            </div>

            <!-- 2. TÊN TÀI KHOẢN -->
            <!-- THAY TÊN CỦA BẠN TẠI ĐÂY -->
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500 dark:from-sky-400 dark:to-indigo-300 bg-clip-text text-transparent mb-1">
                Nguyễn Văn A
            </h1>

            <!-- 3. CAPTION / BIO NẮNG DỊU -->
            <!-- THAY DÒNG MÔ TẢ TẠI ĐÂY -->
            <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal mb-6 max-w-xs leading-relaxed">
                ✨ Creative Content Creator & Web Developer<br>
                🍃 Live with passion, shine with vision.
            </p>

            <!-- 4. DANH SÁCH CÁC MẠNG XÃ HỘI (LINKS) -->
            <div class="w-full space-y-3.5">

                <!-- Zalo Link -->
                <!-- Thay URL link Zalo vào href="" -->
                <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" 
                   class="glass-btn flex items-center justify-between w-full px-5 py-3.5 rounded-2xl shadow-sm text-slate-700 dark:text-slate-100 font-semibold group">
                    <div class="flex items-center space-x-3.5">
                        <span class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                            <i class="fa-solid fa-comment-dots"></i>
                        </span>
                        <span>Zalo Contact</span>
                    </div>
                    <i class="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:translate-x-1 group-hover:text-sky-500 transition-all"></i>
                </a>

                <!-- Facebook Link -->
                <!-- Thay URL link Facebook vào href="" -->
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   class="glass-btn flex items-center justify-between w-full px-5 py-3.5 rounded-2xl shadow-sm text-slate-700 dark:text-slate-100 font-semibold group">
                    <div class="flex items-center space-x-3.5">
                        <span class="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <i class="fa-brands fa-facebook-f"></i>
                        </span>
                        <span>Facebook</span>
                    </div>
                    <i class="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:translate-x-1 group-hover:text-sky-500 transition-all"></i>
                </a>

                <!-- TikTok Link -->
                <!-- Thay URL link TikTok vào href="" -->
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" 
                   class="glass-btn flex items-center justify-between w-full px-5 py-3.5 rounded-2xl shadow-sm text-slate-700 dark:text-slate-100 font-semibold group">
                    <div class="flex items-center space-x-3.5">
                        <span class="w-10 h-10 rounded-xl bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white flex items-center justify-center text-xl group-hover:bg-black group-hover:text-white transition-all duration-300">
                            <i class="fa-brands fa-tiktok"></i>
                        </span>
                        <span>TikTok Channel</span>
                    </div>
                    <i class="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:translate-x-1 group-hover:text-sky-500 transition-all"></i>
                </a>

                <!-- Instagram Link -->
                <!-- Thay URL link Instagram vào href="" -->
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                   class="glass-btn flex items-center justify-between w-full px-5 py-3.5 rounded-2xl shadow-sm text-slate-700 dark:text-slate-100 font-semibold group">
                    <div class="flex items-center space-x-3.5">
                        <span class="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center text-xl group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:via-rose-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
                            <i class="fa-brands fa-instagram"></i>
                        </span>
                        <span>Instagram</span>
                    </div>
                    <i class="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:translate-x-1 group-hover:text-sky-500 transition-all"></i>
                </a>

                <!-- Email Link -->
                <!-- Thay Email của bạn vào mailto:your-email@gmail.com -->
                <a href="mailto:example@gmail.com" 
                   class="glass-btn flex items-center justify-between w-full px-5 py-3.5 rounded-2xl shadow-sm text-slate-700 dark:text-slate-100 font-semibold group">
                    <div class="flex items-center space-x-3.5">
                        <span class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center text-xl group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                            <i class="fa-regular fa-envelope"></i>
                        </span>
                        <span>Gửi Email Liên Hệ</span>
                    </div>
                    <i class="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:translate-x-1 group-hover:text-sky-500 transition-all"></i>
                </a>

            </div>
        </div>
    </main>

    <!-- FOOTER CHÂN TRANG -->
    <footer class="mt-6 mb-2 text-center text-xs text-slate-500 dark:text-slate-400">
        © <span id="year"></span> Created with <i class="fa-solid fa-heart text-sky-400"></i> on GitHub Pages
    </footer>

    <!-- MODAL CHIA SẺ & QR CODE -->
    <div id="share-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm hidden flex items-center justify-center z-50 p-4 transition-opacity duration-300 opacity-0">
        <div class="glass-card bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative transform transition-transform duration-300 scale-95" id="modal-content">
            
            <!-- Nút đóng Modal -->
            <button onclick="closeShareModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <i class="fa-solid fa-xmark text-xl"></i>
            </button>

            <h3 class="text-xl font-bold text-center text-slate-800 dark:text-white mb-2">Chia Sẻ Trang Bio</h3>
            <p class="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">Quét mã QR hoặc sao chép liên kết dưới đây</p>

            <!-- Khung Mã QR -->
            <div class="flex flex-col items-center justify-center mb-6">
                <div class="p-3 bg-white rounded-2xl shadow-inner border border-sky-100 flex items-center justify-center">
                    <div id="qrcode"></div>
                </div>
            </div>

            <!-- Ô Sao Chép Link -->
            <div class="flex items-center bg-slate-100 dark:bg-slate-700/60 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-600">
                <input id="share-url-input" type="text" readonly class="bg-transparent text-xs text-slate-600 dark:text-slate-300 w-full px-3 focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap">
                <button onclick="copyToClipboard()" id="copy-btn" class="bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1 shrink-0">
                    <i class="fa-regular fa-copy"></i>
                    <span id="copy-btn-text">Copy</span>
                </button>
            </div>
            
            <!-- Thông báo sao chép thành công -->
            <div id="toast-message" class="text-center text-xs text-emerald-500 font-medium mt-2 opacity-0 transition-opacity duration-300">
                <i class="fa-solid fa-circle-check mr-1"></i> Đã sao chép liên kết vào bộ nhớ tạm!
            </div>
        </div>
    </div>

    <!-- JAVASCRIPT XỬ LÝ SỰ KIỆN -->
    <script>
        // Cập nhật năm tự động ở footer
        document.getElementById('year').innerText = new Date().getFullYear();

        // 1. CHỨC NĂNG CHUYỂN ĐỔI THEME LIGHT / DARK
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const htmlElement = document.documentElement;

        // Tải theme từ LocalStorage hoặc mặc định Light Mode (Pastel Blue)
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            htmlElement.classList.add('dark');
            themeIcon.className = 'fa-solid fa-sun text-lg text-amber-400';
        } else {
            htmlElement.classList.remove('dark');
            themeIcon.className = 'fa-solid fa-moon text-lg text-sky-500';
        }

        function toggleTheme() {
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                themeIcon.className = 'fa-solid fa-moon text-lg text-sky-500';
                localStorage.setItem('theme', 'light');
            } else {
                htmlElement.classList.add('dark');
                themeIcon.className = 'fa-solid fa-sun text-lg text-amber-400';
                localStorage.setItem('theme', 'dark');
            }
        }

        // 2. CHỨC NĂNG MODAL & TẠO MA QR
        const modal = document.getElementById('share-modal');
        const modalContent = document.getElementById('modal-content');
        const shareUrlInput = document.getElementById('share-url-input');
        let qrcodeObj = null;

        function openShareModal() {
            const currentUrl = window.location.href;
            shareUrlInput.value = currentUrl;

            // Tạo mã QR
            const qrContainer = document.getElementById('qrcode');
            qrContainer.innerHTML = ''; // Làm sạch trước khi render
            qrcodeObj = new QRCode(qrContainer, {
                text: currentUrl,
                width: 140,
                height: 140,
                colorDark: "#0284C7",
                colorLight: "#FFFFFF",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Hiện Modal với hiệu ứng
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            }, 10);
        }

        function closeShareModal() {
            modal.classList.add('opacity-0');
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        // Đóng modal khi bấm ra ngoài vùng card
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeShareModal();
            }
        });

        // 3. CHỨC NĂNG SAO CHÉP LINK (Hỗ trợ iFrame và trình duyệt bảo mật)
        function copyToClipboard() {
            const urlText = shareUrlInput.value;
            
            // Sử dụng execCommand để hoạt động ổn định trong iFrame/Webview
            shareUrlInput.select();
            shareUrlInput.setSelectionRange(0, 99999);
            
            try {
                document.execCommand('copy');
                showCopySuccess();
            } catch (err) {
                navigator.clipboard.writeText(urlText).then(() => {
                    showCopySuccess();
                }).catch(e => console.error('Lỗi khi copy: ', e));
            }
        }

        function showCopySuccess() {
            const toast = document.getElementById('toast-message');
            const copyBtnText = document.getElementById('copy-btn-text');
            
            copyBtnText.innerText = 'Đã Copy!';
            toast.classList.remove('opacity-0');
            
            setTimeout(() => {
                copyBtnText.innerText = 'Copy';
                toast.classList.add('opacity-0');
            }, 2500);
        }
    </script>
</body>
</html>
