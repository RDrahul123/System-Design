# Case study · Design a news feed

[← Case studies](README.md) · [Course home](../README.md)

## 1. Scope and requirements

Users publish posts, follow accounts, and retrieve a ranked feed. Assume a typical reader values a fresh feed within a few seconds; exact global ordering is unnecessary. Privacy and block relationships must be enforced. Exclude ads and recommendation model training from the initial design.

The workload is read-heavy. A few accounts may have millions of followers, while most have a small audience. A uniform fan-out strategy will be inefficient at one end of this distribution.

## 2. Core entities and API

```text
Post(post_id, author_id, created_at, visibility, content_ref)
Follow(follower_id, followed_id)
FeedEntry(viewer_id, post_id, author_id, created_at, rank_features...)
```

`GET /v1/feed?cursor=...` returns a bounded page in a stable cursor order. `POST /v1/posts` commits the canonical post, then triggers feed distribution. Visibility checks must remain authoritative even when a feed entry is precomputed.

## 3. Hybrid fan-out

**Fan-out on write:** when a post is created, insert an entry into each follower’s feed. Reads are fast, but publishing by a celebrity creates huge write amplification. **Fan-out on read:** fetch recent posts from followed authors at read time. Writes are cheap, but reads grow with follow count and may be slow. A hybrid approach uses write fan-out for ordinary accounts and read-time merge for very high-follower accounts.

```mermaid
flowchart TD
    P[Post created] --> O[Outbox event]
    O --> W[Fan-out worker]
    W --> C{Author follower count?}
    C -->|ordinary| F[Write post ID to follower feed lists]
    C -->|very high| H[Mark author for read-time merge]
    R[Reader requests feed] --> L[Load precomputed candidates]
    R --> M[Fetch recent high-follower posts]
    L --> X[Merge, filter visibility, rank]
    M --> X
    X --> PG[Paginate and return]
```

## 4. Ranking, pagination, and privacy

Treat candidate retrieval, filtering, ranking, and pagination as separate steps. Cursor must represent the relevant stable position; offsets can skip or repeat entries as new posts arrive. Ranking may be approximate or personalized, but moderation, blocks, and privacy are hard constraints—not soft ranking features. Re-check access when serving if authorization can change after feed materialization.

## 5. Backpressure and repair

A celebrity post can create a very large distribution job. Chunk work, rate-limit per author, track event progress, and prioritize interactive reads over background fan-out. Feed entries are derived data; rebuild/replay from canonical posts and follow relationships when feasible. Deduplicate on `(viewer_id, post_id)` so replay is safe. Monitor oldest pending event age and distribution lag.

## 6. Trade-offs and failure behavior

- Queue lag increases freshness delay; return the available feed and report/measure lag rather than blocking all reads.
- A stale follow graph can expose or omit items; decide whether it is acceptable and how changes invalidate derived entries.
- If ranking is unavailable, fall back to a deterministic chronological ordering.
- If precomputed feeds are missing, serve a bounded fallback query rather than an unbounded scan.
- Do not rely on a feed entry as proof of authorization.

## 7. Size fan-out before selecting a strategy

Assume 20 million posts/day. At 5,000 recipients per average post, naïve push fan-out creates 100 billion feed-entry writes/day, even though the post itself was written once. At 500 bytes per materialized entry, that is 50 TB/day of logical entry data before indexes/replication—clearly not a universal choice. Real distributions are skewed: many authors have small audiences and a few have enormous ones.

This estimate motivates a hybrid strategy and bounded feed history. It does not prove that all entries should be precomputed. The product may serve a candidate window (e.g., recent days) and fall back to author timelines for older history.

```text
Author follower count distribution (illustrative)
small authors       ████████████████████████  most authors
medium authors      █████                     fewer
very large authors  █                         rare, disproportionate fan-out cost
```

## 8. Read path: candidates, policy, ranking, page

```mermaid
sequenceDiagram
    participant U as Reader
    participant F as Feed API
    participant C as Candidate stores
    participant G as Graph / policy
    participant R as Ranker
    participant D as Posts / media metadata
    U->>F: GET feed with cursor
    F->>C: Load precomputed entries + recent high-follower posts
    C-->>F: Candidate post IDs and ordering hints
    F->>G: Filter blocks, unfollows, visibility, deletions
    G-->>F: Eligible candidates
    F->>R: Rank bounded candidate set
    R-->>F: Ordered candidates + ranking version
    F->>D: Hydrate selected page
    D-->>F: Post data and safe media references
    F-->>U: Items + opaque continuation cursor
```

Bound every stage. Do not fetch and hydrate thousands of candidates for a page of 20. Apply cheap eligibility filters early where they are trustworthy, then enforce authoritative privacy rules before response. If ranking fails, a deterministic chronological fallback can preserve basic utility.

## 9. Cursor semantics and duplicate removal

A cursor can contain a ranking snapshot/version, last sort key, and tie-breaker, signed so clients cannot alter it. Ranking models may change between page requests; decide whether the cursor freezes one ranking version or tolerates items moving. Deduplicate on post ID after merging precomputed and on-read candidates. If an item is removed between page loads, skip it and continue scanning a bounded number of candidates rather than returning an empty page prematurely.

## 10. Freshness and fan-out lag

Use the event’s durable creation time and consumer progress to estimate lag. The interface can display a newly authored post immediately to its author while follower feeds converge asynchronously. Define a target such as “95% of ordinary-author posts appear in followers’ feeds within 5 seconds.” This is measurable; “near real-time” alone is not.

Consider prioritizing delivery by relationship/activity, but guard against starvation of less active users. A backlog drain can overload downstream feed stores; ramp consumers gradually and measure per-shard write pressure.

## 11. Privacy changes are not ordinary ranking updates

If a user changes a post from public to private, a stale feed entry must not leak its body or media. Materialized feed rows should contain references and limited non-sensitive metadata; access checks at serve time should use current visibility. CDN media URLs must follow the same policy. Deletion requires tombstones or a denylist/version check so replaying an old post event cannot resurrect the content.

### Design review

1. At what follower threshold should an author switch strategies? What cost do you compare?
2. How do you prevent duplicate feed rows after event replay?
3. What does a cursor contain if ranking order changes over time?
4. How do deletes/moderation propagate through derived feeds?

<details><summary>Possible answers</summary>

Measure fan-out write cost against read-time merge cost; deduplicate by viewer and post; use a stable snapshot/version or define pagination semantics across ranking changes; tombstone or filter at serving time and asynchronously clean derived entries.

</details>
