---
title: "Easier legal name changes for all"
description: >-
  We've rebuilt the Namesake app from the ground up to simplify updating your legal name in Massachusetts and beyond.
publishDate: 2025-06-30
authors:
  - eva-decker
  - mb-bischoff
annotation: underline
# image:
#   src: ../../assets/images/posts/introducing-namesake/content/namesake.webp
#   alt: "Illustrations of a driver's license, a gavel, a passport, a social security card, and a flower with snails."
---

**Over the past year, we've completely rebuilt the Namesake app.** It has a [new design](#all-new-design), [more accessible forms](#clearer-more-accessible-forms), [improved security](#improved-security), and is now [open source](#were-open-source). This new app builds a foundation for us to support name changes in many more locations and for different types of activities. You can [sign up today](https://app.namesake.fyi).

## Why redesign? Why now?

The first Namesake app launched in 2021. In those four years, Namesake has supported over 1,000 youth and adults in Massachusetts, and helped connect folks to over $45,000 in financial assistance through our partnership with the [Massachusetts Transgender Political Coalition](https://www.masstpc.org/). But we want to do even more.

Our existing web app was created using Bubble, a low-code app platform. Early on, Bubble  helped Namesake build quickly for Massachusetts, but now, Bubble has become a barrier. Writing our own code comes with many benefits:

- **Improved performance** due to a leaner codebase which doesn't include unnecessary trackers or tooling
- **Full transparency** of [our app's code](https://github.com/namesakefyi/namesake) so that we can build things and plan in the open
- **Reduced downtime** (an unfortunate recurring problem with Bubble!)
- **Better organization** to help Namesake grow sustainably to support more forms in more states
- **Lower costs** for hosting and development—money we can direct toward trans people instead of a VC-funded tech company

We've spent the past year building the tool that we wished existed when we were changing our own names. We're excited to share it with you.

> Three years of partnership. Dozens of community events for name change support. And hundreds of trans and nonbinary people served. MTPC's community partnership with Namesake has taken name change assistance to the next level, centering accessibility, innovation, and community at every turn. MTPC is deeply grateful for how Namesake's user-friendly and community-centered platform addresses common barriers people experience when changing their name, including complex legal language, confusing court forms, and isolation.
>
> <cite>MG Xiong, Director of Engagement & Learning, MTPC</cite>

## What's new?
We’ve rebuilt and rewritten the app from scratch.

### All-new design

Back in August, we announced a [new look for Namesake](/blog/introducing-namesake/), and we’ve brought that design over to our application, featuring some lovely illustrations from the comic artist [Kit Mills](https://mitkills.com/).

![A screenshot of a browser window displaying the Namesake 'Getting Started' quest, which features a sidebar on the left for navigating between 'Getting Started', 'Court Order', 'Social Security', and more, and a main content area featuring illustrations which detail how to navigate the legal name change process.](../../assets/images/posts/new-namesake-app/namesake-desktop.png)

When you log in, you’ll see a view containing all your **quests**—the word we’re using to refer to each “thing to do” when updating your identity documents—and a few placeholders to get you started. Each quest includes a step-by-step guide walking you through what needs to be done, and disclosure elements which expand to reveal answers to frequently asked questions.

![A hand holding an iPhone displaying the home page of Namesake, featuring a progress bar representing percent completion toward all name change quests, along with a list of various quests for 'Court Order', 'Social Security', 'State ID', and more.](../../assets/images/posts/new-namesake-app/namesake-phone.png)

You have complete control over your settings, including preferences for theme and color. The color palettes for the app are based on the colors and meanings from Gilbert Baker’s [original 1978 pride flag](https://www.glbthistory.org/rainbow-flag).

### Clearer, more accessible forms

If a quest requires filling out documents, a guided form will walk you through the process. All questions are clear and straightforward, avoid legal jargon, and explain terms where necessary. All elements have been tested for accessibility to ensure that everyone is able to easily fill out forms, whether they are using a desktop, mobile device, or assistive technologies.

![A hand holding an iPhone displaying a form with a question that reads, 'Would you like to waive the newspaper publication requirement?'](../../assets/images/posts/new-namesake-app/namesake-phone-2.png)

Open-ended questions like “What is the reason you’re changing your name?” can induce uncertainty. What should I write? How much detail do I share? To help avoid this guesswork, we provide suggested responses and context about what the court is looking for.

Depending on your responses, all of the relevant forms will be compiled and merged into a single packet for you to download, review, and submit. After submission, documents will remain organized and visible in a documents tab.

![A stack of papers. The top paper in the stack says, 'Name Change Packet: Massachusetts Court Order' and includes instructions and reminders for filing. The papers behind it are the forms in the packet.](../../assets/images/posts/new-namesake-app/court-order-packet.png)

### Improved security

Legal name change forms ask for a lot of private, sensitive information. To safeguard this, we’ve implemented end-to-end encryption for all form responses. End-to-end encryption means that nobody—not even Namesake—can read your responses.

Here’s how it works: when you submit your form responses, we use an encryption key linked to your device to scramble the responses before saving them to the database. Your encryption key is never shared with anyone or sent to Namesake, preventing anyone except the person on your device—you!—from decrypting the information.

You can delete all of your data at any time, and we plan to offer anonymous sign-in in the future. Out of an abundance of safety, we never ask for your social security number, and always request that you fill it out by hand.

### We're open source

Finally, as part of our commitment to security and transparency, our entire new app is open source and MIT-licensed. You can [view the codebase](https://github.com/namesakefyi/namesake) on GitHub. We welcome new contributors! Check out our [contribution guide](https://github.com/namesakefyi/namesake/blob/main/CONTRIBUTING.md) and explore some [good first issues](https://github.com/namesakefyi/namesake/contribute). Questions? Come chat with us in the #code channel [on Discord](https://namesake.fyi/chat).

## What's next?

First, we’ll be responding to your feedback. Have suggestions for Namesake? Ran into an issue? Let us know.

### Shutting down the old app

**The [legacy app](http://masstpc.joinnamesake.com) will shut down on July 31, 2025.** At this point, all user data within that site will be permanently deleted. There is no way to transfer data from the old site to the new one. If you have forms from the site you would like to download, please do so before July 31st. If you run into issues, we can help support you at [hey@namesake.fyi](mailto:hey@namesake.fyi).

### Supporting more states

We’re looking to support additional states, starting with New York!

If you work for an organization which helps facilitate trans name changes in the US and you’re interested in partnering with Namesake, please reach out to us at [hey@namesake.fyi](mailto:hey@namesake.fyi). We’d love to work with you.

### New feature development

We have a few features on the roadmap, like accepting user-contributed quests, supporting anonymous sign-in, and allowing user-contributed tips and feedback on quests. Keep an eye on Discord and GitHub for more info.

## Thank you

This is a difficult, destabilizing time. Our federal institutions are being gutted. The judiciary is being weaponized against trans people (and sometimes fighting back). Despite all of this, there is still power in communally building technology in the service of social good.

> Namesake recognizes the legal name change process isn’t just about filling out paperwork; it’s about feeling seen, supported, and affirmed every step of the way. The new version of Namesake is everything we hoped for: easier-to-use forms, step-by-step instructions, and built-in community support. It’s designed to meet people where they are and make a complicated process feel a little less daunting. As Namesake works to expand beyond Massachusetts, we’re excited to see Namesake help even more people navigate the legal name change process with care.
> 
> <cite>Charly Robles, Programs Manager, MTPC</cite>

We are here to support you in finding a name that you love, and in owning identity documents which reflect who you are. Respectful and accessible name changes are one part of a larger puzzle in creating a world where trans people—and all people—can live life freely and joyously.

[Sign up for Namesake](https://app.namesake.fyi) and [join us on Discord](/chat), or support our work by making a [tax-deductible donation](/donate).

Happy Pride &hearts;

---

This release would not have been possible without the work of:

Ari Trakh, Charly Robles, Dana Teagle, Ginger, Joshua Hogsett, Justin Kang, Kelsey Gunstra, Kit Mills, Luke Lennon, Margot Miville, Martin Lindberg, mb bishoff, Melody Universe, MG Xiong, moon davé, Oliver Bello, Seneca Artemis, Tre’Andre Carmel Valentine, Vicky O at Movement Stickers, Zo Holmes, the Massachusetts Transgender Political Coalition, and many others. Thank you!
