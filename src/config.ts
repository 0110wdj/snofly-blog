import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: 'Snofly',
  subtitle: 'Blog Site',
  lang: 'en', // 'en', 'zh_CN', 'zh_TW', 'ja'
  themeColor: {
    hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
    fixed: false, // Hide the theme color picker for visitors
  },
  banner: {
    enable: true,
    src: 'assets/images/banner.png', // Relative to the /src directory. Relative to the /public directory if it starts with '/'
  },
  favicon: [
    {
      src: '/favicon/icon.png', // Path of the favicon, relative to the /public directory
      theme: 'light', // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
      sizes: '32x32', // (Optional) Size of the favicon, set only if you have favicons of different sizes
    },
  ],
}

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    // LinkPreset.Talk,
    LinkPreset.Kits,
    // {
    //   name: '资源',
    //   url: 'http://www.snofly.cn:8081/',
    //   external: true,
    // },
    // {
    //   name: 'github',
    //   url: 'https://github.com/0110wdj',
    //   external: true,
    // },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/head.jpeg', // Relative to the /src directory. Relative to the /public directory if it starts with '/'
  name: 'snofly',
  bio: '恒念志远，跬步千里。',
  links: [
    {
      name: 'GitHub',
      icon: 'fa6-brands:github',
      url: 'https://github.com/0110wdj',
    },
    {
      name: 'npm',
      icon: 'simple-icons:npm',
      url: 'https://www.npmjs.com/~snofly',
    },
    {
      name: 'leetcode',
      icon: 'simple-icons:leetcode',
      url: 'https://leetcode.cn/u/snofly/',
    },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}
