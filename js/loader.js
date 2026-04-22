/**
 * 页面加载动画控制脚本
 * 所有引用了 layout.css 的页面都可以使用
 */

(function() {
    const loader = document.getElementById('page-loader');
    
    if (!loader) return;
    
    // 等待页面完全加载（包括 iframe、图片等所有资源）
    window.addEventListener('load', function() {
        // 延迟一点时间，确保内容完全渲染
        setTimeout(function() {
            // 添加隐藏类，触发淡出动画
            loader.classList.add('hidden');
            
            // 500ms 后完全移除 DOM 元素（与 CSS transition 时间一致）
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }, 300);
    });
})();
