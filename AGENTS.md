<!-- headroom:rtk-instructions -->
# RTK (Rust Token Killer) - Token-Optimized Commands

When running shell commands, **always prefix with `rtk`**. This reduces context
usage by 60-90% with zero behavior change. If rtk has no filter for a command,
it passes through unchanged — so it is always safe to use.

## Key Commands
```bash
# Git (59-80% savings)
rtk git status          rtk git diff            rtk git log

# Files & Search (60-75% savings)
rtk ls <path>           rtk read <file>         rtk grep <pattern>
rtk find <pattern>      rtk diff <file>

# Test (90-99% savings) — shows failures only
rtk pytest tests/       rtk cargo test          rtk test <cmd>

# Build & Lint (80-90% savings) — shows errors only
rtk tsc                 rtk lint                rtk cargo build
rtk prettier --check    rtk mypy                rtk ruff check

# Analysis (70-90% savings)
rtk err <cmd>           rtk log <file>          rtk json <file>
rtk summary <cmd>       rtk deps                rtk env

# GitHub (26-87% savings)
rtk gh pr view <n>      rtk gh run list         rtk gh issue list

# Infrastructure (85% savings)
rtk docker ps           rtk kubectl get         rtk docker logs <c>

# Package managers (70-90% savings)
rtk pip list            rtk pnpm install        rtk npm run <script>
```

## Rules
- In command chains, prefix each segment: `rtk git add . && rtk git commit -m "msg"`
- For debugging, use raw command without rtk prefix
- `rtk proxy <cmd>` runs command without filtering but tracks usage
<!-- /headroom:rtk-instructions -->

<!-- mem0-instructions -->
# Mem0 Memory (cross-session)

Persistent user/project memory via the mem0 CLI. Use for facts that should
survive across sessions (user preferences, decisions, project gotchas).

## Commands (always use `--agent` for JSON output)
```bash
mem0 --agent search "<query>"          # retrieve relevant memories
mem0 --agent add "<fact>"              # store a durable fact
mem0 --agent list                       # list all memories
mem0 --agent delete "<id>" --force     # remove a memory
```

## Rules
- Before doing work that depends on the user's past choices, `search` first.
- `add` a fact only when it's durable and reusable (preferences, constraints,
  architecture decisions). Don't store one-off task details.
- Scope is the default user (`user_a0c56b92f6e5`); no need to pass `--user-id`.
<!-- /mem0-instructions -->
