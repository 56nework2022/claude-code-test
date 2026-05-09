# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment

This project runs in a devcontainer (`.devcontainer/`) based on Debian Bookworm with:
- Node.js (via devcontainer feature)
- GitHub CLI
- Playwright Chromium dependencies pre-installed (`npx playwright install-deps chromium`)

## Project Status

React + Vite + TypeScript で構築されたTODOアプリです。

## Commands

```bash
npm run dev      # 開発サーバー起動 (http://localhost:5173)
npm run build    # 本番ビルド (dist/)
npm run preview  # ビルド結果のプレビュー
```
