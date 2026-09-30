# ChatGPT 网页语音球挡住文字？我做了个能拖动、缩放、贴边隐藏的小脚本

**ChatGPT 网页语音球挡字？缩小、直接拖动球体、自动变淡，自动贴边收纳，鼠标移到边缘即可展开。**

[**安装 / 下载完整脚本**](https://raw.githubusercontent.com/00007-ym/chatgpt-voice-orb/refs/heads/main/chatgpt-voice-orb.user.js) · [English](#english)

## 2.5.12 更新

- 鼠标悬停小球，用滚轮调整到原球的 40%～150%，短暂显示比例，刷新记忆大小。
- 脚本管理器菜单提供“重置大小与位置 / Reset size & position”，恢复 70% 和右下角。

- 双击球体切换完全清晰／空闲半透明，刷新后记忆选择。
- 中英文操作引导只自动出现一次；关闭、刷新或反复收纳都不会再次弹出。管理器菜单仍可主动查看状态。

- 直接按住球体拖动，移除独立拖动按钮，位置仍会自动记忆。
- 移除圆环及独立工具栏，只保留球体直接拖动，没有 Emoji。
- 仅在可拖动范围最左／最右的 0.8% 内自动收纳，按保存位置判断，扩大中间常驻区域，保留细线；放在中间保持显示，刷新后也记忆位置。悬停或点击细线展开，鼠标离开约 1.1 秒后收回；首次中英文引导说明收纳与展开方式。
- 保留原球外观、70% 尺寸、25% 空闲透明度，以及两组隐藏快捷键。

## 前后对比

| 修改前 | 使用后（贴边收纳） |
| --- | --- |
| ![修改前：原球覆盖正文](./preview-before.png) | ![使用后：小球收纳至边缘细线](./preview.png) |

![2.5.12：直接拖动球体，边缘悬停展开，球体可拖动](./preview-hover.png)

图片为界面还原示意，使用演示文字。球体画面、原始尺寸与位置取自真实网页；使用后运行本仓库脚本，不含私人对话。实际效果随窗口和网页版本变化。

## 安装

1. 安装脚本猫或 Tampermonkey 用户脚本管理器。
2. 打开上方安装链接；若未出现安装界面，在管理器中新建普通脚本，将完整源码粘贴进去并保存。
3. 启用脚本，刷新 ChatGPT 网页，再开启语音模式。

**更新已有脚本时，全选替换旧代码，不要追加或复制 GitHub 差异页面；避免同时启用多个版本。** 混合新旧代码可能造成重复声明，导致整段脚本无法执行。

## 使用

| 功能 | 操作 |
| --- | --- |
| 移动 | 按住球体拖动；收纳时吸附最近的左／右侧并记忆高度 |
| 隐藏 | 靠近左右边缘时，鼠标离开自动收纳，或用快捷键立即收纳 |
| 恢复 | 鼠标移到左／右侧细线，或点击细线 |
| 快捷键 | Alt+Shift+V 或 Ctrl+Shift+H |
| 自动淡化 | 空闲透明度 25%，悬停或拖动时恢复清晰 |
| 恢复网页原样 | 停用脚本，再刷新 ChatGPT |

隐藏球体不会结束通话或关闭麦克风。快捷键可能与系统或其他扩展冲突，可通过边缘细线展开，鼠标离开后自动收纳。直接拖动需要球体区域接收鼠标，因此球体可见时不能穿透它选择下方文字；可先移开或隐藏球体。

## 常见问题

**语音球挡住文字，怎么移动？**
直接按住球体拖到空白处即可，无需寻找拖动按钮。

**安装后没有反应？**
开启语音后需要网页中存在悬浮球。脚本启动时右上角会出现版本状态，也可以在管理器菜单中重新显示状态。如果编辑器报重复声明，使用安装链接中的完整文件替换旧代码。

**会读取聊天或上传数据吗？**
脚本不读取聊天正文、不处理音频、不发送消息、不主动发起网络请求。仅保存位置、大小、清晰度偏好及引导已显示标记；加载后仅靠近左右边缘的位置会自动收纳。

## 验证与限制

2.5.12 已通过脚本猫 1.4.0 的实际安装测试：在独立 Edge 配置与模拟 ChatGPT DOM 上验证了启动、缩放、贴边收纳与悬停展开、左右侧中英文引导、两组快捷键、球体拖动、刷新后位置记忆、窗口缩放、清理还原及无页面异常。此测试不等于当前真实语音页面的完整验证。旧版本曾在真实 Edge 语音页面测试；Chrome 尚未单独实测。

通过稳定属性 data-testid="avatar-overlay-voice-orb" 定位，多个候选时不移动。ChatGPT 页面结构变化后可能需要更新。仅用于网页悬浮语音球，不适用于原生手机或桌面 App。非官方项目，与 OpenAI 无关联。

## English

ChatGPT Minimal Voice Orb is a userscript that moves, shrinks, fades or hides the floating ChatGPT web voice orb when it covers text.

**Version 2.5.12:** Hover over the orb and scroll to resize between 40% and 150%. A brief size indicator appears; the size survives reload. Use “Reset size & position” in the userscript manager menu to restore 70% at the bottom-right. Double-click the orb to toggle full opacity or idle fading; the preference survives reload. Bilingual instructions appear automatically only once. the orb only auto-docks within the outermost 0.8% of its draggable range on either side, using its saved position instead of transient page geometry. Leave it in the middle to keep it visible, including after reload. A thin line marks its position. Hover over or click the line to reveal; move away to tuck it back after about 1.1 seconds when near an edge. The one-time bilingual guide explains edge docking and revealing. Drag the orb itself to move it. The separate ring and toolbar have been removed. No eye icon or emoji. Alt+Shift+V and Ctrl+Shift+H also toggle visibility. Scale is 70%; idle opacity is 25%. Dock side and height are saved locally.

Install ScriptCat or Tampermonkey, open the installation link above, enable the script, reload ChatGPT and start voice mode. When replacing an existing script, replace the entire source rather than appending code or copying a GitHub diff. Disable the script and reload to restore the original interface.

Hiding does not end voice or mute the microphone. Visible orb dragging intercepts pointer input within the orb; move or hide it to select text underneath. The script does not read conversations, process audio, send messages or initiate network requests.

Tested via a real ScriptCat 1.4.0 installation in an isolated Edge profile against simulated ChatGPT DOM. Current-version end-to-end testing on the live voice page and separate Chrome testing have not been completed. The script depends on the floating orb's DOM attribute and may need updates after website changes. Unofficial; not affiliated with OpenAI.
