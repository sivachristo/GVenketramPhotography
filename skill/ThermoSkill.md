# Thermo-Nuclear Code Quality Review

## Purpose

Perform an extremely rigorous code-quality review of the repository. Assume the goal is to find problems that would survive a normal code review.

Do not merely comment on formatting or style. Investigate correctness, architecture, maintainability, security, performance, edge cases, developer experience, and long-term technical debt.

## Review Principles

Be skeptical and evidence-driven.

Do not report something as a problem unless you can point to the relevant code, behavior, dependency, configuration, or architectural decision.

Prioritize real issues over cosmetic preferences.

Trace important code paths instead of reviewing files in isolation.

When possible, verify findings by searching the repository, following imports/usages, checking configuration, and examining related components.

## Review Areas

### 1. Correctness

Look for:

* Logic bugs
* Incorrect assumptions
* Broken edge cases
* Race conditions
* Async/await problems
* Incorrect error handling
* Null/undefined handling
* State-management bugs
* Incorrect API contracts
* Data transformation errors
* Incorrect caching behavior
* Problems that only appear under specific inputs or environments

### 2. Architecture

Evaluate:

* Separation of concerns
* Component/module boundaries
* Coupling
* Circular dependencies
* Abstraction quality
* Duplication
* Responsibility leakage
* Business logic inside presentation layers
* Poor dependency direction
* Over-engineering
* Under-engineering
* Patterns that will become difficult to maintain as the application grows

### 3. Maintainability

Look for:

* Repeated logic
* Large or overly complex functions
* Misleading names
* Hidden side effects
* Magic values
* Difficult-to-follow control flow
* Dead code
* Unused dependencies
* Inconsistent patterns
* Fragile implementations
* Code that requires excessive context to understand

### 4. Type Safety

For TypeScript projects, specifically investigate:

* `any`
* Unsafe type assertions
* `@ts-ignore`
* `@ts-expect-error`
* Incorrect optional types
* Weak API types
* Runtime values that contradict compile-time types
* Missing validation at external boundaries
* Inferred types that hide important contracts

### 5. Security

Check for:

* Hardcoded secrets
* Exposed credentials
* Unsafe environment-variable usage
* Injection vulnerabilities
* XSS
* CSRF
* SSRF
* Broken authorization
* Missing authentication checks
* Insecure file uploads
* Unsafe redirects
* Sensitive information exposed to clients
* Excessive permissions
* Trusting client-provided data
* Missing server-side validation

Never expose discovered secrets in the review output. Refer to the location and explain the risk without reproducing credentials.

### 6. Performance

Investigate:

* Unnecessary renders
* Expensive computations
* N+1 queries
* Unnecessary network requests
* Large client bundles
* Missing pagination
* Inefficient database queries
* Excessive image sizes
* Unnecessary JavaScript sent to the browser
* Poor caching
* Memory leaks
* Blocking operations
* Sequential operations that could safely run concurrently

Do not recommend optimization merely because something could theoretically be faster. Explain the actual or likely bottleneck.

### 7. Error Handling

Check whether:

* Errors are swallowed
* Errors are logged without useful context
* Users receive misleading errors
* API failures are handled incorrectly
* Loading/error states are missing
* Retry behavior is unsafe
* Partial failures leave inconsistent state
* Exceptions cross boundaries incorrectly

### 8. Testing

Evaluate:

* Missing tests for critical functionality
* Weak assertions
* Tests that only test implementation details
* Missing edge cases
* Missing integration tests
* Missing authorization tests
* Flaky tests
* Excessive mocking
* Important business logic without meaningful coverage

Do not judge quality solely by test coverage percentage.

### 9. Next.js / React

For Next.js/React projects, specifically inspect:

* Server vs Client Component boundaries
* Unnecessary `"use client"`
* Data fetching patterns
* Server Actions
* API routes
* Middleware/proxy behavior
* Authentication boundaries
* Hydration problems
* `useEffect` misuse
* Dependency arrays
* State synchronization
* Prop drilling
* Context overuse
* Key usage
* Image optimization
* Metadata/SEO
* Loading and error boundaries
* Caching and revalidation
* Dynamic rendering
* Bundle size
* Client-side data fetching where server-side fetching would be more appropriate

### 10. Database / API

Check:

* Schema consistency
* Missing indexes
* Inefficient queries
* Missing constraints
* Authorization at the database/API layer
* Validation
* Transaction boundaries
* Race conditions
* Data integrity
* Pagination
* Filtering
* Sorting
* Error contracts
* Backward compatibility

Never assume frontend validation is sufficient for security.

### 11. Dependencies and Configuration

Inspect:

* Outdated or unnecessary dependencies
* Duplicate libraries solving the same problem
* Dangerous packages
* Incorrect dependency placement
* Build configuration
* Environment configuration
* Scripts
* CI/CD configuration
* Production vs development differences

### 12. Repository Consistency

Look for inconsistencies between:

* Similar components
* Similar API routes
* Naming conventions
* Folder structures
* Error-handling approaches
* Data-fetching patterns
* Styling approaches
* Authentication patterns
* Documentation and actual implementation

Inconsistency is especially important because it increases future maintenance cost.

## Review Procedure

Follow this sequence:

1. Understand the repository structure.
2. Identify the application architecture and major execution paths.
3. Inspect package/configuration files.
4. Identify critical business logic.
5. Trace important frontend → API → database flows.
6. Search for security-sensitive operations.
7. Search for duplicated and suspicious patterns.
8. Inspect error handling and edge cases.
9. Inspect tests and determine what is actually protected.
10. Run available linting, type-checking, tests, and build commands when practical.
11. Verify suspicious findings against surrounding code.
12. Produce the final review.

Do not stop after finding the first few issues.

## Severity

Classify findings as:

### CRITICAL

A serious security vulnerability, data-loss possibility, production-breaking defect, or issue that can compromise the system.

### HIGH

A significant correctness, security, reliability, or architectural problem that could realistically cause production failures.

### MEDIUM

A meaningful maintainability, performance, reliability, or correctness concern that should be addressed.

### LOW

A legitimate improvement with limited immediate impact.

### INFO

An observation, potential improvement, or architectural consideration that is not necessarily a defect.

## Finding Format

For every finding, provide:

**[SEVERITY] Short title**

**Location:** `path/to/file.ts:line`

**Problem:**
Explain exactly what is wrong.

**Why it matters:**
Explain the practical consequence.

**Evidence:**
Reference the relevant code path or behavior.

**Recommendation:**
Give a concrete fix.

**Confidence:** High / Medium / Low

Do not inflate severity.

## Important Rules

Do not rewrite the entire repository.

Do not make changes unless explicitly asked.

Do not report formatting preferences as defects.

Do not recommend abstractions simply to make code "cleaner."

Do not assume a pattern is wrong without understanding its context.

Distinguish confirmed bugs from potential risks.

If something is intentionally designed that way, do not flag it merely because another architecture could be used.

Prefer fewer high-confidence findings over a long list of weak observations.

At the end, provide:

### Executive Summary

A concise assessment of the repository's main strengths and weaknesses.

### Highest-Priority Findings

List the most important issues by severity.

### Recommended Fix Order

Give a practical sequence for addressing the findings.

### Areas Reviewed

List the major areas actually inspected.

### Verification

State which commands/checks were actually run and their results. Never claim that tests, builds, or static analysis were run if they were not.

## Final Standard

Review the code as though it will be maintained by another engineering team for several years.

Ask:

> "What could break, become a security problem, become expensive to maintain, or cause a developer to misunderstand the system?"

Find those problems, verify them, and explain them precisely.
