# PRD - iPlayable AI Agent v1 (KR3)

| | |
|---|---|
| **Status** | Draft |
| **Owner** | Nguyen Viet Dung (PO) |
| **Reviewers** | Trung Nghia (CTO), Nguyễn Đức Long (Tech Lead), Hoàng Long (PLA Lead), BS team |
| **Sprint** | Sprint 8 + 9 (13/05 - 31/05) |
| **Related KR** | KR3 - AI Agent tra cứu, phân tích và đề xuất cải thiện cho ≥ 80% yêu cầu thường gặp |

---

## 1. Background & Goals

### Vấn đề
Sau khi có Dashboard (KR2), team vẫn cần thao tác thủ công nhiều cho các tác vụ:
- BS phải tự cross-check data giữa các network khi quyết định budget allocation
- PLA phải mò qua từng playable để tìm asset performance, không có cách hỏi "ad nào có CTR cao nhất với mechanic Match-3?"
- Khi performance giảm, không ai biết nhanh nguyên nhân là do creative hay do network/audience
- Mỗi câu hỏi data đều phải đợi PO/data analyst làm query → bottleneck

### Goal
AI Agent tích hợp trong iPlayable, cho phép user (BS, PLA, leadership) hỏi bằng ngôn ngữ tự nhiên (VN/EN) và nhận được:
1. **Tra cứu** - data answer (số liệu cụ thể từ DB + ad networks)
2. **Phân tích** - so sánh, trend, correlation
3. **Đề xuất** - actionable suggestion để cải thiện playable performance

### Success metric
≥80% (16/20) queries trong eval set đạt rating ≥4/5 từ BS + PLA chấm.

### Non-goal (v1)
- Auto-execute action (tự pause ad, tự tăng budget)
- Generative content (tự sinh playable mới)
- Voice interaction
- Multi-turn deep conversation (>5 lượt)

---

## 2. User Personas & Use Cases

### Persona 1: BS team member
**Goals:** Maximize ROI từ playable ads spend
**Frustrations:** Phải tự correlate data từ 2-3 dashboards của các networks
**Sample queries:**
- "Top 5 playable ad có ROAS cao nhất trong 7 ngày qua trên Facebook?"
- "Tại sao CTR của ad B2WJ giảm 30% tuần này?"
- "So sánh performance của mechanic Match-3 và Word-puzzle"

### Persona 2: PLA team member
**Goals:** Tăng quality output, biết mechanic/asset nào worth invest production effort
**Frustrations:** Không có feedback loop từ ad performance về production decisions
**Sample queries:**
- "Mechanic nào đang có IR cao nhất trong 30 ngày?"
- "Playable nào có nhiều image nhất nhưng CTR thấp? Có phải overload visual?"
- "Suggest 3 cải thiện cho playable Pixel Blast dựa trên data"

### Persona 3: CTO / Tech Lead
**Goals:** Track tool ROI, định hướng product
**Sample queries:**
- "Tổng kết tuần này: bao nhiêu playable mới, performance ra sao so với tuần trước?"
- "Show me bottlenecks trong pipeline production"

---

## 3. Top 20 Queries (Eval Set)

> **Lưu ý:** Danh sách này sẽ finalize sau khi interview BS+PLA (deadline 16/05). Đây là proposal v0.

### Tier 1: Tra cứu (8 queries - dễ)
1. "CTR của playable B2 Wool Loop trong 7 ngày qua?"
2. "Có bao nhiêu playable active hiện tại?"
3. "Top 5 playable có impressions cao nhất tháng này?"
4. "Tổng spend của Facebook network trong 30 ngày?"
5. "List playable thuộc mechanic Hotpot Time"
6. "Playable B1HT có bao nhiêu network đang chạy?"
7. "Khi nào playable Pixel Blast được tạo?"
8. "Asset name nào có CTR cao nhất trong network Unity Ads?"

### Tier 2: Phân tích (8 queries - trung bình)
9. "So sánh performance của 2 mechanic Word Jam vs Word Connect"
10. "Trend CTR của portfolio 30 ngày qua?"
11. "Playable nào có CTR giảm mạnh nhất tuần này so với tuần trước?"
12. "Có correlation giữa số image trong playable và CTR không?"
13. "Network nào hiệu quả nhất cho mechanic Match-3?"
14. "Top 3 lý do (data-based) khiến IR giảm trong tuần?"
15. "Distribution CTR của portfolio - bao nhiêu % ad trên trung bình?"
16. "Performance theo giờ trong ngày của top 10 playable?"

### Tier 3: Đề xuất (4 queries - khó)
17. "Suggest 3 cải thiện cho playable B2WJ dựa trên data 30 ngày"
18. "Nên invest production effort vào mechanic nào H2?"
19. "Identify 5 playable nên pause ngay vì underperform"
20. "Predict CTR của playable mới nếu apply mechanic X + Y assets"

**Rating scale (1-5):**
- 5: Trả lời chính xác, đầy đủ, có actionable insight
- 4: Trả lời đúng nhưng thiếu 1 vài chi tiết, hoặc chưa actionable lắm
- 3: Trả lời được phần nào, có lỗi nhỏ
- 2: Trả lời sai 1 phần lớn hoặc miss point
- 1: Không trả lời được hoặc trả lời sai hoàn toàn

**Pass threshold:** ≥16/20 queries đạt rating ≥4.

---

## 4. Architecture (high-level)

```
┌─────────────────────────────────────────────────┐
│  iPlayable UI (chat panel hoặc page riêng)       │
└────────────────┬────────────────────────────────┘
                 │ User query (NL)
                 ▼
┌─────────────────────────────────────────────────┐
│  AI Agent Orchestrator                          │
│  - LLM: GPT-4o-mini hoặc Claude Sonnet 4         │
│  - System prompt: role + tools + guidelines      │
│  - Function calling enabled                      │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐   ┌──────────────────┐
│ RAG layer    │   │ Function tools    │
│ Vector DB    │   │ - query_metrics() │
│ - Playable   │   │ - get_playable()  │
│   metadata   │   │ - compare_perf()  │
│ - Mechanic   │   │ - export_csv()    │
│   descriptions│  │ - get_trend()     │
└──────┬───────┘   └──────┬───────────┘
       │                  │
       └────────┬─────────┘
                ▼
┌─────────────────────────────────────────────────┐
│  Data layer                                     │
│  - iPlayable DB (playable metadata)             │
│  - Ad networks data (via KR1 pipeline)          │
└─────────────────────────────────────────────────┘
```

### Tech stack (proposal - Long confirm)
- **LLM:** Start với Claude Sonnet 4 (quality cao, $3/$15 per M tokens). Fallback GPT-4o-mini nếu cost issue.
- **RAG:** Sử dụng simple vector store (Chroma/Qdrant) cho metadata, không cần phức tạp
- **Tools/function calling:** Implement 5-7 core functions để query DB
- **Conversation history:** Lưu session 24h trong Redis

### Tool functions (v1)
1. `query_playable_metrics(playable_id, time_range, metrics[])` - lấy metrics cho 1 playable
2. `list_playables(filter: {mechanic, status, network})` - search playables
3. `compare_playables(ids[], time_range)` - so sánh
4. `get_trend(metric, dimension, time_range)` - trend analysis
5. `get_top_n(metric, n, filter)` - top performers
6. `aggregate_by_dimension(dimension, metric, time_range)` - groupby query
7. `export_to_csv(query_result)` - export

---

## 5. UI/UX

### Option A: Chat panel sidebar (recommended)
- Icon chat ở bottom-right corner toàn app
- Click mở panel slide từ phải (40% width)
- History conversation trong session
- Suggested prompts ở empty state

### Option B: Dedicated page "iPlayable Assistant"
- Menu item mới ở sidebar
- Full page chat experience
- Phù hợp cho query phức tạp với output dài

**Đề xuất chọn A** vì user có thể vừa xem dashboard vừa hỏi AI mà không context switch.

### Response format
- Text answer (markdown)
- Embedded charts (nếu query yêu cầu visualize)
- Source citation (link đến playable/dashboard liên quan)
- Follow-up suggestions ("Bạn có muốn xem detail X?")

---

## 6. Eval Framework

**Process:**
1. Mỗi query trong eval set chạy 3 lần để check consistency
2. 2 reviewer chấm độc lập (1 BS + 1 PLA) → average score
3. Cross-check với "expected answer" được tạo từ raw data thủ công
4. Track theo Notion doc với cột: query, response, BS_score, PLA_score, avg, pass?

**Definition of "pass" cho 1 query:** avg score ≥4/5
**Definition of KR3 đạt:** ≥16/20 queries pass

**Eval rounds:**
- Round 1 (Sprint 8 end - 23/05): baseline với v1, kỳ vọng ≥10/20 pass
- Round 2 (Sprint 9 mid - 28/05): sau khi tune, kỳ vọng ≥14/20
- Round 3 (Sprint 9 end - 30/05): final, target ≥16/20

---

## 7. Acceptance Criteria

### Must have (v1 - Sprint 8 deliverable)
- [ ] Chat UI tích hợp vào iPlayable (Option A)
- [ ] Trả lời được ≥10/20 queries với rating ≥4
- [ ] Tool function calling hoạt động đúng
- [ ] Có conversation history trong session
- [ ] Citation source khi reference data

### Must have (v2 - Sprint 9 final)
- [ ] ≥16/20 queries đạt rating ≥4 (≥80%)
- [ ] Eval doc hoàn chỉnh
- [ ] Latency p50 ≤5s, p95 ≤15s
- [ ] Cost monitoring set up (budget alert >$50/day)
- [ ] User documentation

### Out of scope (push H2)
- Auto-execute action
- Generative content (tự sinh playable)
- Voice interaction
- Multi-turn deep conversation
- Personalization per user

---

## 8. Dependencies & Risks

**Dependencies:**
- KR1 (data pipeline) phải ổn định → block AI Agent vì cần data thật để query
- KR2 (Dashboard) chia sẻ data layer + metric definitions → đồng bộ schema
- Top 20 queries từ interview → block prompt engineering

**Risks:**
- ⚠️ **80% threshold rất cao cho v1 trong 18 ngày** → mitigation: bắt đầu interview ngay tuần này, scope query Tier 1+2 trước, Tier 3 (đề xuất) nếu không đạt thì negotiate với CTO
- ⚠️ **LLM cost** - 1642 playable × multiple queries/day có thể nhanh đốt budget → mitigation: set budget cap $50/day v1, monitor và optimize prompt nếu over
- ⚠️ **Data quality từ KR1** - nếu data missing hoặc inconsistent, AI sẽ trả lời sai → mitigation: AI phải biết khi data missing và trả lời "không đủ data" thay vì hallucinate
- ⚠️ **Hallucination on Tier 3 queries** - LLM có thể bịa "đề xuất" không grounded → mitigation: yêu cầu citation từ data trong system prompt, reject response thiếu source

---

## 9. Timeline

| Mốc | Ngày | Output |
|---|---|---|
| Interview BS+PLA | 14-16/05 | Top 20 queries doc |
| PRD final + eval set | 19/05 | Doc này được approve |
| Build v1 (orchestrator + 3 core tools) | 23/05 | AI Agent answer ≥10/20 |
| Eval round 1 | 23/05 | Baseline report |
| Tune prompts + add tools | 26-28/05 | v1.5 |
| Eval round 2 | 28/05 | ≥14/20 |
| Final polish | 29-30/05 | v2 |
| Eval round 3 | 30/05 | ≥16/20 PASS |
| Demo CTO end-H1 | 31/05 | OKR review |
