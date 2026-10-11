# Practice labs and capstone

[← Course home](../README.md)

These exercises are deliberately open-ended. Write assumptions before choosing components. A good submission explains correctness and failure behavior as clearly as the happy path.

## Progressive labs

| Lab | Prompt | Deliverable |
|---|---|---|
| 1 · Scope a product | Design a paste-sharing service. Ask 8 clarifying questions and state scope. | One-page requirements table |
| 2 · Estimate | Estimate daily writes, peak reads, and 1-year storage for a photo library. State assumptions and sensitivity. | Workload worksheet with units |
| 3 · API and invariants | Design a reservation API that prevents duplicate booking after client retries. | API contract, state model, retry flow |
| 4 · Find the bottleneck | A service has low average CPU but p99 latency spikes during a campaign. List evidence to collect before changing architecture. | Diagnostic decision tree |
| 5 · Failure walk | Trace behavior if database commits but event publish times out. | Sequence diagram with recovery |
| 6 · Evolve a design | Take the URL shortener and add custom domains, deletion, and regional failover. | Updated diagram and trade-off log |
| 7 · Select storage | Model a photo product with metadata, originals, thumbnails, search, and analytics. Pick the source of truth and derived stores. | Data-flow diagram, access-pattern table, deletion path |
| 8 · Design the edge | Trace a private media download through DNS, CDN, authorization, and object storage. | Request sequence with cache-key and expiry rules |
| 9 · Migrate without downtime | Rename a heavily used database field while old and new application versions run simultaneously. | Expand–migrate–contract rollout and rollback plan |
| 10 · Recover from a regional outage | One region is unavailable while writes are in flight. Define failover, user behavior, and failback. | RPO/RTO, authority diagram, game-day checklist |

## Capstone: design a collaborative document service

Design a service where multiple users can edit documents, share access, and recover prior versions. Do not assume a particular conflict-resolution algorithm: first define collaboration behavior and constraints.

### Submission checklist

- [ ] Scope, users, primary workflows, and exclusions
- [ ] Functional requirements and ranked quality attributes
- [ ] Traffic, storage, burst, and geographic assumptions
- [ ] API contracts and authorization boundaries
- [ ] Data model, source of truth, and invariants
- [ ] High-level architecture and at least one request sequence
- [ ] Concurrent edit/conflict strategy with explicit semantics
- [ ] Retry, duplicate, offline, and reconnect behavior
- [ ] Availability, backup, restore, RPO, and RTO
- [ ] Security/privacy and data retention considerations
- [ ] Observability: SLI, alert, and capacity signal
- [ ] Two trade-offs and one alternative design
- [ ] Migration or rollout plan for one major change
- [ ] Storage selection justified by access patterns and lifecycle
- [ ] Network boundaries, connection budgets, and edge cache behavior
- [ ] Failure-domain assumptions and a rehearsable recovery sequence
- [ ] Cost and operational ownership for each major component

## Suggested capstone review questions

1. What does a user see when two collaborators edit while offline?
2. How are permissions enforced when content is cached or replicated?
3. Which version is authoritative after a reconnect or region failover?
4. Can a document be restored without restoring unrelated account data?
5. What changes if a document grows to hundreds of megabytes?
6. What is the source of truth for edits, search results, and version history?
7. How do schema migration and live application rollout remain compatible?
8. How does a client discover a region failover without losing or duplicating edits?

Use the [design review template](../templates/design-review.md) as your starting document. Share diagrams and assumptions in a pull request if you want feedback from course contributors.
