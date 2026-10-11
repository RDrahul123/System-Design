# System design glossary

[← Course home](README.md)

| Term | Meaning | Common misunderstanding |
|---|---|---|
| **Availability** | Degree to which a service is usable when needed | Redundancy alone guarantees user-visible availability |
| **Backpressure** | Mechanism that slows/rejects producers when downstream capacity is limited | A queue can absorb an unlimited sustained rate mismatch |
| **Cache** | Reusable copy optimized for access speed | Cached data is automatically correct and fresh |
| **Consistency** | Rules governing when and how writes become visible to reads | One global strong/eventual switch describes every operation |
| **Durability** | Probability acknowledged data survives specified failures | Replication is equivalent to independent backup |
| **Idempotency** | Repeating an operation has the same intended effect as performing it once | A retry is safe merely because the HTTP method is `POST` or `PUT` |
| **Latency** | Time taken for an operation, often described by percentiles | Average latency captures slow-user experience |
| **Load shedding** | Deliberately rejecting lower-priority work to protect core service | Any rejected request means system design failed |
| **Partition / shard** | A subset of data assigned to a storage/compute group | Sharding is a free capacity multiplier |
| **p95 / p99** | Latency threshold met by 95% / 99% of measured requests | Percentiles can be compared without same scope and window |
| **Replica** | Copy of state maintained on another node | Replica is always current or a backup |
| **RPO** | Maximum acceptable data loss measured in time | Recovery duration |
| **RTO** | Maximum acceptable time to restore service | Data-loss tolerance |
| **SLA** | External service commitment, often with consequences | A dashboard metric or engineering target |
| **SLI** | Quantitative measure of user-facing service behavior | The same thing as the target value |
| **SLO** | Target range for an SLI over a stated window | A promise is useful without measurement rules |
| **Throughput** | Amount of work completed per unit time | More concurrency always increases throughput |
| **Timeout** | Caller’s bound on waiting for a response | Proof that remote work did not complete |
| **Backfill** | Processing historical records to populate or repair derived state | An ordinary live event consumer |
| **Fan-out** | Distributing one event/result to multiple recipients or consumers | Always best to perform synchronously |
| **Hot key** | A key receiving disproportionate traffic | Evenly balanced total traffic rules out hot spots |
| **Outbox** | Local transactional record of event intent, published asynchronously | It removes the need for consumer deduplication |
| **Tail latency** | Slow end of a latency distribution, commonly p95/p99 | It can be fixed by lowering average alone |
