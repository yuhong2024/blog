---
title: "表格根据系统发育树叶节点顺序排序的完整实现方法"
published: 2024-05-12
updated: 2024-05-12
description: "详细介绍了如何实现系统发育树与表格的联动排序，确保表格行顺序与树的叶节点顺序严格一致。"
tags: ["系统发育树", "表格排序", "前端开发", "Vue3"]
category: "技术笔记"
lang: "zh_CN"
draft: false
---

# 表格根据系统发育树叶节点顺序排序的完整实现方法

## 1. 需求分析

- **目标**：让表格的每一行顺序严格与系统发育树（Phylogenetic Tree）的叶节点顺序一致，实现树与表格的联动和一一对应。
- **数据来源**：树结构为 Newick 格式，表格数据为 txt/tsv 文件，二者通过叶节点名（如 Assembly 字段）关联。

## 2. 实现方案

### 2.1 解析表格数据

- 读取 table.txt，按行分割，首行为表头，生成对象数组。

```js
function parseTableTxt(txt) {
  const lines = txt.trim().split('\n')
  const header = lines[0].split('\t')
  return lines.slice(1).map(line => {
    const cols = line.split('\t')
    const obj = {}
    header.forEach((h, i) => {
      obj[h] = cols[i]
    })
    return obj
  })
}
```

### 2.2 获取树的叶节点顺序

- 渲染树后，递归遍历树结构，提取所有叶节点的 name，得到顺序数组。

```js
function getLeafNamesFromNodes(nodeOrArray) {
  if (Array.isArray(nodeOrArray)) {
    return nodeOrArray.flatMap(getLeafNamesFromNodes)
  }
  if (!nodeOrArray.children || nodeOrArray.children.length === 0) {
    return [nodeOrArray.data.name]
  }
  return nodeOrArray.children.flatMap(getLeafNamesFromNodes)
}
```

### 2.3 排序表格数据

- 用叶节点顺序数组 leafOrderList 和表格数据 tableData，生成排序后的表格。

```js
function sortTableByLeafOrder(leafOrder, tableRows) {
  const tableMap = new Map(tableRows.map(row => [row.Assembly, row]))
  return leafOrder.map(name => tableMap.get(name)).filter(Boolean)
}
```

### 2.4 表格渲染

- 在模板中用 `sortedTableData` 渲染表格：

```vue
<tr v-for="(row, idx) in sortedTableData" :key="row.Assembly">
  <td>{{ row.Assembly }}</td>
  <!-- 其他列 -->
</tr>
```

## 3. 技术要点

| 特性 | 说明 |
|------|------|
| 排序本质 | 用树的叶节点顺序作为主序列，表格数据用 Map 快速索引，O(n) 完成排序 |
| 健壮性 | 如树中有表格未匹配项，`filter(Boolean)` 可自动跳过，避免报错 |
| 响应式 | 只要树或表格数据变化，排序自动更新，无需手动刷新 |
| 适用范围 | 适用于任何 Newick 树和一一对应的表格数据 |

## 4. 完整示例

```js
// 1. 解析表格
tableData.value = parseTableTxt(tableTxt)

// 2. 渲染树后获取叶节点顺序
leafOrderList.value = getLeafNamesFromNodes(treeInstance.nodes)

// 3. 排序
const sortedTableData = computed(() => {
  if (!leafOrderList.value.length) return tableData.value
  return sortTableByLeafOrder(leafOrderList.value, tableData.value)
})
```

## 5. 总结

- **核心思想**：树的叶节点顺序驱动表格排序，保证联动和一一对应。
- **实现简洁高效，易于维护和扩展。**
- **适合所有需要"树-表联动排序"的前端可视化场景。** 