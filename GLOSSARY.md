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
| **Backoff with jitter** | Increasing retry delay with random variation between clients | A fixed synchronized retry interval reduces load |
| **Cache-aside** | Application checks cache, reads origin on miss, then populates cache | TTL by itself guarantees correctness |
| **Circuit breaker** | Stops calls to a repeatedly failing dependency temporarily | It repairs the dependency or guarantees recovery |
| **DNS TTL** | Duration resolvers may cache a DNS answer | A failover change reaches all clients instantly |
| **Fencing token** | Monotonically increasing token that rejects writes from an obsolete owner | A timeout alone proves the old leader is dead |
| **Hot partition** | Partition receiving disproportionate work due to key skew | Adding partitions automatically redistributes one hot key |
| **Idempotency key** | Stable identifier used to recognize retries of one logical operation | It should be reused for different request bodies |
| **Linearizability** | Reads/writes appear to occur in one real-time-respecting order within a defined scope | Every database operation needs global linearizability |
| **Modular monolith** | One deployable application with explicit internal module boundaries | A monolith must be an unstructured codebase |
| **Object storage** | Service for large blob/file objects addressed by keys and metadata | It offers relational transactions and joins over file contents |
| **Quorum** | Configured subset of replicas whose responses satisfy an operation rule | Any majority guarantees every desired consistency property |
| **Tombstone** | Marker that records deletion so delayed replicas/events do not resurrect data | Removing one primary row deletes every copy immediately |
| **Write amplification** | Physical writes caused by one logical write (indexes, replicas, projections) | API write count equals storage write work |
| **Candidate generation** | First-stage retrieval that creates a bounded set for later ranking | One ranking model should scan the entire corpus on every request |
| **Double-entry ledger** | Accounting representation where debits and credits balance for each posted transaction | Editing a past entry is the normal way to correct a payment |
| **Event time** | Time a domain event happened, as distinct from processing/arrival time | Message arrival order is necessarily business order |
| **Inverted index** | Search structure mapping terms to the documents/fields that contain them | It is automatically current or authoritative for permissions |
| **Late event** | Event that arrives after its event-time window or expected processing point | It must be silently discarded |
| **Watermark** | Progress estimate that a stream processor uses to decide how complete an event-time window is | Proof that no future event for that window can arrive |
| **Unit economics** | Cost and value measured per useful business/user outcome | Minimizing one infrastructure bill always lowers total cost |
