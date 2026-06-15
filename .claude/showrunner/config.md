# SmartScreen Project Binding

```yaml
schema_version: 1

project:
  name: SmartScreen
  root_markers: [".claude/showrunner/config.md"]
  primary_branch: main
  remote: origin
  guidance_files: ["CLAUDE.md"]
  decision_log: .claude/showrunner/decisions.md
  project_state: .claude/showrunner/project-state.md
  hygiene_ledger: .claude/showrunner/ledger.md

roles:
  architect_model: opus
  implementer_model: sonnet
  cold_context_required: true
  surface_token_cost: true

questions:
  max_per_round: 5

step0:
  read_list: []
  require_verified_paths: true
  require_explicit_approval: true

repository:
  branch_pattern: "feat/<slug>"
  require_remote_tip_match: true
  prompt_artifacts:
    tracked: false
    cleanup_globs: []

tests:
  commands:
    unit: disabled
    integration: disabled
    bundle: disabled
  migration_fixture_rule: true
  fixture_clock_rule: true

design:
  token_sources: ["disabled"]
  no_hardcode: ["colors", "copy", "spacing", "motion"]

locale_ceremony:
  enabled: false
  description: "disabled"
  files: []
  approval_required_before_write: false
  symmetry_check: disabled

quality_gates:
  wow_check:
    enabled: false
    config: {}
  audit:
    enabled: true
    severity_block: critical

smoke:
  required_for: ["runtime_state", "device", "external_ops"]
  definition: disabled

commit_hook:
  hooks_path: .githooks
  allowlist_prefixes:
    - feat
    - fix
    - docs
    - chore
    - refactor
    - test
    - ci
    - build
    - perf
    - revert
  install_command: "git config core.hooksPath .githooks"
  forbid_no_verify: true

merge:
  stop_before_main: true
  strategy: no-ff
  first_commit_prefix: "Merge:"
  second_commit_prefix: "docs(backlog):"
  first_parent_commit_count: 2

forge:
  status: uninitialized
  soul_file: disabled
  voice_rules: []
  design_principle: disabled
  asset_reservations: []
  decision_entry_template: disabled
  project_state_cadence: per-arc
  outputs:
    specs_directory: .claude/showrunner/specs
    designer_briefs_directory: disabled
  creative_gate:
    command: "/wow-check"
    ship_verdict_required: true
  decision_surface:
    ask: ["name", "scope", "emotional_framing", "privacy", "monetization"]
    default: ["file_placement", "key_prefixes", "pattern_reuse"]
  designer_helper:
    tool: disabled
    brief_template: disabled
  handoff:
    target: "/arc plan"
    seam: "spec section 8 to section 9"

arc:
  status: uninitialized
  additional_step0_reads: []
  planning:
    plans_directory: .claude/showrunner/plans
    prompts_directory: untracked
  test_lanes:
    server: disabled
    web: disabled
    mobile: disabled
  migration:
    enabled: false
    pre_migration_fixture_required: true
  gates:
    audit: "/audit"
    creative: "/wow-check"
  smoke:
    server: disabled
    web: disabled
    mobile: disabled

sentry:
  status: uninitialized
  surfaces:
    backend_api: true
    web_frontend: false
    native_mobile: false
    ai_llm: false
    agentic_ai: false
    supply_chain: true
    cloud_iac_container: false
    network_infrastructure: false
    edge_dns_email: false
  stack: {}
  auth_model: {}
  tenancy:
    model: none
    scoping_helpers: []
  compliance:
    regimes: ["none"]
    cvss_required: false
  data_classification:
    document: disabled
    classes: []
  deploy: {}
  database: {}
  edge_provider: none
  public_surfaces: []
  unauthenticated_endpoints: []
  security_test_commands: {}
  ci_gates: []
  pen_test:
    enabled: false
    engagements_directory: disabled
    reports_directory: disabled
    evidence_directory: disabled
    evidence_freshness_days: 30
    coverage_target_percent: 98
    critical_coverage_percent: 100
    domain_floor_percent: 95
    authorization:
      approval_evidence: disabled
      rules_of_engagement: disabled
      authorizing_owner: disabled
    safety:
      maximum_class: disabled
      source_identity: disabled
      max_requests_per_second: disabled
      max_concurrency: disabled
      max_payload_bytes: disabled
      kill_switch: disabled
      service_health_observer: disabled
    evidence:
      classification: disabled
      retention: disabled
      storage: disabled
    emergency_contact: disabled
    cleanup_owner: disabled
  memory:
    security_doc: disabled
    accepted_risks: disabled
    regression_catalog: disabled
  backup_access_policy: disabled
  known_dependency_blocks: []
  mobile_signing:
    enabled: false
    ios_profile_management: disabled
    android_keystore_management: disabled
    ci_secret_storage: disabled
  monthly:
    enabled: false
    digest_destination: disabled
    accepted_risk_max_age_days: 90

bible:
  status: uninitialized
  sources:
    forge_spec: disabled
    arc_ship_reports: []
    sentry_sweep_reports: []
    sentry_security_doc: disabled
    pen_test_reports: disabled
  repository_map:
    components: []
    data_model: []
    interfaces: []
  audience: "<unresolved>"
  require_exact_tip: true
  output:
    path: .claude/showrunner/bible.md
```
