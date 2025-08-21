+++
title = 'VHoIP #2: Spreadsheet Annoyances and a Journalling App!'
date = 2025-08-09T11:02:13+05:30
series = ["VhoIP"]
slug = "vhoip2_journalling_and_spreadsheet_annoyances"
+++

## Spreadsheet Annoyances

I've been attempting to mood journal for the past 5 weeks. It was initially an attempt to collect data on how my mood changes and what influences it. So an excel sheet did the trick. I'd fill it on my phone using the Google Sheets app. It was finicky, but it did the trick. A dropdown for the mood, and a "What happened today" field.

But then I wanted it to be more fun. I wanted to make an effort to log a storyworthy moment that happens. So it was more text typing - in google sheets, quite possibly the most annoying application for writing text. It also made it extremely difficult to save a single photo, if I wanted to. Most of all, if I wished to make a custom view for my journal, I couldn't, because the photos are not exactly indexable like a filestore or database.

## Make an App? Make a website.
I wanted a simple and lightweight solution to this. There's so many apps out there that claim to digitise your journalling, and I don't want to do that! Most of my journalling is pen and paper, this was built much more for mood tracking than anything else. So I thought I'd just build my own.

I did not want to build a python/flask app, or a Node.js app. Essentially - I didn't want anything that would need a server. I wanted something static, that just connected to the internet and did the job. So HTML, CSS, and JS. No other fancy stack.

And that's what I made! 

Check out the [Github](https://github.com/snehasaisneha/local-journal), and you can find the actual website [here](https://journal.saisneha.com).

This website can:
1. Accept some journal text, and a numerical mood entry. It can also optionally accept a single photo.
2. Save my AWS private and non-secret configuration locally. This includes the AWS region, bucket, and folder name.
3. I can autofill the AWS Secret Details from my password manager.
4. I can also manually flush the configuration details when I so choose.
5. Save all the information in a json, and link to the relevant photo using a randomised file name.

The best part - since it's static, anyone can use the same website, and push to their own filestore.

## Issues and TODO
It's not for everyone - it requires some degree of comfort with AWS, and there's still no interface to view the data.And yes - this is definitely not in the spirit of my [De-FAANG](series/de-faang/) experiment. But sometimes I just need a starting point. 

1. I want to expand the JavaScript to work with any S3 compatible filestore (like minio) so I can then migrate my data to a local NAS of some sort.
2. I then want to make a portal to also pull and view the data, at least for a set time period. I am unsure if this can be achieved statically, but hey, a girl can dream.