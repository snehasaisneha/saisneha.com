import type { Props } from "astro";
import IconBluesky from "@/assets/icons/IconBluesky.svg";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconTwitter from "@/assets/icons/IconTwitter.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/snehasaisneha/saisneha.com",
    linkTitle: "Find Sneha/Kanmani on GitHub",
    icon: IconGitHub,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/snehasaisneha",
    linkTitle: "Find Sneha/Kanmani on Twitter",
    icon: IconTwitter,
  },
  {
    name: "Bluesky",
    href: "https://bsky.app/profile/saisneha.com",
    linkTitle: "Find Sneha/Kanmani on Bluesky",
    icon: IconBluesky,
  },
  {
    name: "Mail",
    href: "mailto:blogging@saisneha.com",
    linkTitle: "Email Sneha/Kanmani",
    icon: IconMail,
  },
] as const;

export const SHARE_LINKS: Social[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: `Share this post via WhatsApp`,
    icon: IconWhatsapp,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: `Share this post on Facebook`,
    icon: IconFacebook,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/intent/tweet?url=",
    linkTitle: `Share this post on Twitter`,
    icon: IconTwitter,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
    icon: IconTelegram,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    linkTitle: `Share this post on Pinterest`,
    icon: IconPinterest,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;
