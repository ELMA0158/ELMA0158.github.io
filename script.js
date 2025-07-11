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
                
                collaborator.addEventListener('click', () => {
                    const wasSelected = collaborator.classList.contains('selected');
                    document.querySelectorAll('.collaborator.selected').forEach(c => {
                        c.classList.remove('selected');
                    });
                    if (!wasSelected) {
                        collaborator.classList.add('selected');
                    }
                });
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
        let isDragging = false, startX = 0, currentX = 0, startTranslateX = 0, hasDragged = false, isPaused = false, resumeTimer = null, rafId, scrollChunkWidth = 0;
        const RESUME_DELAY = 1000, ANIMATION_SPEED = 0.5, DRAG_THRESHOLD = 5;

        const setPosition = (x) => { track.style.transform = `translateX(${x}px)`; };
        const autoScroll = () => {
            if (!isDragging && !isPaused) {
                currentX -= ANIMATION_SPEED;
                if (currentX <= -2 * scrollChunkWidth) { currentX += scrollChunkWidth; }
                setPosition(currentX);
            }
            rafId = requestAnimationFrame(autoScroll);
        };
        const pauseScrolling = () => { isPaused = true; if (resumeTimer) { clearTimeout(resumeTimer); } };
        const resumeScrollingAfterDelay = () => {
            if (isDragging) return;
            clearTimeout(resumeTimer);
            resumeTimer = setTimeout(() => { isPaused = false; }, RESUME_DELAY);
        };
        const onDragMove = (clientX) => {
            if (!isDragging) return;
            const walk = clientX - startX;
            if (Math.abs(walk) > DRAG_THRESHOLD) { hasDragged = true; }
            let newX = startTranslateX + walk;
            if (newX > -scrollChunkWidth) { startTranslateX -= scrollChunkWidth; newX = startTranslateX + walk; }
            if (newX < -2 * scrollChunkWidth) { startTranslateX += scrollChunkWidth; newX = startTranslateX + walk; }
            currentX = newX;
            setPosition(currentX);
        };
        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            container.style.cursor = 'grab';
            track.style.transition = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            resumeScrollingAfterDelay();
            requestAnimationFrame(autoScroll);
        };
        const onDragStart = (clientX) => {
            pauseScrolling();
            hasDragged = false; isDragging = true; startX = clientX; startTranslateX = currentX;
            container.style.cursor = 'grabbing';
            track.style.transition = 'none';
            cancelAnimationFrame(rafId);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('touchmove', onTouchMove, { passive: true });
            document.addEventListener('touchend', onTouchEnd);
        };
        const onMouseMove = (e) => onDragMove(e.pageX);
        const onMouseUp = () => onDragEnd();
        const onTouchMove = (e) => onDragMove(e.touches[0].clientX);
        const onTouchEnd = () => onDragEnd();
        const onMouseDown = (e) => onDragStart(e.pageX);
        const onTouchStart = (e) => onDragStart(e.touches[0].clientX);
        const setupEventListeners = () => {
            container.addEventListener('mouseenter', pauseScrolling);
            container.addEventListener('mouseleave', resumeScrollingAfterDelay);
            container.addEventListener('mousedown', onMouseDown);
            container.addEventListener('touchstart', onTouchStart, { passive: true });
            container.addEventListener('click', (e) => { if (hasDragged) { e.preventDefault(); e.stopPropagation(); } }, true);
        };
        const initialize = () => {
            scrollChunkWidth = Math.floor(track.scrollWidth / 3);
            if (scrollChunkWidth > 0) {
                currentX = -scrollChunkWidth;
                setPosition(currentX);
                setupEventListeners();
                autoScroll();
            } else { setTimeout(initialize, 100); }
        };
        initialize();
        window.addEventListener('unload', () => cancelAnimationFrame(rafId));
    }
    
    generateAvatars();
    initCollaboratorScroller();
    langBtn.addEventListener('click', toggleLanguage);
    step1.addEventListener('click', () => window.open('https://github.com/hanxinhao000/ZeroTermux', '_blank'));
    step2.addEventListener('click', () => copyToClipboard(installCommand));

    const buttonElements = Array.from(document.querySelectorAll('.floating-btn'));
    const buttons = [];

    if (buttonElements.length > 0) {
        buttonElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            buttons.push({
                el: el,
                pos: { x: rect.left + window.scrollX, y: rect.top + window.scrollY },
                velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
                radius: el.offsetWidth / 2,
                mass: 1,
                isDragging: false,
                hasDragged: false,
                lastPos: { x: 0, y: 0 }
            });
        });

        buttons.forEach(btnObj => {
            btnObj.el.style.top = `${btnObj.pos.y}px`;
            btnObj.el.style.left = `${btnObj.pos.x}px`;
            btnObj.el.style.right = 'auto';
            btnObj.el.style.bottom = 'auto';

            const startDrag = (e) => {
                if (e.type === 'mousedown') e.preventDefault();
                btnObj.isDragging = true;
                btnObj.hasDragged = false;
                btnObj.el.classList.add('dragging');
                btnObj.el.style.animationPlayState = 'paused';
                const eventPos = e.type.includes('touch') ? e.touches[0] : e;
                btnObj.lastPos = { x: eventPos.clientX, y: eventPos.clientY };
                document.addEventListener('mousemove', onDrag);
                document.addEventListener('mouseup', endDrag);
                document.addEventListener('touchmove', onDrag, { passive: false });
                document.addEventListener('touchend', endDrag);
            };

            const onDrag = (e) => {
                if (!btnObj.isDragging) return;
                e.preventDefault();
                btnObj.hasDragged = true;
                const eventPos = e.type.includes('touch') ? e.touches[0] : e;
                const currentPos = { x: eventPos.clientX, y: eventPos.clientY };
                const delta = { x: currentPos.x - btnObj.lastPos.x, y: currentPos.y - btnObj.lastPos.y };
                btnObj.pos.x += delta.x;
                btnObj.pos.y += delta.y;
                btnObj.velocity = { x: delta.x, y: delta.y };
                btnObj.lastPos = currentPos;
            };

            const endDrag = () => {
                if (!btnObj.isDragging) return;
                btnObj.isDragging = false;
                btnObj.el.classList.remove('dragging');
                document.removeEventListener('mousemove', onDrag);
                document.removeEventListener('mouseup', endDrag);
                document.removeEventListener('touchmove', onDrag);
                document.removeEventListener('touchend', endDrag);
            };

            btnObj.el.addEventListener('click', (e) => {
                if (btnObj.hasDragged) e.preventDefault();
            });

            btnObj.el.addEventListener('mousedown', startDrag);
            btnObj.el.addEventListener('touchstart', startDrag, { passive: true });
        });

        const mainLoop = () => {
            buttons.forEach(btnObj => {
                if (!btnObj.isDragging) {
                    btnObj.pos.x += btnObj.velocity.x;
                    btnObj.pos.y += btnObj.velocity.y;
                    btnObj.velocity.x *= 0.98;
                    btnObj.velocity.y *= 0.98;
                }

                const docWidth = document.documentElement.scrollWidth;
                const docHeight = document.documentElement.scrollHeight;
                if (btnObj.pos.x < 0 || btnObj.pos.x + btnObj.el.offsetWidth > docWidth) {
                    btnObj.velocity.x *= -0.7;
                    btnObj.pos.x = Math.max(0, Math.min(btnObj.pos.x, docWidth - btnObj.el.offsetWidth));
                }
                if (btnObj.pos.y < 0 || btnObj.pos.y + btnObj.el.offsetHeight > docHeight) {
                    btnObj.velocity.y *= -0.7;
                    btnObj.pos.y = Math.max(0, Math.min(btnObj.pos.y, docHeight - btnObj.el.offsetHeight));
                }

                btnObj.el.style.left = `${btnObj.pos.x}px`;
                btnObj.el.style.top = `${btnObj.pos.y}px`;
            });

            for (let i = 0; i < buttons.length; i++) {
                for (let j = i + 1; j < buttons.length; j++) {
                    resolveCollision(buttons[i], buttons[j]);
                }
            }

            requestAnimationFrame(mainLoop);
        };
        
        mainLoop();
    }
    
    function resolveCollision(b1, b2) {
        if (b1.isDragging && b2.isDragging) return;

        const center1 = { x: b1.pos.x + b1.radius, y: b1.pos.y + b1.radius };
        const center2 = { x: b2.pos.x + b2.radius, y: b2.pos.y + b2.radius };
        
        const dx = center2.x - center1.x;
        const dy = center2.y - center1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = b1.radius + b2.radius;

        if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            if (!b1.isDragging) {
                b1.pos.x -= overlap / 2 * nx;
                b1.pos.y -= overlap / 2 * ny;
            }
            if (!b2.isDragging) {
                b2.pos.x += overlap / 2 * nx;
                b2.pos.y += overlap / 2 * ny;
            }

            const kx = b1.velocity.x - b2.velocity.x;
            const ky = b1.velocity.y - b2.velocity.y;
            const p = 2.0 * (nx * kx + ny * ky) / (b1.mass + b2.mass);
            
            if (!b1.isDragging) {
                b1.velocity.x -= p * b2.mass * nx;
                b1.velocity.y -= p * b2.mass * ny;
            }
            if (!b2.isDragging) {
                b2.velocity.x += p * b1.mass * nx;
                b2.velocity.y += p * b1.mass * ny;
            }
        }
    }


    const title = document.querySelector('.title');
    const floatingNav = document.querySelector('.floating-nav');
    let clickCount = 0;
    let clickTimer = null;

    title.addEventListener('click', () => {
        clickCount++;
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 800);
        if (clickCount === 3) {
            clickCount = 0;
            if (floatingNav.classList.contains('visible')) return;
            triggerEasterEgg();
        }
    });

    function triggerEasterEgg() {
        const confettiContainer = document.getElementById('confetti-container');
        if (!confettiContainer) return;
        const colors = ['var(--quantum)', 'var(--pulse)', 'var(--photon)'];
        const confettiCount = 150;
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.setProperty('--duration', `${Math.random() * 2 + 3}s`);
            confetti.style.setProperty('--delay', `${Math.random() * 2}s`);
            confetti.style.width = `${Math.random() * 8 + 5}px`;
            confetti.style.height = `${Math.random() * 15 + 8}px`;
            confetti.addEventListener('animationend', function() { this.remove(); });
            confettiContainer.appendChild(confetti);
        }
        setTimeout(() => { floatingNav.classList.add('visible'); }, 500);
    }
});