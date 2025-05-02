import type {
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Echooler",
	subtitle: "Y.Hong's Blog",
	lang: "en", // Changed to English
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		{
			src: "/favicon/icon.png",
			theme: "light",
			sizes: "32x32",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/yuhong2024",
			external: true,
		},
		{
			name: "Zhihu",
			url: "https://www.zhihu.com/people/zhai-xing-3-26",
			external: true,
		},
		{
			name: "YouTube",
			url: "https://studio.youtube.com/channel/UCRVaRv7mraTBpHmtPO3i9vw",
			external: true,
		},
		{
			name: "Bilibili",
			url: "https://space.bilibili.com/1554305035",
			external: true,
		},
		{
			name: "Academic",
			url: "https://yuhong2024.github.io/index.html",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/me.jpg",
	name: "Echooler",
	bio: "Y.Hong | Undergraduate Student at SWU",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/yuhong2024",
		},
		{
			name: "Zhihu",
			icon: "fa6-brands:zhihu",
			url: "https://www.zhihu.com/people/zhai-xing-3-26",
		},
		{
			name: "YouTube",
			icon: "fa6-brands:youtube",
			url: "https://studio.youtube.com/channel/UCRVaRv7mraTBpHmtPO3i9vw",
		},
		{
			name: "Bilibili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/1554305035",
		},
		{
			name: "Academic",
			icon: "fa6-solid:graduation-cap",
			url: "https://yuhong2024.github.io/index.html",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};
