

var parentList = className("android.view.View").scrollable(true).findOne();


// 1. 获取所有列表项容器（保持你测试成功的深度）
var items = className("android.view.View").depth(12).find();
log("共找到 " + items.length + " 个列表项容器");

items.forEach(function(item, i) {
    // 我们要找的是 item 内部那些 Clickable 的 View（即每一讲的行控件）
    var rows = item.find(className("android.view.View").clickable(true));
    
    rows.forEach(function(row) {
        var status = checkLessonStatus(row);
        if (status !== "unknown") {
            var title = row.child(1).text(); // 第二个元素通常是标题
            var time = row.child(2).text();  // 第三个元素是时间
            log("--------------------------------");
            log("课程: " + title);
            log("时长: " + time);
            log("状态: 【" + (status === "completed" ? "已完成" : "未完成") + "】");
        }
    });
});

/**
 * 判断课程行状态的函数
 * @param {UiObject} rowNode 
 * @returns {string} "completed" | "incomplete" | "unknown"
 */
function checkLessonStatus(rowNode) {
    var cc = rowNode.childCount();
    
    // 基础校验：子节点数量必须是 3 或 4
    if (cc < 3 || cc > 4) return "unknown";

    // 提取子节点类型简写列表，例如 ["Image", "TextView", "TextView"]
    var pattern = [];
    for (var i = 0; i < cc; i++) {
        var child = rowNode.child(i);
        if (!child) return "unknown";
        pattern.push(child.className().replace("android.widget.", ""));
    }

    // 校验第二个 TextView 是否为时间格式 (00:00:00)
    var timeText = rowNode.child(2).text();
    var isTime = /\d{2}:\d{2}:\d{2}/.test(timeText);
    if (!isTime) return "unknown";

    // 模式匹配逻辑
    if (cc === 4 && 
        pattern[0] === "Image" && 
        pattern[1] === "TextView" && 
        pattern[2] === "TextView" && 
        pattern[3] === "Image") {
        return "completed";
    }

    if (cc === 3 && 
        pattern[0] === "Image" && 
        pattern[1] === "TextView" && 
        pattern[2] === "TextView") {
        return "incomplete";
    }

    return "unknown";
}

exit();