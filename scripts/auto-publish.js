/* 
 * 自动发布脚本
 * 监听创作文件夹，当检测到新的 Markdown 文件时自动处理并发布
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const DRAFTS_DIR = path.join(__dirname, "../src/content/drafts"); // 创作文件夹
const POSTS_DIR = path.join(__dirname, "../src/content/posts"); // 发布文件夹

// 确保创作文件夹存在
if (!fs.existsSync(DRAFTS_DIR)) {
	fs.mkdirSync(DRAFTS_DIR, { recursive: true });
	console.log(`✅ 已创建创作文件夹: ${DRAFTS_DIR}`);
}

/**
 * 获取当前日期字符串 (YYYY-MM-DD)
 */
function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/**
 * 从文件名提取标题
 */
function getTitleFromFilename(filename) {
	return path.basename(filename, path.extname(filename))
		.replace(/[-_]/g, " ")
		.replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * 解析 frontmatter
 */
function parseFrontmatter(content) {
	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);
	
	if (!match) {
		return { frontmatter: null, body: content };
	}

	try {
		// 简单的 YAML 解析（只处理基本类型）
		const frontmatterText = match[1];
		const body = match[2];
		const frontmatter = {};
		
		const lines = frontmatterText.split("\n");
		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith("#")) continue;
			
			const colonIndex = trimmed.indexOf(":");
			if (colonIndex === -1) continue;
			
			const key = trimmed.substring(0, colonIndex).trim();
			let value = trimmed.substring(colonIndex + 1).trim();
			
			// 处理数组格式 [item1, item2]
			if (value.startsWith("[") && value.endsWith("]")) {
				value = value.slice(1, -1)
					.split(",")
					.map((item) => item.trim().replace(/^["']|["']$/g, ""));
			}
			// 处理布尔值
			else if (value === "true") {
				value = true;
			} else if (value === "false") {
				value = false;
			}
			// 处理字符串（移除引号）
			else if ((value.startsWith('"') && value.endsWith('"')) || 
			         (value.startsWith("'") && value.endsWith("'"))) {
				value = value.slice(1, -1);
			}
			
			frontmatter[key] = value;
		}
		
		return { frontmatter, body };
	} catch (error) {
		console.error("解析 frontmatter 失败:", error);
		return { frontmatter: null, body: content };
	}
}

/**
 * 生成 frontmatter 字符串
 */
function generateFrontmatter(frontmatter) {
	const lines = [];
	lines.push("---");
	
	// 必需字段
	if (!frontmatter.title) frontmatter.title = "";
	if (!frontmatter.published) frontmatter.published = getDate();
	if (frontmatter.draft === undefined) frontmatter.draft = false;
	
	// 按顺序输出字段
	const fieldOrder = ["title", "published", "updated", "description", "image", "tags", "category", "draft", "lang"];
	
	for (const key of fieldOrder) {
		if (frontmatter[key] !== undefined) {
			const value = frontmatter[key];
			if (Array.isArray(value)) {
				lines.push(`${key}: [${value.map((v) => `"${v}"`).join(", ")}]`);
			} else if (typeof value === "boolean") {
				lines.push(`${key}: ${value}`);
			} else if (value !== null && value !== "") {
				lines.push(`${key}: ${JSON.stringify(value)}`);
			}
		}
	}
	
	// 输出其他字段
	for (const [key, value] of Object.entries(frontmatter)) {
		if (!fieldOrder.includes(key) && value !== undefined) {
			if (Array.isArray(value)) {
				lines.push(`${key}: [${value.map((v) => `"${v}"`).join(", ")}]`);
			} else if (typeof value === "boolean") {
				lines.push(`${key}: ${value}`);
			} else if (value !== null && value !== "") {
				lines.push(`${key}: ${JSON.stringify(value)}`);
			}
		}
	}
	
	lines.push("---");
	return lines.join("\n");
}

/**
 * 处理 Markdown 文件
 */
function processMarkdownFile(filePath) {
	const filename = path.basename(filePath);
	const ext = path.extname(filename);
	
	// 只处理 .md 文件
	if (ext !== ".md" && ext !== ".mdx") {
		return;
	}
	
	console.log(`\n📝 检测到新文件: ${filename}`);
	
	try {
		// 读取文件内容
		const content = fs.readFileSync(filePath, "utf-8");
		const { frontmatter, body } = parseFrontmatter(content);
		
		// 如果没有 frontmatter 或缺少必要字段，自动补充
		const finalFrontmatter = frontmatter || {};
		
		if (!finalFrontmatter.title) {
			finalFrontmatter.title = getTitleFromFilename(filename);
			console.log(`  ℹ️  自动设置标题: ${finalFrontmatter.title}`);
		}
		
		if (!finalFrontmatter.published) {
			finalFrontmatter.published = getDate();
			console.log(`  ℹ️  自动设置发布日期: ${finalFrontmatter.published}`);
		}
		
		if (finalFrontmatter.draft === undefined) {
			finalFrontmatter.draft = false;
		}
		
		// 确保其他字段有默认值
		if (!finalFrontmatter.description) finalFrontmatter.description = "";
		if (!finalFrontmatter.image) finalFrontmatter.image = "";
		if (!finalFrontmatter.tags) finalFrontmatter.tags = [];
		if (!finalFrontmatter.category) finalFrontmatter.category = "";
		if (!finalFrontmatter.lang) finalFrontmatter.lang = "";
		
		// 生成完整的文件内容
		const frontmatterString = generateFrontmatter(finalFrontmatter);
		const finalContent = `${frontmatterString}\n\n${body}`;
		
		// 确定目标文件名（使用日期前缀或保持原文件名）
		const targetFilename = filename;
		const targetPath = path.join(POSTS_DIR, targetFilename);
		
		// 检查目标文件是否已存在
		if (fs.existsSync(targetPath)) {
			console.log(`  ⚠️  文件已存在: ${targetFilename}`);
			console.log(`  💡 跳过处理，如需覆盖请手动删除目标文件`);
			return;
		}
		
		// 写入目标文件
		fs.writeFileSync(targetPath, finalContent, "utf-8");
		console.log(`  ✅ 已发布到: ${targetPath}`);
		
		// 删除源文件
		fs.unlinkSync(filePath);
		console.log(`  🗑️  已删除源文件: ${filename}`);
		
		console.log(`  ✨ 文章已自动发布！`);
		
	} catch (error) {
		console.error(`  ❌ 处理文件失败:`, error);
	}
}

/**
 * 监听文件夹变化
 */
function watchDraftsFolder() {
	console.log(`\n🚀 开始监听创作文件夹...`);
	console.log(`📁 创作文件夹: ${DRAFTS_DIR}`);
	console.log(`📁 发布文件夹: ${POSTS_DIR}`);
	console.log(`\n💡 提示: 将 Markdown 文件放入创作文件夹即可自动发布\n`);
	
	// 处理已存在的文件
	const existingFiles = fs.readdirSync(DRAFTS_DIR);
	for (const file of existingFiles) {
		const filePath = path.join(DRAFTS_DIR, file);
		const stat = fs.statSync(filePath);
		if (stat.isFile()) {
			processMarkdownFile(filePath);
		}
	}
	
	// 监听文件夹变化
	const processedFiles = new Set(); // 防止重复处理
	
	fs.watch(DRAFTS_DIR, { recursive: false }, (eventType, filename) => {
		if (!filename) return;
		
		// 只处理 .md 和 .mdx 文件
		if (!filename.endsWith(".md") && !filename.endsWith(".mdx")) {
			return;
		}
		
		const filePath = path.join(DRAFTS_DIR, filename);
		
		// 防止重复处理
		if (processedFiles.has(filename)) {
			return;
		}
		
		// 等待文件写入完成
		setTimeout(() => {
			try {
				if (!fs.existsSync(filePath)) {
					return; // 文件可能已被删除
				}
				
				const stat = fs.statSync(filePath);
				if (stat.isFile()) {
					processedFiles.add(filename);
					processMarkdownFile(filePath);
					// 处理完成后移除标记（延迟一点，避免立即重复）
					setTimeout(() => {
						processedFiles.delete(filename);
					}, 2000);
				}
			} catch (error) {
				// 文件可能已被删除或移动，忽略错误
				processedFiles.delete(filename);
			}
		}, 300); // 增加延迟，确保文件写入完成
	});
	
	console.log(`\n👀 监听中... (按 Ctrl+C 退出)\n`);
}

// 启动监听
watchDraftsFolder();

