<!--
Sync Impact Report
- Version change: N/A (template) -> 1.0.0
- Modified principles:
	- N/A -> I. Server Components First
	- N/A -> II. shadcn UI System Mandate
	- N/A -> III. Layered Server Architecture
	- N/A -> IV. Centralized Types and Validation
	- N/A -> V. Quality Gates and Testing Discipline
- Added sections:
	- Stack and Technical Boundaries
	- Development Workflow and Review Gates
- Removed sections:
	- None
- Templates requiring updates:
	- .specify/templates/plan-template.md: ✅ updated
	- .specify/templates/spec-template.md: ✅ updated
	- .specify/templates/tasks-template.md: ✅ updated
	- .specify/templates/commands/*.md: ⚠ pending (directory not present)
	- README.md: ✅ updated
- Follow-up TODOs:
	- None
-->

# Omnia Constitution

## Core Principles

### I. Server Components First
All application components MUST be Server Components by default. Client Components MUST be
used only when interactive behavior is required, including event handlers, client-only hooks,
or direct DOM manipulation. This keeps rendering predictable, reduces client bundle size, and
preserves performance by design.

### II. shadcn UI System Mandate
UI work MUST use components from the shadcn ecosystem under components/ui and existing shadcn
blocks for complex layouts. Custom UI primitives, CSS Modules, and styled-components are
prohibited when an equivalent shadcn component exists. Tailwind utility classes are the only
allowed styling extension layer. This enforces consistency, accessibility, and maintainability.

### III. Layered Server Architecture
All backend logic MUST live under server and follow the required layered flow. Read paths MUST
follow Server Component -> service -> repository -> database. Write paths MUST follow
Server Action -> controller -> service -> repository -> database. Controllers, services, and
repositories MUST import server-only; actions MUST start with use server. This prevents client
runtime leaks and enforces clear boundaries.

### IV. Centralized Types and Validation
TypeScript interface declarations are prohibited; type aliases MUST be used. Drizzle-derived
types and drizzle-zod schemas MUST be declared only in server/types/index.ts. Form validation
schemas and inferred zod types MUST be declared in validators files and re-exported through
validators/index.ts. This creates one source of truth for domain typing and validation.

### V. Quality Gates and Testing Discipline
Every service MUST have a corresponding unit test file. Mutations MUST use Server Actions.
API Routes MUST NOT be created for internal mutations or list filtering that can be handled by
URL state; API Routes are reserved for external webhooks and integrations. Generated code MUST
be self-explanatory without comments. These rules keep behavior verifiable and avoid architectural
drift.

## Stack and Technical Boundaries

- Framework: Next.js 16 with App Router
- Language: TypeScript
- ORM and database: Drizzle ORM with Neon PostgreSQL serverless
- Validation: Zod with drizzle-zod
- Styling: Tailwind CSS
- Routing protection: proxy.ts replaces middleware usage
- Folder constraints:
	- app contains route layers for private and public areas
	- components/ui stores reusable shadcn primitives
	- server contains database schema, repositories, services, controllers, actions, and central types
	- validators stores form-level zod schemas and zod-inferred types

Any change that violates these boundaries MUST include an approved constitution amendment before
implementation.

## Development Workflow and Review Gates

All feature work MUST pass the following review gates before merge:

1. Component boundary gate: Server Component default is preserved and use client is justified.
2. Data-flow gate: Backend changes remain in server and preserve layer order.
3. Type and validator gate: Type declarations and zod schemas are placed in their mandated files.
4. Mutation gate: Server Actions are used for writes; URL state is used for filter and ordering state.
5. Test gate: New or changed services include and pass unit tests.

Code review MUST reject changes that fail any gate unless a constitution amendment is approved in
the same change set.

## Governance

This constitution overrides conflicting project conventions and templates. Amendments MUST include:

1. A documented rationale describing the operational problem being solved.
2. A semantic version bump decision:
	 - MAJOR for incompatible principle removals or redefinitions.
	 - MINOR for new principles, new mandatory sections, or materially expanded requirements.
	 - PATCH for non-semantic clarifications and wording improvements.
3. A sync impact review that updates all dependent templates and runtime guidance.

Compliance review is mandatory on every pull request and every plan generated from Speckit
templates. Violations discovered after merge MUST trigger corrective follow-up work or a formal
amendment.

**Version**: 1.0.0 | **Ratified**: 2026-04-18 | **Last Amended**: 2026-04-18
