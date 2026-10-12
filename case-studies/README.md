# Worked system design case studies

[← Course home](../README.md)

These case studies use a consistent sequence: scope → workload → API/state → baseline → bottleneck → evolution → failure behavior. Numbers are illustrative assumptions, not product telemetry. For each design, first sketch your own solution, then compare your choices and trade-offs.

| Case study | Core problem | Start here |
|---|---|---|
| URL shortener | Map a short key to a destination with a very read-heavy redirect path | [Design a URL shortener](url-shortener.md) |
| News feed | Assemble relevant posts for readers with uneven follower counts | [Design a news feed](news-feed.md) |
| Real-time chat | Deliver ordered conversation events across unreliable connections | [Design real-time chat](real-time-chat.md) |
| Video streaming | Ingest, transcode, authorize, and deliver large media globally | [Design video streaming](video-streaming.md) |
| Ride hailing | Search nearby drivers and assign one driver safely to a ride | [Design ride matching](ride-hailing.md) |
| File sync | Transfer large files and reconcile offline device changes | [Design file synchronization](file-sync.md) |
| Rate limiter | Enforce fair-use and overload limits across app instances | [Design a distributed rate limiter](rate-limiter.md) |
| Web crawler | Schedule, deduplicate, fetch, and index pages politely | [Design a distributed web crawler](web-crawler.md) |
| Ticket reservations | Protect limited inventory during a bursty sale | [Design ticket reservations](ticket-reservations.md) |
| Payment ledger | Record external payment outcomes and balanced money movement | [Design a payment ledger](payment-ledger.md) |
| Notification system | Deliver consent-aware messages across providers and channels | [Design a notification system](notification-system.md) |

For interview prompts by common problem family and publicly reported company associations, see the [system design interview question bank](../INTERVIEW_QUESTION_BANK.md). Company names are study cues, not guarantees about any current interview loop.

## Cross-cutting comparison lens

The table below compares the first eight architecture walkthroughs. The ticketing, payment, and notification designs focus on transactional correctness and delivery policy; they are summarized separately afterward.

| Concern | URL shortener | News feed | Chat | Video | Ride matching | File sync | Rate limiter | Crawler |
|---|---|---|---|---|---|---|---|---|
| Hot entity | Popular short key | Celebrity account | Active conversation | New release / segment | Dense pickup zone | Shared large file | Popular API key | Popular domain |
| Read / data path | Cache mapping | Precompute or merge feed | History + live push | CDN segments | Geo candidate search | Blob + metadata | Counter / token state | Frontier + blob store |
| Async work | Analytics | Fan-out and ranking | Push delivery | Transcoding | Dispatch offers | Change propagation | Policy updates | Fetch + indexing |
| Critical guarantee | Mapping durability | Privacy + freshness | Per-conversation order | Authorized playback | Exclusive assignment | Version/conflict safety | Defined burst semantics | Domain politeness |

### Transactional and delivery deep dives

| Design | Hard invariant / policy | Failure to reason through |
|---|---|---|
| Ticket reservations | Never confirm more inventory than exists | Payment may succeed while the hold expires or its response is lost |
| Payment ledger | Every posted transaction balances and retries do not double-charge | Provider outcome is unknown after a timeout; webhook may repeat or arrive out of order |
| Notification system | Honor consent and priority while controlling provider rate | Provider accepts a send but response is lost; retry could duplicate delivery |

Try each case study with one changed constraint. For example: require deletion propagation, multi-region writes, strict read-your-writes, or a 10× peak. The design should change in a traceable way.

The three extended cases above focus on different correctness boundaries: ticket inventory is scarce mutable state, payments combine a local ledger with uncertain external side effects, and notifications coordinate policy with unreliable delivery providers.
