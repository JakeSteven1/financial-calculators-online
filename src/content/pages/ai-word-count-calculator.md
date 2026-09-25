---
title: "Has Chat GPT Forgotten? AI Conversation Calculator"
seoTitle: "Has Chat GPT Forgotten? AI Conversation Calculator - Free Financial Calculator Online"
description: "Has your Chat GPT conversation gotten too long and has forgotten parts of the conversation? Use our AI Word Count calculator."
wpId: 1692
wpType: page
modified: "2023-09-07T19:16:33"
---
Having a conversation with Chat GPT and Chat GPT seemingly forgets the project you appear to be working on? Did it ruin your project? Well you’re in luck. Because that happened to me and it made me build this tool.

With the rapid evolution of artificial intelligence, numerous professionals and enthusiasts turn to AI for solutions, ranging from simple queries to intricate project requirements. Among them was a dedicated individual, deep into the development of a significant project. Ok it was me. Me. I’m the guy. I confidently relied on the guidance of AI, then found myself navigating a conversation that spanned topics, directions, and most crucially, programming languages. As the dialogue delved deeper, the expansive breadth of the conversation surpassed a critical threshold. Suddenly, what began in the realm of PHP morphed insidiously into Python code, leading to a system-wide clash and an unexpected halt in the project. The AI, with its vast memory reservoir, had lost the essence of the conversation’s beginning, a limitation unbeknownst to many.

Understanding firsthand the pivotal role context plays in meaningful AI interactions, I made this calculator that I can have on in the background where I can paste my conversation and not forget how close I am to the wall. Right now (September, 2023) the current AI, most people use [Chat GPT-4](https://chat.openai.com/), can review about 36,000 tokens at once or 24,000 words of the conversation. That’s not exactly right (different words and sentences can count differently) but it’s not bad. Do NOT lose track of where you are in the conversation or you end up in the position I was in.

\*Update to tool 9/7/2023: A user has suggested trying to factor in the difference in words. Here’s what we’ve done: applied weights based on the complexity of the word. Those weights are below:

					`Score = (Simple words × 1) + (Moderate words × 2) + (Complex words × 3)`

## But Why Can't AI Remember?

Artificial Intelligence, particularly in its advanced incarnations like neural networks, operates through a complex interplay of algorithms, data processing, and memory management.

At the core of AI interactions is the concept of “contextual memory.” This isn’t memory in the traditional sense, where data is stored indefinitely. Instead, it’s a transient form of recall, where the AI retains and references recent inputs to generate coherent and contextually appropriate outputs.

Think of it as a stream of consciousness in a conversation: while the present thought is clear and the recent ones are still in mind, the very initial ones start to fade as the conversation progresses.

The reason for this transient retention is twofold. First, maintaining an infinite conversation state would be computationally intensive, possibly slowing down response times as the system sifts through an ever-growing set of previous interactions.

Second, it serves as a privacy measure. By not retaining user data for extended periods, the AI ensures that user information is not persistently stored, thereby bolstering data security and user trust.

However, this design choice does mean that in exceptionally lengthy interactions, the AI might “forget” the beginning of the conversation, leading to potential context drifts and inconsistent outputs.
