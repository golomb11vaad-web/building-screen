# Showrunner Init Report

Per `core/method.md` S2 step 7 (report inferred values, human-provided
values, disabled capabilities, and unresolved risks), for the initial write
of `.claude/showrunner/config.md`.

## Inferred values

- None. The repository was empty at init - no guidance files, no existing
  project-memory files, no prior `.claude/showrunner/` directory, nothing to
  read or infer from.

## Human-provided / convention-default values

- `project.name`, `project.root_markers`, `project.primary_branch` (`main`),
  `project.remote` (`origin`), `project.guidance_files`
  (`CLAUDE.md`), `project.decision_log`, `project.project_state`, and
  `project.hygiene_ledger` are set to Showrunner-convention defaults (same
  shape as `c:\ShowRunner`'s own binding), not evidenced from this repo.
- `repository.branch_pattern` (`feat/<slug>`),
  `repository.require_remote_tip_match`, `commit_hook.*`, and `merge.*`
  (stop-before-main, no-ff, two-commit ceremony) are Showrunner-convention
  defaults, applied uniformly so the merge ceremony and commit-hook
  enforcement are active from the first commit.
- `roles.*`, `questions.max_per_round`, and `step0.*` are Showrunner
  defaults (opus architect / sonnet implementer, cold-context required,
  capped question rounds, verified-path Step 0).

## Disabled capabilities

- `tests.commands` (unit/integration/bundle): no test runner exists yet.
- `design.token_sources`: no design-token source exists yet.
- `locale_ceremony`: not enabled - no localization in scope yet.
- `quality_gates.wow_check`: disabled pending a creative-gate decision.
- `smoke.definition`: disabled - no runtime to smoke-test yet.
- `forge.outputs.designer_briefs_directory`, `forge.designer_helper.tool`:
  disabled pending `/forge design` adoption.
- `arc.test_lanes.*`, `arc.smoke.*`, `arc.migration`: disabled - no
  server/web/mobile lanes or migrations exist yet.
- `sentry.*` (stack, auth_model, tenancy beyond `none`, compliance beyond
  `none`, data_classification, deploy, database, edge_provider,
  public_surfaces, unauthenticated_endpoints, security_test_commands,
  ci_gates, pen_test, memory, mobile_signing, monthly): all disabled or
  empty - no architecture exists yet to classify.
- `bible.sources`, `bible.repository_map`: empty - nothing to synthesize
  yet. `bible.audience` is `<unresolved>`.

## Status fields

- `forge.status`, `arc.status`, `sentry.status`, `bible.status` are all
  `uninitialized` by design. Each skill validates its own required bindings
  on first `init` and promotes itself to `ready` independently; core init
  does not set any of them.
- `forge.status` specifically stays `uninitialized` pending `/forge
  discover` (Stage 1 of this dry run) - the founding interview for "a smart
  screen for a building lobby" will resolve the constitution and the other
  forge bindings, after which a `forge init` rerun can promote it to
  `ready`.

## Unresolved risks

- `project.decision_log` (`.claude/showrunner/decisions.md`) and
  `project.project_state` (`.claude/showrunner/project-state.md`) are
  configured paths that do not exist yet. Per S2 step 5, the hygiene ledger
  was created now (no existing project-state or backlog file could receive
  the entry); decisions.md and project-state.md will be created on first use
  by whichever skill writes to them first (expected: Forge, at `discover` or
  `plan`).
- No other unresolved risks. Nothing destructive, compliance-sensitive, or
  irreversible was inferred or decided during this init.

## Gate state

`READY` for Stage 1 (`/forge discover`). Core init is complete; the commit
hook is installed and verified (first commit `dd212bf` passed the
`commit-msg` hook on the `chore` prefix).
