# System design interview question bank

[← Course home](README.md) · [Worked case studies](case-studies/README.md) · [Interview method](lessons/09-design-interview.md)

This bank collects **well-known practice prompts** and examples that appear in public interview-preparation material and candidate reports. It is a study guide, not an employer question leak or an official list.

> **Important attribution note:** Interviews vary by role, level, team, interviewer, and hiring cycle. A prompt named after a company product (for example, “Google Docs”) does **not** prove that the company currently asks that exact question. Company associations below are qualified examples found in public sources; they are neither guaranteed nor exhaustive. Always confirm format and scope with your recruiter.

## Company-oriented practice map

| Company / product family | Representative public prompt examples | Practice the underlying system-design skills | Public reference |
|---|---|---|---|
| **Google / search and collaboration** | Design a collaborative editor like Google Docs; design a web crawler/search pipeline | Concurrent edits, operation ordering, crawl frontier, deduplication, politeness, indexing | [Google Docs breakdown](https://www.hellointerview.com/learn/system-design/problem-breakdowns/google-docs) · [Web crawler breakdown](https://www.hellointerview.com/learn/system-design/problem-breakdowns/web-crawler) |
| **Meta / social products** | Design Facebook News Feed; design a messaging product | Fan-out-on-write vs. fan-out-on-read, social graph, ranking, privacy, live delivery | [News Feed breakdown](https://www.hellointerview.com/learn/system-design/problem-breakdowns/fb-news-feed) · [Question preparation list](https://www.hellointerview.com/learn/system-design/in-a-hurry/how-to-prepare) |
| **Amazon / commerce and delivery** | Design an Amazon Locker delivery flow; design inventory or flash-sale reservation | Inventory invariants, idempotent orders, state machines, load spikes, operational recovery | [Amazon Lockers community prompt](https://www.hellointerview.com/community/questions/amazon-lockers-delivery/cm5rze52100022z6nrynwzuc7) · [Design primer question bank](https://github.com/donnemartin/system-design-primer) |
| **Uber / real-time marketplace** | Design a ride-sharing service; public candidate reports also describe a Kafka-like broker prompt | Geospatial indexes, driver location freshness, atomic matching, stream partitions, backpressure | [Ride-sharing breakdown](https://www.hellointerview.com/learn/system-design/problem-breakdowns/uber) · [Candidate-reported broker interview](https://interviewexperiences.in/experience/uber/uber-system-design-round-l5-design-kafka) |
| **Dropbox / file synchronization** | Design a cloud file storage and sync service | Chunking, content hashes, resumable uploads, versioning, conflict handling, permissions | [Dropbox community prompt](https://www.hellointerview.com/community/questions/file-storage-sync/cm4t118ah004dw579eefogdzx) · [Design primer question bank](https://github.com/donnemartin/system-design-primer) |
| **Netflix / YouTube-style media delivery** | Design a video-on-demand streaming platform | Ingest/transcode pipelines, manifests, adaptive bitrate, CDN/origin capacity, playback recovery | [Design primer question bank](https://github.com/donnemartin/system-design-primer) · [Interview-prep guide](https://www.tryexponent.com/blog/system-design-interview-guide) |
| **Microsoft / enterprise collaboration** | Practice a file-sync or collaborative-workspace system such as OneDrive/Teams | Tenant boundaries, identity, permissions, sync state, search, multi-device behavior | [Design primer question bank](https://github.com/donnemartin/system-design-primer) |

Company-specific material should help you choose **which concepts to rehearse**, not encourage memorizing an assumed internal architecture. Interviewers usually care more about your assumptions and reasoning than whether your boxes resemble a company’s production stack.

## Canonical prompt catalog

These prompts are useful across many employers. Try stating requirements and one explicit assumption before opening any linked solution.

| Difficulty | Prompt | Main design pressure | Course walkthrough |
|---|---|---|---|
| Starter | Design a URL shortener / TinyURL | Unique IDs, read-heavy redirects, cache, abuse | [URL shortener](case-studies/url-shortener.md) |
| Starter | Design an API rate limiter | Burst control, distributed counters, failure policy | [Rate limiter](case-studies/rate-limiter.md) |
| Starter | Design a notification delivery service | Fan-out, provider retries, preferences, deduplication | [Queues & events](lessons/07-queues-and-events.md) |
| Intermediate | Design a social news feed | Fan-out, celebrity skew, ranking, freshness | [News feed](case-studies/news-feed.md) |
| Intermediate | Design real-time chat | Message ordering, reconnect, delivery states, presence | [Real-time chat](case-studies/real-time-chat.md) |
| Intermediate | Design Dropbox / Google Drive | Chunked files, synchronization, conflicts, sharing | [File synchronization](case-studies/file-sync.md) |
| Intermediate | Design YouTube / Netflix-style streaming | Transcoding, object storage, manifests, CDN | [Video streaming](case-studies/video-streaming.md) |
| Intermediate | Design a web crawler | Frontier scheduling, domain politeness, dedupe, retry | [Distributed web crawler](case-studies/web-crawler.md) |
| Intermediate | Design search autocomplete | Prefix index, update pipeline, ranking, tail latency | [Storage systems](lessons/10-storage-systems.md) |
| Advanced | Design Uber / ride matching | Geo search, location updates, exclusive match, dispatch | [Ride sharing](case-studies/ride-hailing.md) |
| Advanced | Design ticket / seat reservation | Oversell prevention, expiring holds, payment workflow | [Reservation mini-example](lessons/09-design-interview.md) |
| Advanced | Design a distributed key-value store | Partitioning, replication, consistency, repair | [Distributed systems](lessons/05-distributed-systems.md) |
| Advanced | Design a distributed message broker | Partition logs, consumer offsets, replay, ordering | [Queues & events](lessons/07-queues-and-events.md) |
| Advanced | Design a file/object storage platform | Metadata, blobs, multipart upload, durability, deletion | [Storage systems](lessons/10-storage-systems.md) |
| Advanced | Design a real-time leaderboard / trending service | Windowed aggregation, hot keys, approximate counts | [Estimation & workload](lessons/02-requirements-and-estimates.md) |
| Advanced | Design a payment / wallet workflow | Ledger invariants, idempotency, reconciliation, fraud | [API & data invariants](lessons/03-api-and-data-design.md) |
| Advanced / role-specific | Design an LLM-backed retrieval service | Ingestion, retrieval, model latency/cost, privacy, evaluation | [Architecture evolution](lessons/12-architecture-evolution.md) |

## The shared follow-up bank

Expect the interviewer to change a constraint after your first design. Practice answering follow-ups that reveal whether the architecture is reasoned through or memorized.

### Requirements and workload

1. Which user action is most important? What is explicitly out of scope?
2. What changes if peak traffic is 10× your estimate for ten minutes?
3. What is the read/write ratio **by bytes and resource cost**, not just request count?
4. Which users, keys, tenants, or regions create skew and hot spots?
5. What is the latency target at p95/p99, measured from where?

### Data and correctness

6. Which component owns the source of truth for this field?
7. What does a timeout mean if the write may already have committed?
8. Which operations need an atomic invariant? Where is it enforced?
9. Which reads can be stale, and for how long?
10. How do deletes propagate through caches, replicas, indexes, logs, and backups?

### Scale and failure

11. What saturates first: CPU, disk, network, connection pool, partition, or downstream quota?
12. Which retries are safe? How do you prevent a retry storm?
13. What happens when the queue falls behind or a poison message repeats?
14. Can the system serve a useful degraded response if search, ranking, or recommendations fail?
15. How do you restore state after a region loss? What are the RPO/RTO?

### Operations and evolution

16. What SLI tells you users are affected? What signal is only a supporting metric?
17. How do you roll out a new schema while old and new application versions coexist?
18. What is the rollback path after data has been backfilled or dual-written?
19. Which component would you remove if the product could tolerate a simpler design?
20. What assumption would make you choose a different architecture?

## Practice like an interview

For any prompt, use a 45-minute outline:

```text
00–05  Clarify users, core behavior, scope, and constraints
05–10  Rank quality goals; estimate load, storage, and skew
10–15  Define APIs, entities, invariants, and consistency
15–28  Draw the simplest end-to-end architecture and main flows
28–40  Deep dive into the hardest bottleneck or correctness risk
40–45  Failure behavior, trade-offs, observability, and recap
```

Use the [design-review template](templates/design-review.md), then self-review against [the interview lesson](lessons/09-design-interview.md). For each prompt, change one assumption (freshness, peak load, region count, retention, or consistency) and explain exactly which decisions change.

## Sources and attribution notes

The catalog is synthesized from publicly accessible system-design preparation resources, practitioner walkthroughs, and community/candidate-submitted interview reports. They are not official employer statements and may become stale.

- [Hello Interview — public preparation question list](https://www.hellointerview.com/learn/system-design/in-a-hurry/how-to-prepare)
- [Hello Interview — Google Docs-style collaborative editor](https://www.hellointerview.com/learn/system-design/problem-breakdowns/google-docs)
- [Hello Interview — Facebook News Feed](https://www.hellointerview.com/learn/system-design/problem-breakdowns/fb-news-feed)
- [Hello Interview — ride-sharing system](https://www.hellointerview.com/learn/system-design/problem-breakdowns/uber)
- [Hello Interview — web crawler](https://www.hellointerview.com/learn/system-design/problem-breakdowns/web-crawler)
- [Hello Interview community — Amazon Lockers](https://www.hellointerview.com/community/questions/amazon-lockers-delivery/cm5rze52100022z6nrynwzuc7)
- [Hello Interview community — Dropbox-style file sync](https://www.hellointerview.com/community/questions/file-storage-sync/cm4t118ah004dw579eefogdzx)
- [System Design Primer — common questions and references](https://github.com/donnemartin/system-design-primer)
- [Exponent — system design interview preparation guide](https://www.tryexponent.com/blog/system-design-interview-guide)
- [Interview Experiences — user-submitted Uber broker interview report](https://interviewexperiences.in/experience/uber/uber-system-design-round-l5-design-kafka)

Last reviewed: 2026-10. Community reports are anecdotal; employer hiring loops and questions can change without notice.
