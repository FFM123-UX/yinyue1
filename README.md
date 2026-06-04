# 音乐播放器

**学号：24215220205 | 姓名：范籽雯**

一个精美的网页音乐播放器，支持倍速播放、播放列表、MV 播放等功能。

## 在线预览

https://3zb6haufr6cco.ok.kimi.link

## 功能特性

- 播放/暂停（唱片旋转动画）
- 上一首/下一首（背景图联动切换）
- 进度条拖拽跳转
- 音量控制（含静音切换）
- 播放模式（列表循环 / 单曲循环 / 随机播放）
- **倍速播放（0.5x / 0.75x / 1x / 1.25x / 1.5x / 2x）**
- 播放列表弹窗
- MV 视频播放
- 键盘快捷键（空格播放/暂停，方向键切歌）

## 技术栈

- React + TypeScript + Vite
- Tailwind CSS
- HTML5 Audio / Video API

## 项目结构

```
src/
  App.tsx              # 主组件
  main.tsx             # 入口文件
  index.css            # 全局样式
  data/
    songs.ts           # 歌曲数据
  hooks/
    useAudioPlayer.ts  # 播放器核心逻辑
  sections/
    Player.tsx         # 播放器界面
    Playlist.tsx       # 播放列表
    MVPlayer.tsx       # MV 播放器
  types/
    index.ts           # 类型定义
public/assets/         # 音乐/视频/图片资源
```

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打包构建
npm run build
```

## 部署到 GitHub Pages

1. 打包项目：`npm run build`
2. 将 `dist` 文件夹内容推送到仓库
3. 在 GitHub 仓库 Settings > Pages 中开启 GitHub Pages
