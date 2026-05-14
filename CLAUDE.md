op


# Unified_X

## Project Purpose
Full-stack web application. (Update this line once the purpose is defined.)

## Tech Stack
TBD — update when decided (language, framework, package manager).

## Structure
```
/                 # repo root
├── frontend/     # (planned) client-side app
├── backend/      # (planned) API / server
└── .claude/      # Claude Code config
```

## Conventions
- Update this section as conventions are established (naming, formatting, import style, test layout).

## Verification
- Dev server: `<update with start command>`
- Verify manually in browser at `http://localhost:<port>`
- Add test/lint/build commands here as the stack is chosen.

## Gotchas
- Stack not yet selected — update CLAUDE.md once the first framework is added.
- Start non-trivial tasks in Plan Mode; update this file when hitting non-obvious issues.

<!-- CLAWS:BEGIN v0.7.14 -->
## Claws — Unified_X (v0.7.14)

The Claws MCP server is running at `.claws/claws.sock`. Machine-wide invariants (boot sequence, completion convention, Monitor pattern, lifecycle phases, Wave Discipline) live in `~/.claude/CLAUDE.md` — do not duplicate them here.

### Where to start

- **`/claws-do "<task>"`** — daily driver. Auto-classifies into shell / worker / fleet / wave.
- **`/claws-status`** — live terminal table + lifecycle state.
- **`/claws-help`** — full command + tool reference.

### MCP tools available (41)

`claws_broadcast`, `claws_close`, `claws_cmd_ack`, `claws_create`, `claws_deliver_cmd`, `claws_dispatch_subworker`, `claws_done`, `claws_drain_events`, `claws_exec`, `claws_fleet`, `claws_get_bin`, `claws_hello`, `claws_lifecycle_advance`, `claws_lifecycle_plan`, `claws_lifecycle_reflect`, `claws_lifecycle_snapshot`, `claws_list`, `claws_peers`, `claws_ping`, `claws_pipeline_close`, `claws_pipeline_create`, `claws_pipeline_list`, `claws_poll`, `claws_publish`, `claws_read_log`, `claws_rpc_call`, `claws_schema_get`, `claws_schema_list`, `claws_send`, `claws_set_bin`, `claws_subscribe`, `claws_task_assign`, `claws_task_cancel`, `claws_task_complete`, `claws_task_list`, `claws_task_update`, `claws_wave_complete`, `claws_wave_create`, `claws_wave_status`, `claws_worker`, `claws_workers_wait`

### Slash commands (10)

`/claws`, `/claws-bin`, `/claws-cleanup`, `/claws-do`, `/claws-fix`, `/claws-help`, `/claws-install`, `/claws-report`, `/claws-status`, `/claws-update`

### Lifecycle phases

```
SESSION-BOOT → PLAN → SPAWN → DEPLOY → OBSERVE → RECOVER → HARVEST → CLEANUP → REFLECT → SESSION-END → FAILED
```

(Workers report a 9-phase subset — see `~/.claude/CLAUDE.md` for details.)

### Reminders

- Workers boot themselves via `claws_worker` / `claws_fleet` — do not run the send sequence manually.
- Completion is `claws_done()` (zero-arg, F3 of the five-layer convention).
- Marker recognized by the server: `__CLAWS_DONE__` only.
- `claws_fleet` and `claws_worker` are non-blocking by default in mission mode (LH-14.1) — poll via `claws_workers_wait`.
- Worker binary: defaults to `claude`. Override with `/claws-bin <name>` or write to `.claws/claude-bin`.

See `~/.claude/CLAUDE.md` for the complete invariant policy.
<!-- CLAWS:END v0.7.14 -->
