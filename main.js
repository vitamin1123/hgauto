// 主逻辑执行
main();

function main() {
    while (true) {
        log("正在扫描列表，寻找未完成的课程...");
        var target = findFirstIncomplete();

        if (target) {
            log("找到目标: " + target.title);
            
            // 1. 点击进入详情页
            target.node.click();
            sleep(3000); // 等待页面跳转和视频加载

            // 2. 点击播放按钮 (ID包含 "component")
            var playBtn = selector().idMatches(/.*component.*/).findOne(5000);
            if (playBtn) {
                log("点击播放按钮...");
                playBtn.click();
                
                // 3. 等待时长 + 2秒
                log("正在播放，预计等待: " + (target.duration / 1000 + 2) + "秒");
                sleep(target.duration + 20000);
                
                log("视频播放结束，尝试返回列表...");
                // back(); 
                sleep(2000);
            } else {
                log("未找到播放按钮，可能已在播放或布局变化");
                // back();
                sleep(2000);
            }
        } else {
            log("恭喜！所有课程已完成或当前页没有未完成项目。");
            break; 
        }
    }
}

/**
 * 寻找第一个未完成的课程并返回其信息
 */
function findFirstIncomplete() {
    var items = className("android.view.View").depth(12).find();
    for (var i = 0; i < items.length; i++) {
        var rows = items[i].find(className("android.view.View").clickable(true));
        for (var j = 0; j < rows.length; j++) {
            var row = rows[j];
            var status = checkLessonStatus(row);
            if (status === "incomplete") {
                return {
                    node: row,
                    title: row.child(1).text(),
                    duration: timeToMS(row.child(2).text())
                };
            }
        }
    }
    return null;
}

/**
 * 将 hh:mm:ss 转换为毫秒
 */
function timeToMS(timeStr) {
    var parts = timeStr.split(':');
    var s = 0;
    if (parts.length === 3) {
        s += parseInt(parts[0]) * 3600; // 时
        s += parseInt(parts[1]) * 60;   // 分
        s += parseInt(parts[2]);        // 秒
    }
    return s * 1000;
}

/**
 * 判断课程行状态 (保持之前的逻辑)
 */
function checkLessonStatus(rowNode) {
    var cc = rowNode.childCount();
    if (cc < 3 || cc > 4) return "unknown";
    
    var timeText = rowNode.child(2).text();
    if (!/\d{2}:\d{2}:\d{2}/.test(timeText)) return "unknown";

    // 规律：4个子节点且最后一个是Image则为完成
    if (cc === 4 && rowNode.child(3).className().includes("Image")) {
        return "completed";
    }
    // 3个子节点且无打勾标志则为未完成
    if (cc === 3) {
        return "incomplete";
    }
    return "unknown";
}