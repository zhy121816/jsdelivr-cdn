// 导航切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 移动端访问提示功能
    const mobileWarning = document.getElementById('mobileWarning');
    const mobileWarningConfirm = document.getElementById('mobileWarningConfirm');
    
    // 检测是否为移动设备
    function isMobile() {
        const userAgent = navigator.userAgent;
        
        // 真正的移动设备（手机）
        const isPhone = /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        
        // iPad 检测（iPadOS 13+ 会显示为 Mac，需要额外检测触摸支持）
        const isIPad = /iPad/i.test(userAgent) || 
                      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        // 桌面系统检测
        const isDesktopOS = /Windows NT|Macintosh|Linux|x86_64/i.test(userAgent);
        
        // 如果是桌面系统且不是真正的移动设备，则不显示
        if (isDesktopOS && !isPhone && !isIPad) {
            return false;
        }
        
        return isPhone || isIPad;
    }
    
    // 检查是否已经显示过提示
    function hasSeenWarning() {
        return false; // 每次都显示
    }
    
    // 显示移动端警告
    if (isMobile() && !hasSeenWarning() && mobileWarning) {
        setTimeout(() => {
            mobileWarning.classList.add('active');
        }, 500); // 延迟 0.5 秒显示
    }
    
    // 确认按钮点击事件
    if (mobileWarningConfirm && mobileWarning) {
        mobileWarningConfirm.addEventListener('click', function() {
            mobileWarning.classList.remove('active');
            // 不再记录 localStorage，每次都显示
        });
    }
    // 公告弹窗功能
    const announcementModal = document.getElementById('announcementModal');
    const announcementConfirm = document.getElementById('announcementConfirm');
    const announcementDontShow = document.getElementById('announcementDontShow');
    
    // 页面加载时显示公告弹窗
    if (announcementModal) {
        try {
            const currentVersion = announcementModal.getAttribute('data-announcement-version') || '';
            const dismissedVersion = StorageUtils.get('announcement_dismissed_version') || '';
            const dismissedCookie = CookieUtils.get('announcement_dismissed_version') || '';
            const isDismissed = !!currentVersion && (dismissedVersion === currentVersion || dismissedCookie === currentVersion);
            if (!currentVersion || !isDismissed) {
                announcementModal.classList.add('active');
            }
        } catch (e) {
            announcementModal.classList.add('active');
        }
    }
        
    // 确定按钮点击事件
    if (announcementConfirm) {
        announcementConfirm.addEventListener('click', function() {
            if (announcementModal) {
                try {
                    const currentVersion = announcementModal.getAttribute('data-announcement-version') || '';
                    if (announcementDontShow && announcementDontShow.checked && currentVersion) {
                        StorageUtils.set('announcement_dismissed_version', currentVersion);
                        // 同时写 cookie，避免部分环境 localStorage 不持久化
                        CookieUtils.set('announcement_dismissed_version', currentVersion, 60 * 60 * 24 * 365);
                    } else {
                        // 未勾选则清除“已读版本”，下次仍会提醒
                        StorageUtils.remove('announcement_dismissed_version');
                        CookieUtils.delete('announcement_dismissed_version');
                    }
                } catch (e) {
                    // 忽略 localStorage 异常
                }
                announcementModal.classList.remove('active');
            }
        });
    }
    
    
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    function showSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (!target) return;
        navButtons.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        const btn = document.querySelector('.nav-btn[data-section="' + sectionId + '"]');
        if (btn) btn.classList.add('active');
        target.classList.add('active');
    }
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 如果按钮已经处于 active 状态，不执行任何操作
            if (this.classList.contains('active')) {
                return;
            }
            showSection(this.getAttribute('data-section'));
        });
    });
    
    // 若 URL 带 #栏目 id（如 #comments、#games、#projects）则直接显示对应栏目
    var hash = window.location.hash.slice(1);
    if (hash) {
        var targetSection = document.getElementById(hash);
        if (targetSection && targetSection.classList.contains('section')) {
            showSection(hash);
        }
    }
    
    // 卡片悬停效果增强
    const cards = document.querySelectorAll('.card, .article-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // 添加页面加载动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有卡片
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // 留言区前端校验：最多 1024 字符，最多 32 行换行，敏感词检测
    const commentTextarea = document.getElementById('comment_content');
    const commentForm = document.querySelector('.comment-form');
    const commentSubmit = commentForm ? commentForm.querySelector('.comment-submit') : null;
    const commentErrorEl = document.getElementById('js-comment-error');
    if (commentTextarea && commentSubmit) {
        const MAX_LEN = 1024;
        const MAX_LINES = 32;
        // 敏感词库（从全局变量获取）
        const sensitiveWords = window.sensitiveWords || [];

        function validateComment() {
            const value = commentTextarea.value || '';
            const length = value.length;
            const newlineCount = (value.match(/\n/g) || []).length;
            const tooLong = length > MAX_LEN;
            const tooManyLines = newlineCount > MAX_LINES;
            const empty = value.trim() === '';
            const hasSensitiveWord = SensitiveWordUtils.contains(value, sensitiveWords);

            const invalid = empty || tooLong || tooManyLines || hasSensitiveWord;
            commentSubmit.disabled = invalid;

            // 根据错误类型显示对应提示
            if (hasSensitiveWord) {
                if (commentErrorEl) {
                    commentErrorEl.textContent = '含有违规词语';
                    commentErrorEl.style.display = 'block';
                }
            } else if (tooLong) {
                if (commentErrorEl) {
                    commentErrorEl.textContent = '内容太长啦，最多只能写 1024 个字~';
                    commentErrorEl.style.display = 'block';
                }
            } else if (tooManyLines) {
                if (commentErrorEl) {
                    commentErrorEl.textContent = '换行太多啦，最多只能有 32 行~';
                    commentErrorEl.style.display = 'block';
                }
            } else if (empty) {
                if (commentErrorEl) {
                    commentErrorEl.textContent = '留言内容不能为空~';
                    commentErrorEl.style.display = 'block';
                }
            } else {
                if (commentErrorEl) {
                    commentErrorEl.style.display = 'none';
                    commentErrorEl.textContent = '';
                }
            }
        }

        commentTextarea.addEventListener('input', validateComment);
        // 初始也校验一次
        validateComment();
    }

    // 每 1 分钟检查一次是否被封禁（若被封则自动刷新/下线）
    setInterval(() => {
        fetch('api/check-ban.php', {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store'
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.banned) {
                    // 被封禁后刷新页面，触发后端逻辑显示未登录状态
                    window.location.reload();
                }
            })
            .catch(() => {
                // 忽略网络错误
            });
    }, 60000);
    
    // ========== 广告轮播功能 ==========
    const adCarousel = document.getElementById('adCarousel');
    if (adCarousel) {
        const slides = adCarousel.querySelectorAll('.ad-slide');
        const indicators = adCarousel.querySelectorAll('.ad-indicator');
        const arrowLeft = document.getElementById('adArrowLeft');
        const arrowRight = document.getElementById('adArrowRight');
        let currentIndex = 0;
        let autoPlayTimer = null;
        
        // 切换到指定索引的广告
        function goToSlide(index) {
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }
            
            // 移除所有活动状态
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // 设置新的活动状态
            slides[index].classList.add('active');
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }
            
            currentIndex = index;
        }
        
        // 下一个广告
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        // 上一个广告
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        // 开始自动播放
        function startAutoPlay() {
            if (slides.length > 1) {
                autoPlayTimer = setInterval(nextSlide, 4000); // 每 4 秒切换
            }
        }
        
        // 停止自动播放
        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }
        
        // 左右箭头点击事件
        if (arrowLeft) {
            arrowLeft.addEventListener('click', function() {
                prevSlide();
                stopAutoPlay();
                startAutoPlay(); // 重置自动播放计时器
            });
        }
        
        if (arrowRight) {
            arrowRight.addEventListener('click', function() {
                nextSlide();
                stopAutoPlay();
                startAutoPlay(); // 重置自动播放计时器
            });
        }
        
        // 指示器点击事件
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                goToSlide(index);
                stopAutoPlay();
                startAutoPlay(); // 重置自动播放计时器
            });
        });
        
        // 鼠标悬停时暂停自动播放
        adCarousel.addEventListener('mouseenter', stopAutoPlay);
        adCarousel.addEventListener('mouseleave', startAutoPlay);
        
        // 触摸滑动支持
        let touchStartX = 0;
        let touchEndX = 0;
        
        adCarousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });
        
        adCarousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50; // 最小滑动距离
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // 向左滑动，下一个
                    nextSlide();
                } else {
                    // 向右滑动，上一个
                    prevSlide();
                }
            }
        }
        
        // 启动自动播放
        startAutoPlay();
    }
});
