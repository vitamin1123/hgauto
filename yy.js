app.launch("com.kmelearning")
var sendButton = text("首页").findOne();
sendButton.click();
text("查看更多").findOne().click();
text("筛选").findOne().click();
text("未完成").findOne().click();
text("确定").findOne().click();


// text("我的课程").findOne().click();
// text("参与中").findOne().click();

var parentList = className("android.view.View").scrollable(true).findOne();

// 2. 在这个容器的后代中搜索符合条件的节点
// 1. 获取所有深度为 15 的容器节点
var items = className("android.view.View").depth(15).find();
log("共找到 " + items.length + " 个列表项");

items.forEach(function(item, i) {
    log("--- 正在处理第 " + (i + 1) + " 个项目 ---");
    
    // 2. 在当前这个 item 节点内部，寻找所有的 TextView
    var textNodes = item.find(className("android.widget.TextView"));
    
    // 3. 遍历提取并打印出该项目内所有的文字
    if (textNodes.empty()) {
        log("该项内部没有找到文字节点");
    } else {
        textNodes.forEach(function(tv) {
            var txt = tv.text();
            if (txt) {
                log("内容: " + txt);
            }
        });
    }
});



exit();