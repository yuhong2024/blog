# 📝 创作文件夹

这是您的**快捷创作入口**！

## 🚀 使用方法

1. **启动自动发布监听**：
   ```bash
   pnpm write
   ```

2. **直接放入 Markdown 文件**：
   - 将您写好的 `.md` 文件直接拖入这个文件夹
   - 脚本会自动检测并处理

3. **自动处理**：
   - ✅ 自动检查并补充 frontmatter（如果缺失）
   - ✅ 自动设置发布日期
   - ✅ 自动移动到发布文件夹 (`src/content/posts/`)
   - ✅ 自动删除源文件

## 📋 Frontmatter 说明

如果您的 Markdown 文件**没有 frontmatter**，脚本会自动生成：

```yaml
---
title: "文件名（自动提取）"
published: 2025-01-XX
description: ''
image: ''
tags: []
category: ''
draft: false
lang: ''
---
```

如果您的文件**已有 frontmatter**，脚本会：
- ✅ 保留您已有的字段
- ✅ 自动补充缺失的必需字段（title, published）
- ✅ 设置默认值（draft: false）

## 💡 示例

### 示例 1：没有 frontmatter 的文件

**文件内容** (`我的新文章.md`):
```markdown
# 我的新文章

这是文章内容...
```

**处理后自动生成**:
```markdown
---
title: "我的新文章"
published: 2025-01-XX
description: ''
image: ''
tags: []
category: ''
draft: false
lang: ''
---

# 我的新文章

这是文章内容...
```

### 示例 2：已有部分 frontmatter 的文件

**文件内容** (`技术分享.md`):
```markdown
---
title: "技术分享"
tags: [技术, 分享]
---

这是文章内容...
```

**处理后自动补充**:
```markdown
---
title: "技术分享"
published: 2025-01-XX
description: ''
image: ''
tags: [技术, 分享]
category: ''
draft: false
lang: ''
---

这是文章内容...
```

## ⚠️ 注意事项

- 如果目标文件已存在，脚本会跳过处理（避免覆盖）
- 文件处理完成后会自动从创作文件夹删除
- 建议在开发服务器运行的同时使用此功能，方便实时预览

## 🎯 工作流程建议

1. 启动开发服务器：`pnpm dev`
2. 启动自动发布：`pnpm write`（新终端窗口）
3. 在创作文件夹中创建/编辑 Markdown 文件
4. 文件自动发布后，在浏览器中查看效果

---

**提示**：您也可以直接使用 `pnpm new-post <文件名>` 创建新文章，但使用创作文件夹更加灵活快捷！

