# AGENTS.md

This file provides guidance to AI agents (including Codex CLI, Cursor, and other LLM-powered tools) when working with code in this repository.

## Git Commit Standards

Format commit messages as:
```
type(scope[detail]) concise description

why: Explanation of necessity or impact.
what:
- Specific technical changes made
- Focused on a single topic
```

Notes:
- `commit-type` is always lowercase.
- `scope` should usually be lowercase; use proper capitalization only when it's a proper name (e.g. a class like `UniversalFlashcardWrapper`).

Common commit types:
- **feat**: New features or enhancements
- **fix**: Bug fixes
- **refactor**: Code restructuring without functional change
- **docs**: Documentation updates
- **chore**: Maintenance (dependencies, tooling, config)
- **test**: Test-related updates
- **style**: Code style and formatting
- **js(deps)**: Dependencies
- **js(deps[dev])**: Dev Dependencies
- **ai(rules[AGENTS])**: AI rule updates
- **ai(claude[rules])**: Claude Code rules (CLAUDE.md)
- **ai(claude[command])**: Claude Code command changes

Example:
```
feat(lib[youtube]) Support YouTube Shorts URLs

why: Users often paste Shorts links; embeds should just work.
what:
- Detect `/shorts/<id>` URL pattern
- Convert Shorts URLs to `youtube.com/embed/<id>`
- Add tests for common Shorts URL variants
```
For multi-line commits, use heredoc to preserve formatting:
```bash
git commit -m "$(cat <<'EOF'
feat(Component[method]) add feature description

why: Explanation of the change.
what:
- First change
- Second change
EOF
)"
```
