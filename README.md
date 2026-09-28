# ChatGPT 简约语音球 · Minimal Voice Orb

**ChatGPT 网页语音球挡字？缩小、拖动、自动变淡或快捷键隐藏，边聊边看更方便。**
*A lightweight Tampermonkey script that moves, shrinks, fades, or hides the ChatGPT voice orb so it stops covering your text.*

[**安装 / 下载脚本**](https://raw.githubusercontent.com/00007-ym/chatgpt-voice-orb/refs/heads/main/chatgpt-voice-orb.user.js) · [English](#english) · [安装步骤](#安装) · [使用说明](#使用)

## 前后对比

同一段文字、同一视角：原球保持 112 px；脚本开启后缩小到约 78 px，移到右下角，空闲透明度降为 25%。

| 修改前 | 使用后（空闲） |
| --- | --- |
| ![修改前：原尺寸原位置，球体覆盖正文](./preview-before.png) | ![使用后：缩小并移到右下角，正文完整可见](./preview.png) |

<details>
<summary>查看鼠标靠近时的工具栏</summary>

![悬停：球体恢复清晰，可拖动或隐藏](./preview-hover.png)

</details>

> 界面按实际网页的黑底白字还原，聊天内容为演示文字。球体画面和原始尺寸、位置取自关闭脚本后的真实网页，使用后运行本仓库脚本。以上为界面还原示意，不含私人对话；不同窗口尺寸和网页版本的效果可能不同。

---

## English

### What it does

This userscript keeps the ChatGPT web voice orb out of the way when it overlaps the conversation. It changes only the existing floating orb, so its ink animation and overall look stay the same. It does not replace the voice session, record audio, or send messages.

### Installation

[**One-click install**](https://raw.githubusercontent.com/00007-ym/chatgpt-voice-orb/refs/heads/main/chatgpt-voice-orb.user.js)

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Open the install link above. If no install page appears, open [`chatgpt-voice-orb.user.js`](./chatgpt-voice-orb.user.js) in this repository, copy the **full source** into a new Tampermonkey script, and save it.
3. Make sure the script is enabled, refresh ChatGPT, then start voice mode.

When updating, replace the old script instead of enabling two copies at once.

### Features

| Feature | Behavior |
| --- | --- |
| Size | Scales the orb to 70% of its original size |
| Position | Moves it toward the bottom-right by default; remembers the position you drag it to |
| Idle opacity | 25% while idle, full clarity on hover |
| Drag | Hover near the orb, then drag the `⠿` grip |
| Toolbar | Hides automatically about 1.5 seconds after the pointer leaves |
| Hide / show | `Alt+Shift+V` or `Ctrl+Shift+H` |
| After hiding | Click “显示球” (Chinese for “Show orb”), or press the shortcut again |

Hiding sets the orb's opacity to 0. It does **not** end the call or turn off the microphone.

### FAQ

**The orb covers my text — how do I move it?**
Hover near the orb until the small toolbar appears, then drag the `⠿` grip. The position is saved locally and stays after a refresh.

**How do I hide it?**
Press `Alt+Shift+V` or `Ctrl+Shift+H`, or click the hide button in the toolbar. The orb becomes transparent instead of ending voice.

**Does hiding end the voice conversation or mute me?**
No. The script only changes the orb's opacity; it never touches the voice session or the microphone.

**How do I restore the default orb?**
Disable or remove this script in Tampermonkey, then refresh the ChatGPT page. The orb returns to its original size and position.

**Does it upload my data?**
No. It makes no network requests and does not read the chat text or audio. Position and state are stored only in Tampermonkey's local storage.

**It installed but nothing happens.**
Confirm Tampermonkey is enabled and has site access for ChatGPT, then refresh the page and start voice mode. The script needs the floating orb to be present.

**Can I use it in Chrome?**
The implementation uses standard DOM and userscript APIs, but it has only been tested in Edge. Please verify it yourself in Chrome.

### Limitations and privacy

- **Tested only in Microsoft Edge** on the real ChatGPT voice page, covering shrink, drag, shortcut hiding, and toolbar auto-hide. Chrome has not been tested separately.
- It works only on interfaces that contain the floating voice orb (`data-testid="avatar-overlay-voice-orb"`). If ChatGPT changes its DOM, the script may need an update.
- If more than one candidate orb is found, the script deliberately does not move anything.
- Behavior can differ with window size and ChatGPT version.
- This is an unofficial project and is not affiliated with OpenAI.

---

## 它做什么

- **保留原球外观**：沿用网页的水墨动态，不重新着色、不添加装饰。

- **缩小到 70%**：语音球默认缩放到原尺寸的 70%，减少对正文的遮挡。
- **空闲透明度 25%**：空闲时球体变淡，鼠标移上去恢复清晰。
- **拖动并记忆位置**：抓住 `⠿` 可把球拖到任意位置，位置保存在本地，刷新后仍在原处。
- **工具栏自动收起**：鼠标离开约 1.5 秒后，操作工具栏自动隐藏。
- **快捷键隐藏 / 显示**：`Alt+Shift+V` 或 `Ctrl+Shift+H`。
- **隐藏不结束语音**：隐藏只是把球体透明度设为 0，不会结束通话或关闭麦克风。

## 安装

[**一键安装脚本**](https://raw.githubusercontent.com/00007-ym/chatgpt-voice-orb/refs/heads/main/chatgpt-voice-orb.user.js)

1. 在浏览器中安装 [Tampermonkey](https://www.tampermonkey.net/)。
2. 点击上方安装链接。若没有弹出安装页，打开本仓库的 [`chatgpt-voice-orb.user.js`](./chatgpt-voice-orb.user.js)，将**完整源码**复制进 Tampermonkey 的新脚本编辑器并保存。
3. 确认脚本已启用，刷新 ChatGPT，再开启语音模式。

更新时请替换旧脚本内容，不要同时启用多份。

## 使用

| 功能 | 行为 |
| --- | --- |
| 默认尺寸 | 原尺寸的 70% |
| 默认位置 | 右下角；拖动后使用记忆位置 |
| 空闲透明度 | 25%，鼠标移到球上恢复清晰 |
| 拖动 | 靠近球后抓住 `⠿` 拖动 |
| 工具栏 | 鼠标离开约 1.5 秒后收起 |
| 隐藏 / 显示 | `Alt+Shift+V` 或 `Ctrl+Shift+H` |
| 隐藏后恢复 | 点击“显示球”，或再次按快捷键 |

## 隐私与实现

脚本只通过 `data-testid="avatar-overlay-voice-orb"` 定位网页中的悬浮语音球，不读取聊天正文，不采集或播放音频，不发送消息，也不主动发起网络请求。位置等状态仅存在 Tampermonkey 本地。页面在后台时会暂停扫描，回到前台后再低频检查。

## 兼容性与限制

已在 Microsoft Edge 的真实 ChatGPT 语音页面验证缩小、拖动、快捷键隐藏与工具栏自动收起；Chrome 尚未单独实测。脚本仅对网页中存在悬浮语音球的界面生效，ChatGPT 更新 DOM 后可能需要适配。这是非官方项目，与 OpenAI 无关联。

## 常见问题

**语音球挡住文字，怎么移动？**
鼠标靠近球，出现小工具栏后，按住 `⠿` 拖动即可。位置会自动保存在本地，刷新后仍在该处。

**怎么隐藏或重新显示语音球？**
按 `Alt+Shift+V` 或 `Ctrl+Shift+H`，也可以点击工具栏上的“隐藏球 / 显示球”。隐藏只是让球体透明。

**隐藏球会中断语音吗？**
不会。隐藏不触碰语音会话或麦克风。

**怎么恢复默认，让语音球回到原来的大小和位置？**
在 Tampermonkey 中停用或删除本脚本，然后刷新 ChatGPT 页面。语音球会恢复网页原本的尺寸和位置，无需手动改回任何设置。

**会上传我的数据吗？**
不会。脚本无网络请求，也不读取聊天内容。

**装好后没有反应？**
确认 Tampermonkey 已启用、已授予 ChatGPT 的站点访问权限，然后刷新页面并开启语音模式。

**Chrome 能用吗？**
实现上使用标准 DOM 与用户脚本 API，但只在 Edge 实测，Chrome 请自行验证。

## 版本

当前版本 **2.5.3**。保持基础语音球整理功能，不包含额外装饰、用户球或消息发送。
