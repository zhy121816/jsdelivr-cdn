/**
 * 布局通用功能 - 登录状态检测
 */

// 初始化登录状态显示
function initLoginStatus() {
    const username = CookieUtils.get('username');
    const loggedInView = document.getElementById('loggedInView');
    const logoutBtn = document.getElementById('logoutBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    if (!loggedInView || !logoutBtn || !registerBtn || !loginBtn) {
        return; // 如果页面没有这些元素，直接返回
    }
    
    if (username) {
        // 已登录：显示用户名和退出按钮
        usernameDisplay.textContent = username;
        loggedInView.style.display = 'inline-flex';
        logoutBtn.style.display = 'inline-block';
        registerBtn.style.display = 'none';
        loginBtn.style.display = 'none';
    } else {
        // 未登录：显示注册和登录按钮
        loggedInView.style.display = 'none';
        logoutBtn.style.display = 'none';
        registerBtn.style.display = 'inline-block';
        loginBtn.style.display = 'inline-block';
    }
}

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', initLoginStatus);

/**
 * 点击特效 - 编程关键字飘动效果
 */
(function() {
    // 编程关键字列表
    const keywords = [
        'int', 'float', 'double', 'long', 'class', 'struct', 
        'asm', 'include', 'using', 'namespace', 'std', 
        'return', 'for', 'while', 'define',
        'if', 'else', 'break', 'continue', 
        'try', 'catch', 'public', 'signed', 'unsigned', 
        'bool', 'char', 'auto', 'sizeof', 'short', 
        'new', 'typedef', 'error', 'register', 'static', 
        'delete', 'extern', 'const', 'private', 'protected', 
        'this', 'virtual', 'friend', 'undef', 'exit', 
        'echo', 'sudo', 'ping', 'goto', 
        'iostream', 'string', 'main', 'DP',
        'DFS', 'BFS', 'KMP', 'FFT', 'SPFA', 'Dijkstra', 
        'STL', 'BST', 'GCD', 'LCM', 'API', 
        'WA', 'AC', 'TLE', 'MLE', 'OLE', 'RE', 'UKE', 'CE', 
        'GESP', 'CSP-J', 'CSP-S', 'NOIP', 'NOI', 
        'CTS', 'CTT', 'IOI', 'WC', 'ICPC', 'CCPC', 
        'and', 'or', 'xor', 'or_eq', 'xor_eq', 'and_eq',
        'BASIC', 'C++', 'Java', 'C', 'PHP', 'Python', 
        'C#', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 
        'DOS', 'Rust', 'Ruby', 'Go',
        'DIR', 'mkdir', 'ipconfig', 'cls', 'pause',
        'Minecraft万岁', 'C418', 'Block', 'Jeb', 'Notch', 'Mojang',
        'CMD', 'BASH', 'Creeper', '"雷石东直放站"', '"大火杆"', '"黑沉沉泪"', '"银鱼"',
        '"你挂了"', 'Indev', 'Infdef', 'Cave Game',
        'Minecraft 1.0.0', 'Minecraft 1.5.2', 'Minecraft 1.8.8',
        'Minecraft 1.12.2', 'Minecraft 26.1', 'minecraft.net',
        'rd-132211', 'Pre-Classic', 'Technoblade', 'Dream',
        'TCP', 'IP', 'Proxy', 'Cache', 'CPU', 'GPU',
        'HTTP', 'HTTPS', 'SSL', 'IPv4', 'IPv6',
        'Hash', 'Object', 'function',
        'true', 'false', 'inline', 'warning', 'pragma',
        'cout', 'cin', 'printf', 'scanf',
        'sin', 'cos', 'tan', 'log', '3.14',
        '暴破', '递归', '回溯', '递推',
        '深度优先搜索', '广度优先搜索',
        'bitmask', '快速傅里叶变换', '最大公因数', '最小公倍数',
        '动态规划', '中国', '毛泽东', '1949年10月1日',
        '我的世界中国版', '线性DP', '区间DP', '树形DP',
        '状态压缩DP', '数位DP', '概率DP', '期望DP',
        '计数DP', '插头DP', '轮廓线DP',
        '无向图', '有向图', '树', '正则图', '平面图',
        '欧拉图', '哈密顿图', '二叉搜索树',
        '完美二叉树', '完全二叉树', '记忆化暴搜', '哈希',
        '"正在治愈"',
        '抵制不良游戏，拒绝盗版游戏。',
        '注意自我保护，谨防受骗上当。',
        '适度游戏益脑，沉迷游戏伤身。',
        '合理安排时间，享受健康生活。'
    ];
    
    // 创建飘动的关键字
    function createFloatingKeyword(x, y) {
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        
        // 检测当前主题
        const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
        
        // 根据主题选择颜色：深色主题用亮色，浅色主题用深色
        const darkThemeColors = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#a29bfe', '#fd79a8'];
        const lightThemeColors = ['#0066cc', '#cc0000', '#009999', '#0077aa', '#228844', '#cc8800', '#6633cc', '#cc3366'];
        
        const colors = isLightTheme ? lightThemeColors : darkThemeColors;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const element = document.createElement('div');
        element.textContent = keyword;
        element.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-size: ${Math.random() * 8 + 14}px;
            font-weight: bold;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            pointer-events: none;
            z-index: 9999;
            text-shadow: 
                0 0 5px ${color},
                0 0 10px ${color},
                0 0 15px ${color};
            user-select: none;
            white-space: nowrap;
        `;
        
        document.body.appendChild(element);
        
        // 动画参数
        let opacity = 1;
        let posY = y;
        const floatDistance = Math.random() * 60 + 40; // 向上飘 40-100px
        const duration = 1500; // 1.5秒
        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // 向上飘动
                posY = y - (floatDistance * progress);
                // 淡出效果
                opacity = 1 - progress;
                
                element.style.top = posY + 'px';
                element.style.opacity = opacity;
                element.style.transform = `scale(${1 + progress * 0.3})`;
                
                requestAnimationFrame(animate);
            } else {
                element.remove();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // 监听点击事件
    document.addEventListener('click', function(e) {
        createFloatingKeyword(e.clientX, e.clientY);
    });
})();
