// 全站主题（深色/浅色）切换：通过 html[data-theme] 控制 CSS 变量
(function () {
    const STORAGE_KEY = 'site_theme';
    const COOKIE_KEY = 'site_theme';
    const THEMES = { dark: 'dark', light: 'light' };

    function readSavedTheme() {
        // 优先从 LocalStorage 读取
        const fromStorage = StorageUtils.get(STORAGE_KEY);
        if (fromStorage === THEMES.dark || fromStorage === THEMES.light) return fromStorage;

        // 其次从 Cookie 读取
        const fromCookie = CookieUtils.get(COOKIE_KEY);
        if (fromCookie === THEMES.dark || fromCookie === THEMES.light) return fromCookie;

        // 最后检测系统偏好
        try {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                return THEMES.light;
            }
        } catch (e) {}

        return THEMES.dark;
    }

    function applyTheme(theme) {
        const t = theme === THEMES.light ? THEMES.light : THEMES.dark;
        document.documentElement.setAttribute('data-theme', t);
        StorageUtils.set(STORAGE_KEY, t);
        CookieUtils.set(COOKIE_KEY, t, 60 * 60 * 24 * 365);
        return t;
    }

    function ensureToggle() {
        // 优先使用页面上已经写好的按钮，否则自动创建一个
        let btn = document.querySelector('[data-theme-toggle]');
        const created = !btn;

        if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'theme-toggle';
            btn.setAttribute('data-theme-toggle', '1');
            btn.setAttribute('aria-label', '切换深色/浅色模式');
        }

        function render() {
            const current = document.documentElement.getAttribute('data-theme') || THEMES.dark;
            btn.textContent = current === THEMES.light ? '深色模式' : '白天模式';
            btn.setAttribute('title', btn.textContent);
        }

        // 避免重复绑定
        btn.removeEventListener('click', btn.__themeToggleHandler || (() => {}));
        btn.__themeToggleHandler = function () {
            const current = document.documentElement.getAttribute('data-theme') || THEMES.dark;
            const next = current === THEMES.light ? THEMES.dark : THEMES.light;
            applyTheme(next);
            render();
        };
        btn.addEventListener('click', btn.__themeToggleHandler);

        render();
        if (created) {
            document.body.appendChild(btn);
        }
    }

    // 尽可能早应用主题，减少闪烁
    applyTheme(readSavedTheme());

    // DOM 就绪后注入切换按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureToggle);
    } else {
        ensureToggle();
    }
})();
