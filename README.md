# SC2 StarFinder - Frontend

约战匹配、赛事宣传、外挂举报、教学视频、直播列表

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
│   ├── FindMatch.vue          # 约战匹配
│   ├── MatchInfoPublicity.vue # 赛事宣传
│   ├── Tutorial.vue           # 教学视频
│   ├── StreamList.vue         # SC2 直播列表
│   ├── RecordCheater.vue      # 登记外挂
│   ├── CheaterList.vue        # 外挂图鉴
│   ├── Profile.vue            # 个人信息
│   ├── ProfileEdit.vue        # 编辑资料
│   ├── LoginUserName.vue      # 账号密码登录
│   ├── LoginUserPhone.vue     # 验证码登录
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

## 功能模块

| 模块     | 说明                               |
| -------- | ---------------------------------- |
| 约战匹配 | 选择种族 & MMR 范围，匹配同服玩家  |
| 赛事宣传 | 浏览/发布 SC2 赛事信息             |
| 教学视频 | 分类浏览教学视频（入门/进阶/高级） |
| 直播列表 | 实时获取 SC2 主播直播状态          |
| 外挂图鉴 | 搜索/浏览 已记录的外挂玩家         |
| 登记外挂 | 举报可疑外挂玩家                   |
| 个人信息 | 查看/编辑个人资料                  |

## License

MIT
