# SC2 StarFinder - Frontend

SC2 StarFinder 前端站点，采用侧边栏单页布局，覆盖教学、约战、战队、直播、举报、公示、社区反馈与管理后台等功能。

---

## 技术栈

| 类别 | 技术                                                 |
| ---- | ---------------------------------------------------- |
| 框架 | Vue 3 (Composition API)                              |
| 路由 | Vue Router 4                                         |
| HTTP | Axios                                                |
| 构建 | Vue CLI 5                                            |
| 样式 | Scoped CSS + CSS Variables                           |
| 字体 | Google Fonts (Orbitron / Rajdhani / Share Tech Mono) |

## 项目结构

```
src/
├── App.vue                    # 根组件 & 全局SC2主题变量
├── main.js                    # 入口
├── homePage.vue               # 主页面（侧边栏 + 内容区）
├── loginPage.vue              # 登录页
├── registerPage.vue           # 注册页
├── api/
│   └── api.js                 # Axios API 封装
├── assets/
│   ├── icons/
│   │   ├── terran.png         # 人族图标
│   │   ├── zerg.png           # 异虫图标
│   │   ├── protoss.png        # 星灵图标
│   │   └── random.png         # 随机图标
│   └── pics/
│       ├── login-cover.jpg    # 登录封面
│       └── profile-image.png  # 默认头像
├── components/
│   ├── Tutorial.vue           # 教学中心（视频 / 陪玩陪练 / 文字教学 / Replay）
│   ├── FindMatch.vue          # 约战匹配（1v1 / 2v2 / 3v3 / 4v4 / 合作任务）
│   ├── ClanInfo.vue           # 战队排行榜 / 搜索 / 招新
│   ├── StreamList.vue         # 直播列表
│   ├── PublicReports.vue      # 挂人区
│   ├── RecordCheater.vue      # 登记外挂
│   ├── CheaterList.vue        # 外挂图鉴
│   ├── QqGroupPromo.vue       # Q群宣传
│   ├── MatchInfoPublicity.vue # 赛事宣传
│   ├── FindMmr.vue            # MMR 查询
│   ├── BugFeedback.vue        # BUG 及其他反馈
│   ├── AdminPanel.vue         # 管理后台
│   ├── Profile.vue            # 个人信息
│   ├── ProfileEdit.vue        # 编辑资料
│   ├── AIAssistant.vue        # AI 助手（预留页面）
│   ├── LoginUserName.vue      # 账号密码登录
│   ├── LoginUserPhone.vue     # 验证码登录
│   ├── ForgotPassword.vue     # 找回密码
│   ├── Register.vue           # 注册表单
│   └── widgets/
│       ├── wSubmitButton.vue   # 提交按钮
│       └── wTextButton.vue     # 文字按钮
├── css/
│   └── widgets.css             # 全局输入框 & 面板样式
└── router/
    └── router.js               # 路由配置
```

## 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装 & 运行

```bash
# 安装依赖
npm install

# 开发模式启动（端口 3000）
npm run serve

# 生产构建
npm run build
```

### 后端连接

开发服务器已配置代理，所有 `/api` 请求自动转发至 `http://localhost:8089`：

```js
// vue.config.js
devServer: {
    port: 3000,
    proxy: {
        '/api': {
            target: 'http://localhost:8089',
            changeOrigin: true
        }
    }
}
```

## UI 设计风格

采用 **StarCraft II 暗色科幻主题**：

- **配色**: 深空蓝黑底 + 赛博青色高亮 (`#00b4d8`)
- **字体**: Orbitron (标题) + Rajdhani (正文) + Share Tech Mono (数据)
- **视觉特效**: 渐变面板边框、光晕发光、脉冲动画、毛玻璃效果
- **种族配色**: 人族橙 `#e07020` / 异虫紫 `#b030c0` / 星灵蓝 `#30a0e0`

## Sidebar 导航功能

当前侧边栏已覆盖以下页面与能力：

| 侧边栏入口 | 子项/页面 | 说明 |
| -------- | -------- | ---- |
| 教学 | 教学视频 / 陪玩陪练 / 文字教学 / Replay 下载 | 支持分类浏览、发布内容、上传 Replay 文件 |
| 约战 | 1v1 / 2v2 / 3v3 / 4v4 / 合作任务 | 按模式、MMR、种族或合作等级进行匹配 |
| 战队 | 战队排行榜 / 搜索战队 / 战队招新 | 查看排行榜、搜索战队、发布和删除招新信息 |
| 直播列表 | 单页入口 | 聚合 SC2 直播信息 |
| 挂人区 | 单页入口 | 搜索、发布、查看挂人记录，支持上传截图 |
| 外挂图鉴 | 登记外挂 / 外挂图鉴 | 举报疑似外挂玩家，并浏览已收录记录 |
| Q群宣传 | 单页入口 | 发布、浏览、删除 SC2 QQ 群宣传信息 |
| 赛事宣传 | 单页入口 | 浏览和发布赛事宣传内容 |
| MMR 查询 | 单页入口 | 查询玩家跨服务器 MMR 汇总与分模式数据 |
| BUG及其他反馈 | 单页入口 | 提交反馈、查看自己的反馈记录与公开反馈汇总 |
| 管理后台 | 管理员可见 | 统一管理用户、赛事、外挂、教程、文字教学、陪练、挂人区、QQ群、反馈等内容 |
| 个人信息 | 登录后显示 | 查看个人资料、头像、MMR 和编辑信息 |
| 登录/登出 | 侧边栏底部 | 未登录时跳转登录，已登录时支持退出 |

## 路由概览

前端已配置与侧边栏对应的主要路由：

- `/tutorial`
- `/match/:mode`
- `/clan`
- `/streams`
- `/public-reports`
- `/cheater/report`
- `/cheater/list`
- `/qq-group`
- `/events`
- `/mmr`
- `/feedback`
- `/admin`
- `/profile`

## License

MIT
