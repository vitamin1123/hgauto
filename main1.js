/**
易则 易知 自动脚本
author: xyy
 */

// 1. 初始化进入列表页


while (true) {
    log("--- 开始新一轮列表扫描 ---");
    
    // 2. 导航并刷新“未完成”课程列表
    refreshUnfinishedList();

    // 3. 寻找外层列表中的第一个课程大类
    var courseItems = className("android.view.View").depth(15).find();
    
    if (courseItems.empty()) {
        log("所有大类课程已处理完毕，或列表为空。");
        // 这里添加一个等待，防止频繁请求
        sleep(10000);
        continue;
    }

    // 4. 进入第一个大类项目
    var targetCourse = courseItems[0];
    log("进入课程大类: " + getCourseTitle(targetCourse));
    clickNode(targetCourse);
    
    // 5. 执行详情页内的学习（你提供的 detail 逻辑）
    var allDoneInDetail = doDetailLearning();

    // 6. 详情页处理完（或无未完成课），返回外层列表刷新
    log("返回外层列表...");
    back();
    sleep(2000); // 等待页面回退平稳
}



/**
 * 详情页学习逻辑：循环学习当前页面所有 incomplete 课程
 */
function doDetailLearning() {
    while (true) {
        log("正在详情页扫描未完成章节...");
        sleep(2000); // 等待列表加载
        var target = findFirstIncomplete();

        if (target) {
            log(">> 准备学习: " + target.title + " | 时长: " + (target.duration/1000) + "秒");
            
            // 点击进入章节
            clickNode(target.node);
            sleep(4000); // 等待播放器加载

            // 查找播放按钮并点击
            var playBtn = selector().idMatches(/.*component.*/).findOne(5000);
            if (playBtn) {
                log("点击播放...");
                playBtn.click();
                
                // 核心：等待视频播放结束 (时长 + 20秒缓冲)
                var waitTime = target.duration + 20000;
                log("播放中，预计倒计时: " + (waitTime / 1000) + "秒");
                sleep(waitTime);
                
                log("本节播放结束。");
                back(); // 从播放器返回到详情章节列表
                sleep(2000);
            } else {
                log("未找到播放按钮，跳过本节");
                back();
                sleep(1000);
            }
        } else {
            log("当前详情页所有章节已完成。");
            return true; 
        }
    }
}

/**
 * 定位第一个未完成的章节
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
 * 状态判断逻辑
 */
function checkLessonStatus(rowNode) {
    var cc = rowNode.childCount();
    if (cc < 3 || cc > 4) return "unknown";
    var timeText = rowNode.child(2).text();
    if (!/\d{2}:\d{2}:\d{2}/.test(timeText)) return "unknown";

    if (cc === 4 && rowNode.child(3).className().includes("Image")) return "completed";
    if (cc === 3) return "incomplete";
    return "unknown";
}

/**
 * 工具：hh:mm:ss 转 毫秒
 */
function timeToMS(timeStr) {
    var parts = timeStr.split(':');
    var s = 0;
    if (parts.length === 3) {
        s += parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return s * 1000;
}

/**
 * 工具：获取外层列表标题
 */
function getCourseTitle(item) {
    var tv = item.find(className("android.widget.TextView"));
    return tv.length >= 2 ? tv[1].text() : "未知标题";
}

/**
 * 导航逻辑
 */
function refreshUnfinishedList() {
    text("首页").findOne().click();
    sleep(500);
    text("查看更多").findOne().click();
    sleep(800);
    text("筛选").findOne().click();
    sleep(500);
    text("未完成").findOne().click();
    sleep(500);
    text("确定").findOne().click();
    sleep(1500); // 等待刷新完成
}

function setupApp() {
    app.launch("com.kmelearning");
    waitForPackage("com.kmelearning");
    sleep(3000);
}

function clickNode(node) {
    if (!node.click()) {
        click(node.bounds().centerX(), node.bounds().centerY());
    }
}