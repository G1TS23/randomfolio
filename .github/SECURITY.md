# Security Policy

## Supported versions

This is a single-page, client-side portfolio served as a static site (Astro).
Only the latest deployed version (the `main` branch, live at
<https://olivier.falahi.org>) is supported.

## Scope

The site has **no backend, no accounts, and collects no personal data** — the
only state is a couple of preferences in the browser's `localStorage`
(chosen-universe cycle, language, sound). The realistic surface area is therefore
client-side (e.g. a content-injection or build/dependency issue).

Security headers (Content-Security-Policy, `Strict-Transport-Security`,
`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`) are defined in `netlify.toml`. Dependencies are kept up to
date via Dependabot, and the CI runs on least-privilege token permissions.

## Reporting a vulnerability

Please **do not** open a public issue for security reports.

- Preferred: use GitHub's
  [private vulnerability reporting](https://github.com/G1TS23/randomfolio/security/advisories/new).
- Or email **olivier.falahi@gmail.com** with a description, steps to reproduce,
  and impact.

You can expect an acknowledgement within a few days. Thanks for helping keep the
project safe.
