export const SITE = {
  website: "https://saisneha.com/",
  author: "Sneha S",
  profile: "https://saisneha.com/about/",
  desc: "Personal essays, technical rambles, and ongoing experiments in writing a more intentional life.",
  title: "hurtling through space",
  ogImage: "favicon.svg",
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 8,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/snehasaisneha/saisneha.com/edit/main/",
  },
  dynamicOgImage: false,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Kolkata", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
