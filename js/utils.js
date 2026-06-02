/**
 * 公共工具函数库
 * 提供 Cookie、LocalStorage 等通用操作
 */

// Cookie 操作工具
const CookieUtils = {
    /**
     * 读取 Cookie
     * @param {string} name - Cookie 名称
     * @returns {string|null} Cookie 值，不存在返回 null
     */
    get: function(name) {
        try {
            const cookies = document.cookie ? document.cookie.split(';') : [];
            for (let i = 0; i < cookies.length; i++) {
                const part = cookies[i].trim();
                if (!part) continue;
                const eqIndex = part.indexOf('=');
                const key = eqIndex >= 0 ? part.slice(0, eqIndex) : part;
                const val = eqIndex >= 0 ? part.slice(eqIndex + 1) : '';
                if (key === name) return decodeURIComponent(val);
            }
        } catch (e) {
            console.warn('读取 Cookie 失败:', e);
        }
        return null;
    },

    /**
     * 设置 Cookie
     * @param {string} name - Cookie 名称
     * @param {string} value - Cookie 值
     * @param {number} maxAgeSeconds - 最大存活时间（秒）
     */
    set: function(name, value, maxAgeSeconds) {
        try {
            const encoded = encodeURIComponent(value);
            const maxAge = typeof maxAgeSeconds === 'number' ? `; max-age=${maxAgeSeconds}` : '';
            document.cookie = `${name}=${encoded}${maxAge}; path=/; samesite=lax`;
        } catch (e) {
            console.warn('设置 Cookie 失败:', e);
        }
    },

    /**
     * 删除 Cookie
     * @param {string} name - Cookie 名称
     */
    delete: function(name) {
        this.set(name, '', 0);
    }
};

// LocalStorage 操作工具（带错误处理）
const StorageUtils = {
    /**
     * 读取 LocalStorage
     * @param {string} key - 键名
     * @returns {string|null} 值，不存在或出错返回 null
     */
    get: function(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('读取 LocalStorage 失败:', e);
            return null;
        }
    },

    /**
     * 设置 LocalStorage
     * @param {string} key - 键名
     * @param {string} value - 值
     */
    set: function(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('设置 LocalStorage 失败:', e);
        }
    },

    /**
     * 删除 LocalStorage
     * @param {string} key - 键名
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('删除 LocalStorage 失败:', e);
        }
    }
};

// 敏感词检测工具
const SensitiveWordUtils = {
    /**
     * 检查文本是否包含敏感词
     * @param {string} text - 待检查文本
     * @param {Array} words - 敏感词数组
     * @returns {boolean} 是否包含敏感词
     */
    contains: function(text, words) {
        if (!text || !words || !Array.isArray(words)) {
            return false;
        }
        
        const lowerText = text.toLowerCase();
        for (let word of words) {
            if (lowerText.includes(word.toLowerCase())) {
                return true;
            }
        }
        return false;
    },

    /**
     * 获取匹配的敏感词
     * @param {string} text - 待检查文本
     * @param {Array} words - 敏感词数组
     * @returns {string|null} 匹配的第一个敏感词，无匹配返回 null
     */
    findMatch: function(text, words) {
        if (!text || !words || !Array.isArray(words)) {
            return null;
        }
        
        const lowerText = text.toLowerCase();
        for (let word of words) {
            if (lowerText.includes(word.toLowerCase())) {
                return word;
            }
        }
        return null;
    }
};

// 将工具函数挂载到全局，供其他脚本使用
if (typeof window !== 'undefined') {
    window.CookieUtils = CookieUtils;
    window.StorageUtils = StorageUtils;
    window.SensitiveWordUtils = SensitiveWordUtils;
}
