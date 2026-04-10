---
phase: 02
title: UI/UX Optimization
status: todo
priority: high
effort: 1.5 weeks
---

# Phase 02 — UI/UX Optimization

## Overview

Tối ưu toàn bộ UI dựa trên screenshots sản phẩm thực tế: list view, studio editor, statistics, và trải nghiệm tổng thể.

## Key Insights từ Screenshots

**List View (Playable Ads):**
- Cards hiện chỉ hiện icon placeholder — cần real thumbnail preview
- Search bar lớn, prominent — đúng hướng
- Missing: filter by game/mechanic/status/date range
- "Mixed Creative" feature cần rõ ràng hơn
- 1313 results → pagination server-side cần smooth UX

**Studio Editor:**
- Left panel: Settings/Advanced tabs → JSON editor mode
- Auto Apply toggle → real-time preview update
- File size badge (4.39 MB), warning icons (0 warnings, 1 error)
- Image manager: Gốc → Hiển thị pairs (original → display)
- Multi-device preview (phone/tablet/landscape) icons
- Zoom controls (100%, +/-)
- Dark/light mode toggle (moon icon)
- Source Code Editor tab (HTML viewer)

**Statistics:**
- Pie chart "Trạng thái" — only ACTIVE/INACTIVE, cần thêm categories
- "Top mechanics" section đang empty — cần data
- "Images / playable" bar chart — cần labels rõ hơn

## Requirements

**Playable Ads List:**
- Real thumbnail rendering (iframe screenshot hoặc canvas capture)
- Advanced filter panel: game, mechanic type, status, date range, creator
- Bulk actions: select all, delete, export selected, deploy selected
- List view mode (ngoài grid)
- Sort by: name, date created, date modified, CTR, exports

**Studio:**
- JSON Editor pane (left panel Advanced tab) với syntax highlight
- HTML Source Code viewer (read-only, highlight)
- File size indicator badge với warnings
- Auto Apply real-time debounce (500ms)
- Multi-device preview switcher (mobile portrait/landscape, tablet)
- Zoom control cho preview pane
- Dark/light mode toggle
- Image replacement UX: drag-drop upload, view original vs preview pairs
- Save autosave indicator ("Last saved: X ago")

**Statistics:**
- Filter by date range (date picker)
- "Top mechanics" chart — bar chart by mechanic type
- Export performance by network breakdown
- Creator leaderboard (top contributors)

## Related Code Files

**Modify:**
- `src/components/dashboard/project-card.tsx` — thumbnail preview + more metrics
- `src/components/dashboard/project-grid.tsx` — add filter panel, list/grid toggle
- `src/components/studio/studio-workspace.tsx` — add device switcher, zoom
- `src/components/studio/settings-pane.tsx` — image pairs UX, file size
- `src/components/studio/preview-pane.tsx` — multi-device, zoom, file size badge
- `src/components/studio/ai-copilot-pane.tsx` — streaming response UX
- `src/app/analytics/page.tsx` — build out statistics dashboard
- `src/app/layout.tsx` — dark/light mode support

**Create:**
- `src/components/studio/json-editor-pane.tsx` — JSON editor với validation
- `src/components/studio/source-code-viewer.tsx` — HTML source read-only
- `src/components/studio/device-preview-switcher.tsx` — device size buttons
- `src/components/studio/file-size-badge.tsx` — size + warning indicator
- `src/components/dashboard/filter-panel.tsx` — advanced search/filter
- `src/components/dashboard/bulk-action-bar.tsx` — multi-select actions
- `src/components/ui/code-editor.tsx` — reusable code viewer (Monaco lite)
- `src/components/stats/mechanics-chart.tsx`
- `src/components/stats/network-breakdown-chart.tsx`
- `src/components/stats/daily-creation-chart.tsx`

## UI/UX Design Decisions

### Studio Layout (3-pane với tabs)

```
┌──────────────────────────────────────────────────────────┐
│ [← Back] [Ad Name ✏️]          [🌙] [Save] [Export ▼]  │
│                    [Encrypt ☑] [Reset Factory]           │
├─────────────────────┬────────────────────────────────────┤
│ [Settings][Advanced]│ [Preview][Editor]                  │
│                     │                           ┌──────┐ │
│ Auto Apply [●]      │ Preview  [📱 4.39MB ⚠0 ✗1]│ [📱] │ │
├─────────────────────┤                           │ [💻] │ │
│ CTA              ▼  │   ┌──────────────────┐   │ [📐] │ │
│ Images  [Reset All]▼│   │   iPhone Mockup  │   └──────┘ │
│ Sound            ▼  │   │                  │   100% ±   │
│ Tutorial         ▼  │   │   [Game Preview] │            │
│ Mechanic         ▼  │   │                  │            │
│ Level            ▼  │   └──────────────────┘            │
│ Direct to Store  ▼  │                                   │
└─────────────────────┴────────────────────────────────────┘
```

### JSON Editor (Advanced Tab)

```
Left Pane → Advanced Tab → JSON Editor
- Monaco Editor (lightweight) hoặc CodeMirror
- Real-time validation với VariantConfig schema
- [Reset] [Apply] buttons
- Highlight errors inline
```

### Device Preview Switcher

```
Icons (top-right of preview):
📱 Mobile Portrait (default)
📱 Mobile Landscape
💻 Tablet Portrait
📐 Custom size input
```

### Image Manager UX

```
Slot N: [thumbnail] Original (WxH, X KB) [Xem] → [thumbnail] Hiển thị (WxH, X KB) [Xem trước]
Drag-drop zone để thay thế ảnh
AI Suggest button: gợi ý ảnh phù hợp từ game assets
```

## Implementation Steps

1. **JSON Editor component:** Install `@uiw/react-codemirror` (lightweight) hoặc dùng `<textarea>` với syntax highlight đơn giản
2. **Studio tabs:** Tách settings-pane thành Settings/Advanced (JSON), thêm Preview/Editor tabs cho right pane
3. **File size badge:** Calculate từ HTML export size trong worker
4. **Device switcher:** CSS transform scale trong iframe container
5. **Auto Apply:** debounce 500ms, watch config changes, trigger iframe reload
6. **Filter panel:** Collapsible panel trên project-grid, query params sync với URL
7. **Thumbnail capture:** Dùng `<iframe>` + `html2canvas` hoặc server-side screenshot API
8. **Dark/light mode:** Thêm `next-themes` hoặc CSS variable approach
9. **Statistics charts:** Install `recharts` (lightweight, đang phổ biến với Next.js)
10. **Bulk action bar:** Sticky bottom bar khi có items selected

## Todo List

- [ ] Cài `recharts` cho statistics charts
- [ ] JSON Editor pane (Advanced tab)
- [ ] HTML Source Code viewer (Editor tab)
- [ ] File size badge + warning indicator
- [ ] Auto Apply debounce
- [ ] Device preview switcher
- [ ] Filter panel cho project list
- [ ] Bulk action bar
- [ ] Statistics charts (mechanics, daily creation, network breakdown)
- [ ] Dark/light mode toggle
- [ ] Image manager pairs UX cải thiện
- [ ] Server-side pagination UI (proper pagination component)

## Success Criteria

- Studio có JSON editor hoạt động (edit JSON → preview cập nhật)
- Device switcher thay đổi preview size
- Filter panel lọc đúng projects
- Statistics page hiển thị real charts
- Auto Apply cập nhật preview < 1s

## Dependencies

- Phase 1 (real data) phải xong trước để filter/pagination có data thật
- Phase 3 (real AI) để streaming UX hoạt động
