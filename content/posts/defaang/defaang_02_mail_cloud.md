+++
title = 'Migrating my Mail and Cloud (De-Faanging my Life Ep #2)'
date = 2024-07-13T17:02:16+05:30
series = ["de-faang"]
tags = ["defaanging","degoogleing"]
slug = "migrating-my-mail-and-cloud-de-faanging-my-life-ep-2"
+++

So, as I explained [two weeks back](/2024/06/de-faanging-and-de-googling-my-life-ep-%231-framework-and-dragons/), I'm making a concerted effort to move away from the big tech giants - opting for smaller, privacy centric options. This week, I'm going to document my journey there in a few key areas - Mail, Calendar, Meetings, and Cloud storage. I will be rambling quite a bit. 

Before I get started, a colleague shared a very [interesting article](https://www.msn.com/en-us/news/technology/every-time-you-post-to-instagram-you-re-turning-on-a-light-bulb-forever/ar-BB1ptAbW) about the energy all our data consumes, comparing making an instagram post or tweet to switching on a light bulb that will never switch off. It's something to think about, and something that I'm definitely reflecting on, through this exercise.

## Email, Calendar, & Meetings

I started my journey with email as email is the backbone on which most other services are built, and it makes sense to migrate it first. My options were - [ProtonMail](https://proton.me/mail), [Tuta](https://tuta.com/), and a few other enthusiast email services, and [Fastmail](https://fastmail.com) - a much more consumer facing email. I picked Fastmail.

### Email: Proton vs Fastmail

The only options I seriously considered were Proton and Fastmail - for simplicity. I looked up the other services but did not actually dig deep or experiment. There's 3 main axes I graded the services on.

1. **IMAP Support**: Proton Mail does not support IMAP on mobile phones - forcing you to use their own mobile client. They have this for good reason - IMAP is an inherently insecure protocol as there is no second factor authentication - there is a backdoor into your email. I don't need a client on my desktop - but a simple unified mobile client has become a necessity of late. Fastmail allows you to create app passwords - which allow you to use any IMAP client.
2. **Pricing and Bundling**: Fastmail has India pricing - costing ₹480 a month for 50 GB of storage, with cheaper plans for longer durations. Proton Mail's base usable plan that allows you a custom domain is €4.99, which is ₹455 as of writing, and only offers 15 GB of storage. Their next plan is €12.99 (₹1184.79) and offers 500 GB of storage, along with their drive client, VPN service, and password manager. I am not a fan of bundled services, and didn't find the value proposition worthy. I do not need 500 GB of storage for email. I also liked that Fastmail offered a Duo plan for ₹800, which is a neat pricing if my partner wishes to switch as well, something he's said he'd like to do in the near future. They also support multiple custom domains.
3. **Masked Emails and Alisases**: I am a 1Password user - and have been for almost 2 years. Fastmail has a seamless alias mechanism that integrates with 1Password, essentially autofilling the alias on the given website, and automatically creating the alias on the Fastmail backend. Proton's base plan offers 10 masked email aliases and 1 custom domain. Fastmail offers 600 aliases, and 100 custom domains. 

For all these reasons, Fastmail was the clear winner. There are a few issues I take with Fastmail - it doesn't offer a desktop client for the drive, for one. It also has weird quirks wrt folders vs labels, only letting you pick one. It's also almost certainly not what someone from the infosec community would recommend. It's a consumer facing service - first and foremost, while Proton is, at least currently, an enthusiast product. I think I'm simply not that much of an enthusiast at the moment. Fastmail also has a reliable 25 year history, to Proton's 10 years.

So - I've picked Fastmail and have made the switch to it, switching a lot of my major services there already, and autoforwarding my current email there. I expect a full transition will take 3-6 months (there are bank emails and govt websites to make the changes on - and I am not in the biggest hurry to change everything in a day), but this is a great start. You can drop me a line at [blogging@saisneha.com](mailto:blogging@saisneha.com)!

Using a custom domain also allows me to migrate if and when I decide to. Another part of my plan will be to ruthlessly delete emails that aren't relevant to me anymore, an exercise that can be partially automated and partially needs to be manual. 


### Calendar

The largest concern for my calendar was CalDav support - to be able to use any calendar client of my choice. This was a crucial reason for not choosing proton mail. For now - fastmail will do - using the same email and calendar provider is just common sense. But I'm actively looking for options - self hosted, preferably.

### Meetings

The switch from gmail will also involve using an alternative to google meet. This wasn't a difficult discussion - I'm gonna be going with [Jitsi Meet](https://meet.jit.si), something I used a bit during the pandemic. Eventually, I hope to set up my own secure instance. In the meantime, I'm also trialing an alternative from Nextcloud called Chat, something I'll detail after I experiment more.

## Cloud Storage, Photos, and Office Apps

Cloud storage was and remains a tough nut to track. There are always tradeoffs, and, well, up and moving your life from one provider to another isn't easy.

I currently have a cluttered cloud space. My primary personal data is stored on Google Drive. My workspace uses G Suite as well. Since I use Apple devices, I do use iCloud as well. I share my Google Drive with a few people, but - it's filling, and fast. 

I've identified a few pain points and areas of focus.

1. WhatsApp chats are needlessly large - take up way too much space. This affects the cloud storage.
2. We've gotten accustomed to photos being very cheap - we, or at least I, take too many photos instead of taking the 1 or the 2. There's a lot of storage being wasted.
3. The biggest boon that Google Workspace provides is Real Time Collaboration. That's hard to beat.

I'm currently experimenting with a self-hosted [Nextcloud](https://nextcloud.com) instance for my cloud storage. It's currently hosted on AWS lightsail, and is therefore free for 90 days. Of course, I do not intend to host any thing on AWS long term, but this was simply a free way to experiment with Nextcloud. I'm considering switching to Linode, for the pricing.

Nextcloud has an online office suite that's based on libre office. It also allows real time collaboration, when that's needed. However, I've not been able to make it work seamlessly yet. So jury's still out. 

I'm also trialing [ente photos](https://ente.io) for photo storage, but migrating from google photos has turned out to be more of a pain that I expected. So I'm taking it slow. I want to go over, delete duplicates, clean up my library, and then migrate. It's going to take a while.

## What's next?

There's a lot of different things left to do, and I am in no mood to rush things. Here's a simple, non-exhaustive list of things I intend to explore.

1. **Calendar** - preferably self hosted, let's me send evites and rsvp's from my own server, allows me to use a CalDav compatible client.
2. **Finalise Cloud Storage** - there's going to be lots of experimentation here, do stay tuned for special episodes focusing on specific technical problems.
3. **Self Hosted End-to-end-Encrypted Jitsi Instance**: Self explanatory. I want an instance that also supports authentication, so only I can start a meeting.
4. **Messaging** - leave WhatsApp once and for all! I want to make WhatsApp a place for logistics and planning, and move all important convos/gc's away from it - this is very ambitious but I am weirdly hopeful.
5. **Browser**: I've been using Arc Browser for a while, and have switched up my default search engine to DuckDuckGo. But I also want to leave the Chromium world - and so exploring the best options there.
6. **VS Code**: I want to leave VS Code, even though I've disabled the telemetry settings. I'd like to use a community fork, like [VS Codium](https://vscodium.com/).
7. **Adding email support to this newsletter!**: I want to add a way for people to subscribe to this website, and make the final migration away from substack. Doing this in a way that doesn't share people's emails with any unsavoury third parties - that's the reason for the hold up. I'm exploring a few options. I also want to eventually add comment support. Currently, you can sign up using the atom feed [here](https://saisneha.com/posts/index.xml).
8. **Miscellaneous**: What I am very conveniently classifying as miscellaneous is actually a lot of different things. I need to review and reflect on my task managers, note taking apps, payment processing apps, and so many more. There's a lot more to think about - is the larger point.

Phew. It's been a couple of weeks packed with work, but this has been a fun side exercise to keep up at. I've enjoyed it. Thanks for reading a fairly long ramble.

Next time - I hope to have better answers on the cloud side, and some solid feedback on Ente photos. Drop me any comments at [blogging@saisneha.com](mailto:blogging@saisneha.com), I'd definitely appreciate it.

Until then!
