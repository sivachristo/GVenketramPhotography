---
name: simple-explainer
description: Take any technical content — reports, code reviews, documentation, logs, or AI-generated output — and explain it in simple, natural language without losing any important information. Translates complexity into clarity while keeping all details intact.
---

# Simple Technical Explanation

## Purpose

Take technical content, reports, code reviews, documentation, logs, or AI-generated technical output and explain it in **simple, natural language without losing any important information**.

The goal is NOT to shorten the content.

The goal is:

**Keep all the details → remove unnecessary complexity → explain clearly.**

---

## Core Rule

Never remove an important technical detail just because it is difficult to understand.

Instead, **translate the difficult explanation into simpler language**.

For example:

Instead of:

> "The module-level mutable state is non-deterministic across serverless execution contexts."

Say:

> "This variable is stored only in the server's memory. On Vercel, the server can restart or a different server instance can handle the request, so the variable may reset or contain different data."

The technical meaning must remain the same.

---

# Do Not Summarize Away Details

If the original content contains:

* 12 problems
* 8 recommendations
* 5 examples
* specific file locations
* technical reasons
* consequences
* edge cases
* warnings
* dependencies
* numbers
* commands
* code examples

keep them.

Do not turn 12 findings into:

> "There are several issues."

Instead, explain all 12 findings individually.

The output can be shorter than the original **only when the original contains unnecessary repetition or complicated wording**.

---

# Preserve Information

When simplifying content, preserve:

### Technical meaning

Do not change what the original is saying.

### Important terminology

Keep important technical terms such as:

* API
* Supabase
* RLS
* Server Component
* Client Component
* middleware
* serverless
* localStorage
* sessionStorage
* caching
* revalidation
* database
* authentication
* authorization
* memory leak

But explain the term when necessary.

Example:

> "RLS (Row Level Security) controls which database rows a user is allowed to access."

Do not replace technical terms with vague wording.

---

# Explain Like a Developer Talking to Another Developer

The tone should be:

* Natural
* Direct
* Clear
* Practical
* Human
* Easy to follow

Avoid sounding like:

* A legal document
* An academic paper
* A corporate audit
* A security textbook
* An AI-generated report

Prefer:

> "This is basically a problem because..."

> "What happens here is..."

> "The important part is..."

> "In simple terms..."

> "This works right now, but it can break when..."

---

# For Every Technical Point

Break complicated explanations into four simple questions:

### 1. What is happening?

Explain what the code/system is currently doing.

### 2. What's the actual problem?

Explain what is wrong or potentially wrong.

### 3. What happens because of it?

Explain the real-world consequence.

### 4. What should be done?

Explain the fix or next step.

Do not skip any of these when the original content provides that information.

---

# Preserve Evidence

If the original contains:

* file names
* line numbers
* function names
* variable names
* API routes
* database tables
* code snippets
* error messages
* commands
* configuration names

keep them.

Do not replace:

`src/app/api/settings/route.js:4-11`

with:

> "somewhere in the settings API."

Specific details are important.

---

# Preserve Severity

If the source says something is:

🔴 Critical
🟠 High
🟡 Medium
🟢 Low
ℹ️ Info

keep the same severity.

Do not change or reinterpret the severity.

Do not create your own ranking.

---

# Preserve Uncertainty

If the original says:

> "Confidence: Medium"

keep that uncertainty.

Do not turn it into:

> "This definitely happens."

If the original says:

> "This depends on which storage bucket is being used."

keep that condition.

Simple language must not turn uncertain information into a confirmed fact.

---

# Explain Technical Terms When Needed

When a term might be confusing, use this format:

> **N+1 query:** The code first gets a list of items and then makes another database request for every item. So 50 items can result in 51 database requests.

Do not give a long textbook definition.

Explain only enough for the reader to understand the specific situation.

---

# Code

Keep code when it is necessary to understand the problem or fix.

But explain the code before or after showing it.

Example:

> The problem is that the password is inside a client-side file. That means the browser receives the password. Anyone can inspect the website code and see it.

```js
const ADMIN_PASSWORD = "12345";
```

Then explain the fix in simple terms.

Do not remove useful code just to make the output shorter.

---

# Numbers and Measurements

Never remove meaningful numbers.

If the source says:

> 200–500ms latency

keep it.

If it says:

> 192 MB RGBA buffer

keep it.

If it says:

> 50 database requests

keep it.

Numbers often explain why an issue matters.

---

# Do Not Add Unsupported Information

Only simplify what is actually present.

Do not invent:

* causes
* solutions
* vulnerabilities
* assumptions
* implementation details

If something is unclear in the source, say:

> "The source doesn't provide enough information to confirm this."

Do not silently fill the gap with assumptions.

---

# Recommended Structure

When explaining a technical report, use this structure:

## What this report is saying

Give a short overview of the whole thing.

## Problems

Go through **every finding**, in the same general order as the source.

For each:

### 🔴 Problem title

**What's happening:**
Simple explanation.

**Why it matters:**
Real-world consequence.

**Where:**
Exact location from the source.

**What should change:**
Simple explanation of the recommendation.

**Technical detail:**
Include any important technical details from the source.

---

## Smaller Issues

Explain every lower-priority issue too.

Do not hide them.

---

## Fix Order

If the source provides a fix priority, preserve it.

Explain why the order matters in simple language, but do not create a different ranking.

---

# If the Source Is Already Well Written

Do not unnecessarily rewrite it.

Only simplify sections that are:

* overly technical
* difficult to understand
* overly verbose
* full of unexplained terminology

Keep clear sections mostly intact.

---

# Final Quality Check

Before responding, compare the simplified explanation against the original.

Check:

* Did I cover every finding?
* Did I preserve every important recommendation?
* Did I preserve file locations?
* Did I preserve important numbers?
* Did I preserve severity?
* Did I preserve uncertainty?
* Did I preserve technical terms that matter?
* Did I accidentally remove an edge case?
* Did I accidentally change the meaning?
* Did I accidentally make a possibility sound certain?
* Did I add anything that wasn't supported?

If any important information was lost, add it back.

## Final Principle

**Do not make the information simpler by removing details.**

**Make the language simpler while keeping the details.**

The ideal output should feel like:

> "A senior developer explained the entire technical report to me in normal English and didn't leave anything important out."
