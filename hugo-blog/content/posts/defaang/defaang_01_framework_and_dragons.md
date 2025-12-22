+++
title = 'De-FAANGing and De-googling my Life Ep #1: Framework and Dragons'
date = 2024-06-29
series = ["de-faang"]
tags = ["defaanging","degoogleing"]
slug = "de-faanging-and-de-googling-my-life-ep-1-framework-and-dragons"
+++


Over the last few years, I've experimented with various online services, free and paid, and explored their feature sets, advantages, and disadvantages. In recent months, I have come to the difficult conclusion that my set up, honed over the past many years, is not only sub-optimal, but is also waiting to break. I've also realised that there is a great deal of dependency on Google, Apple, Microsoft, and other similar large tech companies, a group of corporations that used to, very aptly, be referred to as [FAANG](https://en.wikipedia.org/wiki/Big_Tech "Big Tech"). I now wish to remedy this.

<!--more-->

## Why now?
This is a tougher question to answer. Two weeks ago, in a bout of productive procrastination, I wanted to finally get my website up and running so I could blog regularly. I wished to move my writing away from substack, as it offered me very less customisation, and mostly because [I don\'t like Nazis and would not want my writing to appear next to theirs](https://www.platformer.news/why-platformer-is-leaving-substack/). I also wanted to see where to set my domain up so I could finally make the switch away from gmail and google services. Going through a whole bunch of ```r/Privacy``` threads, and various other blogs, gave me a lot of good starting points. 

The other point accelerating this overdue reimagination is the LLM/AI hype that seems to be pervading both Big Tech and the other smaller Big Tech companies. Companies like Miro, Slack, Notion, and so many more, are being sucked into this hype, and, the end result is inevitably that the users are subject to even more intrusive privacy policies and terms and conditions. This same trend is also on Instagram, Twitter, and similar social networking sites.

## Framework

I want to, slowly but surely, replace as many of these big tech services as I can, replacing them with privacy focused alternatives.

### Requirements
Here are a few key requirements for any product/service I use. I rely on the [RFC2119](https://datatracker.ietf.org/doc/html/rfc2119) to guide my usage of imperatives in this and all blog posts.

1. The product/service used MUST be audited by independent entities, and MAY be free and open source software.
2. They  MUST allow for a simple migration framework, allowing me to switch services when needed.
3. They MUST rely on standard and open-source formats for any files generated during migration.
4. They MAY be self-hostable.
5. They MUST offer E2EE and TOTP based MFA.
6. They MAY offer Passwordless Authentication as well.
7. They MUST be cross-platform, or offer exports that allow me to replace the product with a cross-platform product.

### Guiding Principles
But, beyond the framework, also needed is some guiding principles.

1. Perfect is the enemy of good. Rules are meant to be broken, even my own rules. Every now and again I will use a service that doesn't employ perfect E2EE. Or falls short of the other requirements. Ability to migrate is the crucial point here.
2. Intentionality is the name of the game. Rome wasn't built in a day, and won't be destroyed in a day. Migration will take time.
3. FOSS alternatives are great, but ease-of-use and longevity are crucial as well. As much as possible, the [big 5](https://en.wikipedia.org/wiki/Big_Tech) MUST be avoided, and if not, at the least their use justified.
4. Requirement #2 is important to keep in mind: Migration should be easy. You should be allowed to change your mind.
5. Your [threat model](https://www.privacyguides.org/en/basics/threat-modeling/), at this point, is simply limiting your ability to be tracked by big tech companies. This can change over time, but the focus of convenience is crucial as well.
6. [Sailing the high seas](https://en.wikipedia.org/wiki/Online_piracy) is inevitable in some cases, and should be considered as a serious option.
7. I am not and don't intend to be very stingy. I have (some) money to spend, and am happy to spend to contribute to developers who take their time to build good projects. For completely open source projects that I self-host, this might be sending them a coffee. I'm also happy to pay for subscription services when needed - especially when I am using storage - I would rather pay them than Google One or iCloud. But - crucially, I plan to be very intentional about the paid services I use.

These lists are non-exhaustive, and will be updated over time.

## There be Dragons

A crucial point to note is - I am already currently enmeshed in quite a few ecosystems. My hardware is very Apple centric, and a lot of online services I use are from Microsoft and Google. So there are immediate pain points to be identified here.

1. My current device is a MacBook, and my phone is an iPhone.
2. My primary email is still google, and though I am slowly trialing a migration to a custom domain email using Fastmail, it will take time. Fastmail is NOT E2EE, and this means that a potential backdoor just exists, which might make them vulnerable to requests from law enforcement in India and abroad.
   1.  However, for now, I want the flexibility to use 3rd party email and calendar clients. Proton Mail, the other good alternative, has limitations in how it relays with IMAP email clients due to 2FA and E2EE. 
   2.  [They claim they're immune to such requests.](https://www.fastmail.com/blog/fastmails-servers-are-in-the-us-what-this-means-for-you/)
   3.  I'm setting up my mail on my own domain - which will allow me to port when I find a reliable alternative I can stick to. And I will do that.
3. I designed the current version of this website using hugo and a custom theme I found online. The theme I forked is hosted on github, as is my source code, which deploys the site using Github Actions. I am currently editing this in VS Code. Both Github and VS Code are owned by a Big 5 corp.
4. I communicate with most of my friends and my partner on WhatsApp, owned by Meta. I live in India, and it's simply the only practical option available. I am attempting to move away from WhatsApp for any long form communication, with the focus being interim communication, logistics, etc. I also do use iMessage, however sparingly, and do prefer aspects of iMessage to WhatsApp. But I would ideally move away from both - and hope to reach that place in the near future. In that case, WhatsApp or iMessage would not matter to me, and would only hold information regarding logistics of meeting elsewhere. This might involve switching on disappearing messages by default, and purging all old chats from memory, while exporting the important ones to my desktop. (WhatsApp also makes it very hard to migrate from one platform to another, a point that has always made me hate the platform.)
5. For any service that's ostensibly not needed to backup anything for me - I'd like to use services that do not need an email ID to sign on. I am currently using the [Arc Browser](https://arc.net), a very intuitive browser with great work-life separation capabilities. But - it needs an email ID to sign in, and this might make me have to migrate to Firefox or Brave.

### A Note on Jumping Ship

The point is - there are many dragons to slay. I gotta do this one day at a time. And no system will be perfect. We're aiming for better. I want to keep writing this series every week, and see how my progress varies over time.

This could mean a lot of things over time. The biggest change might come down to moving from an iPhone to an Android over time - to allow myself the customisation I need. Completely getting rid of the reliance on the big companies will take time. But, it's definitely on the roadmap.

I have been a sucker for convenience my whole life, so this will be a marked shift - to enter this zone of very less trust, much more verification - importantly - lesser reliance on the Apples of the world. But I like to think that I have been on this journey, at least internally, for a few years now. And this decision to fully jump ship is long overdue. The journey must start now.

## Next Week

Next week - I want to talk in detail about 3 services we all use extensively - mail, cloud, and photos - and how I am de-googleing and de-faang-ing them. My focus will be - options considered, pros and cons weighed, pricing, how my migration is going, and how long before I replace my main service with these options. I hope to get into some detail.
