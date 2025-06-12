document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('collaboratorsTrack');
    const container = document.getElementById('collaboratorsContainer');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const copyNotification = document.getElementById('copyNotification');
    const copyNotificationText = document.getElementById('copyNotificationText');
    const langBtn = document.getElementById('langBtn');
    const qqNumbers = [
        1259180157, 110886512, 1958832195, 1592515910, 
        2858454697, 3888723696, 1148677598, 
        3947714483, 3478684410, 1336682434
    ];
    const installCommand = "pkg update && pkg upgrade -y && rm -rf $HOME/GFP_B && pkg install python -y && pkg install qemu-user-i386 -y && pkg install git -y && pkg install elfutils && git clone https://github.com/ELMA0158/GFP_B.git && cd GFP_B && chmod +x setup.sh && ./setup.sh";
    let isEnglish = false;
    const translations = {
        chinese: {
            langBtn: "EN",
            subtitle: "基于Termux的安卓自动化美化工具",
            collaborators_title: "合作者",
            collaborators_subtitle: "感谢他们在新手工具教学和群组管理方面作出的贡献",
            installation_title: "轻松安装",
            installation_desc: "简单三步即可开始使用GFP_B的强大功能",
            step1_title: "安装ZeroTermux",
            step1_desc: "从GitHub获取最新版本",
            step2_title: "运行安装命令",
            step2_desc: "点击复制一键安装命令",
            step3_title: "开始使用",
            step3_desc: "执行GFP_B命令开始使用",
            community_title: "加入社群",
            community_desc: "获取最新更新和技术支持",
            telegram_btn: "@GFP_B Telegram频道",
            opensource_title: "完全免费与开源",
            opensource_desc: "GFP_B 是一个完全公益免费的开源工具",
            free_badge: "永久免费 · 永久开源",
            project_link: "工具项目地址",
            source_link: "工具开源地址",
            copy_notification: "安装命令已复制到剪贴板！"
        },
        english: {
            langBtn: "中文",
            subtitle: "Android Terminal Beautifier based on Termux",
            collaborators_title: "Collaborators",
            collaborators_subtitle: "Thanks for their contributions to tutorials and group management.",
            installation_title: "Easy Installation",
            installation_desc: "Get started with GFP_B in just three simple steps",
            step1_title: "Install ZeroTermux",
            step1_desc: "Get the latest version from GitHub",
            step2_title: "Run Installation Command",
            step2_desc: "Click to copy one-click installation command",
            step3_title: "Start Using",
            step3_desc: "Execute GFP_B command to begin using",
            community_title: "Join Community",
            community_desc: "Get latest updates and technical support",
            telegram_btn: "@GFP_B Telegram Channel",
            opensource_title: "Free and Open Source",
            opensource_desc: "GFP_B is a completely free and open source tool",
            free_badge: "Free Forever · Open Source Forever",
            project_link: "Project Repository",
            source_link: "Source Code Repository",
            copy_notification: "Installation command copied to clipboard!"
        }
    };
    function toggleLanguage() {
        isEnglish = !isEnglish;
        const langData = isEnglish ? translations.english : translations.chinese;
        
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (langData[key]) {
                el.textContent = langData[key];
            }
        });
        
        langBtn.textContent = langData.langBtn;
    }
    function generateAvatars() {
        track.innerHTML = '';
        const totalCopies = 3; 
        
        for (let copy = 0; copy < totalCopies; copy++) {
            qqNumbers.forEach(qq => {
                const collaborator = document.createElement('div');
                collaborator.className = 'collaborator';
                
                const img = document.createElement('img');
                img.src = `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=640`;
                img.alt = `Collaborator QQ: ${qq}`;
                img.loading = "lazy";
                
                img.onerror = function() {
                    img.style.display = 'none';
                    const bgDiv = document.createElement('div');
                    bgDiv.style.width = '100%';
                    bgDiv.style.height = '100%';
                    bgDiv.style.background = `linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()})`;
                    bgDiv.style.display = 'flex';
                    bgDiv.style.justifyContent = 'center';
                    bgDiv.style.alignItems = 'center';
                    bgDiv.innerHTML = `<span style="font-size: 20px; font-weight: bold; color: white;">${String(qq).slice(-3)}</span>`;
                    collaborator.appendChild(bgDiv);
                };
                
                const innerGlow = document.createElement('div');
                innerGlow.className = 'inner-glow';
                
                collaborator.appendChild(img);
                collaborator.appendChild(innerGlow);
                track.appendChild(collaborator);
            });
        }
    }
    function getRandomColor() {
        const colors = ['#4a3dff', '#ff2d95', '#00f7ff', '#ff6b00', '#9c27b0', '#00bcd4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            copyNotification.classList.add('show');
            setTimeout(() => {
                copyNotification.classList.remove('show');
            }, 3000);
        }).catch(err => {
            console.error('Copy to clipboard failed:', err);
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            copyNotification.classList.add('show');
            setTimeout(() => {
                copyNotification.classList.remove('show');
            }, 3000);
        });
    }
function initCollaboratorScroller() {
    let isDragging = false;
    let startX;
    let scrollLeft;
    let rafId;
    let isPaused = false;

    const autoScroll = () => {
        if (!isDragging && !isPaused) {
            container.scrollLeft += 0.7;
            if (container.scrollLeft >= track.scrollWidth / 3) {
                container.scrollLeft = 0;
            }
        }
        rafId = requestAnimationFrame(autoScroll);
    };

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return;
        isDragging = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        isPaused = true;
        container.style.cursor = 'grabbing';
    });

    container.addEventListener('touchend', () => {
        isDragging = false;
        isPaused = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length > 1) return;
        e.preventDefault();
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });
    container.addEventListener('mouseenter', () => { isPaused = true; });
    container.addEventListener('mouseleave', () => {
        isPaused = false;
        isDragging = false;
        container.style.cursor = 'grab';
        container.style.userSelect = 'auto';
    });

    container.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        container.style.cursor = 'grabbing';
        container.style.userSelect = 'none';
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
        container.style.userSelect = 'auto';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });

    autoScroll();
    window.addEventListener('unload', () => cancelAnimationFrame(rafId));
}
    
    generateAvatars();
    initCollaboratorScroller();
    
    langBtn.addEventListener('click', toggleLanguage);
    
    step1.addEventListener('click', () => {
        window.open('https://github.com/hanxinhao000/ZeroTermux', '_blank');
    });
    
    step2.addEventListener('click', () => {
        copyToClipboard(installCommand);
    });
});
var _Asin = "True";