# Worked system design case studies

[← Course home](../README.md)

These case studies use a consistent sequence: scope → workload → API/state → baseline → bottleneck → evolution → failure behavior. Numbers are illustrative assumptions, not product telemetry. For each design, first sketch your own solution, then compare your choices and trade-offs.

| Case study | Core problem | Start here |
|---|---|---|
| URL shortener | Map a short key to a destination with a very read-heavy redirect path | [Design a URL shortener](url-shortener.md) |
| News feed | Assemble relevant posts for readers with uneven follower counts | [Design a news feed](news-feed.md) |
| Real-time chat | Deliver ordered conversation events across unreliable connections | [Design real-time chat](real-time-chat.md) |

## Comparison lens

| Concern | URL shortener | News feed | Chat |
|---|---|---|---|
| Hot entity | Popular short key | Celebrity account | Active conversation |
| Read optimization | Cache mapping | Precompute or merge feed | Connection routing / history page |
| Async work | Analytics | Fan-out and ranking | Push delivery / notifications |
| Important guarantee | Link mapping durability | Visibility and freshness | Per-conversation order and reconnect |

Try each case study with one changed constraint. For example: require deletion propagation, multi-region writes, strict read-your-writes, or a 10× peak. The design should change in a traceable way.
