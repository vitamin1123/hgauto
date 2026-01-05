// 启动目标应用
// app.launch("com.kmelearning")
// var sendButton = text("个人中心").findOne();
// sendButton.click();
// text("我的课程").findOne().click();
// text("参与中").findOne().click();

var parentList = className("android.view.View").scrollable(true).findOne();

// 2. 在这个容器的后代中搜索符合条件的节点
// 1. 获取所有深度为 15 的容器
var items = className("android.view.View").depth(15).find();
log("共找到 " + items.length + " 个列表项");

if (!items.empty()) {
    log("正在处理第一个项目...");
    var firstItem = items[0]; // 获取第一个项目
    
    // 在第一个项目里找所有的 TextView
    var textNodes = firstItem.find(className("android.widget.TextView"));
    
    // 检查是否至少有两个 TextView（第二个通常是标题）
    if (textNodes.length >= 2) {
        var titleNode = textNodes[1]; // 索引 1 是第二个内容
        log("准备点击标题: " + titleNode.text());
        
        // 执行点击操作
        // 注意：有些标题节点本身不可点击，建议点击它的父控件或者直接点击该坐标
        if (!titleNode.click()) {
            log("标题节点不可直接点击，尝试点击其中心坐标");
            click(titleNode.bounds().centerX(), titleNode.bounds().centerY());
        }
    } else {
        log("第一个项目中未找到足够的文字节点");
    }
} else {
    log("列表为空，未找到任何项目");
}
exit();