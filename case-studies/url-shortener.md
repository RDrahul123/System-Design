# Case study · Design a URL shortener

[← Case studies](README.md) · [Course home](../README.md)

## 1. Scope and requirements

Users submit a long URL and receive a short URL. Anyone with the short URL can be redirected. Keep link ownership, expiration, and abuse protection in scope; exclude custom analytics dashboards initially.

**Functional:** create a link, redirect, optionally expire or disable it. **Quality:** redirects are read-heavy and low-latency; mappings must not silently point to the wrong destination; malicious links must be blockable. The write response should mean the mapping is durably stored before returning the short link.

Assume 10 million new links/month, 100 redirects per link/month on average, and 10× read skew for popular links. This is roughly 3.3 writes/second and 385 reads/second on average; actual redirect distribution is highly uneven, so hot-key behavior matters more than the mean.

## 2. API and data

```http
POST /v1/links
{"url":"https://example.com/a/long/path","expires_at":null}
```

Returns `201` with a short URL after validation and durable write. Redirect: `GET /{code}`. Choose `302` if the destination may change and browser/CDN caching should be controlled; choose `301` only when permanent browser caching is intended. Exact cache semantics are part of product behavior.

```text
Link(code PK, owner_id, destination, created_at, expires_at, state)
```

Use a unique index on `code`. Consider storing a normalized URL for validation and canonical behavior, but preserve destination semantics carefully; URL normalization can change meaning in edge cases.

## 3. Baseline architecture

```mermaid
flowchart LR
    C[Browser] --> E[Edge / rate limit]
    E --> A[Link API]
    A --> D[(Mapping database)]
    C --> R[Redirect handler]
    R --> K[(Cache: code → destination)]
    K -->|miss| D
    K -->|hit| R
    R --> C
    R -. click event .-> Q[(Analytics queue)]
```

Split creation from redirect behavior logically; they need not be separate services at small scale. The redirect path checks link state/expiry, emits bounded analytics asynchronously, and returns the chosen HTTP status. Analytics should never hold the redirect response open without a product requirement.

## 4. Generate unique short codes

Options include a random token with collision check, a monotonic ID encoded in a URL-safe alphabet, or a preallocated ID range per writer. Random codes are simple but need collision handling; sequential IDs are compact but reveal creation volume and can be enumerated. A robust design can generate a random candidate, attempt an insert under a unique constraint, and retry on collision with a strict bound. Rate limit link creation and validate destinations to reduce phishing and abuse.

For alphabet size 62 and code length 7, the namespace is `62⁷ ≈ 3.5 trillion` values. Namespace size alone does not guarantee collision-free random generation; collision probability rises as issued IDs accumulate, so uniqueness must be enforced transactionally.

## 5. Scaling and failure

- Cache popular mappings with bounded TTL; invalidate or version when a link changes/disables.
- Replicate mapping data for read scale; define what redirect behavior is acceptable during lag.
- Partition by code hash for balance, while recognizing extremely popular codes can still overload cache entries.
- If cache is unavailable, fall back to the database with load shedding/rate limits so a cache outage does not overwhelm the origin.
- If analytics is unavailable, preserve redirects and buffer or drop analytics according to the stated business requirement.

### Trade-off review

| Decision | Benefit | Cost |
|---|---|---|
| Cache-aside mapping | Fast repeated popular redirects | Stale disable/expiry state until invalidation/TTL |
| Random code | Harder to enumerate | Collision retries; randomness/uniqueness management |
| Async analytics | Redirect unaffected by analytics latency | Delayed counts and queue operations |
| Redirect status policy | Control caching and destination updates | Browser/proxy semantics can persist unexpectedly |

## 6. Evolution questions

1. How would custom domains affect tenant isolation and key uniqueness?
2. How would deletion propagate through edge caches and replicas?
3. How would you defend against a single viral code saturating the cache?
4. Which metrics reveal a redirect service that is healthy on average but failing for one region?

<details><summary>One possible direction</summary>

Namespace codes by domain/tenant where required; version or actively invalidate mapping cache entries; coalesce hot-key lookups and use replicated cache reads; track redirect latency/error rate by region and cache-hit tier without unbounded user-level metric labels.

</details>

## 7. Work through the redirect hot path

The redirect path is the product’s critical path; creation is far less frequent. Keep it small and predictable:

```mermaid
sequenceDiagram
    participant B as Browser
    participant E as Edge / rate limit
    participant H as Redirect handler
    participant K as Cache
    participant D as Mapping store
    participant Q as Click-event stream
    B->>E: GET /aB92xQp
    E->>H: Forward request
    H->>K: Lookup code
    alt Cache hit and link active
      K-->>H: Destination + expiry/version
    else Cache miss
      H->>D: Lookup code
      D-->>H: Destination + expiry/version
      H->>K: Cache bounded-lifetime mapping
    end
    H-->>B: Redirect with chosen status
    H-->>Q: Enqueue click metadata asynchronously
```

Unknown, expired, disabled, and malformed codes need defined behavior. Avoid making analytics availability part of redirect availability. Do not include sensitive query parameters in click events unless they are needed and consented; strip or redact tracking secrets.

## 8. Code-space and collision math

With 62 URL-safe alphanumeric symbols and seven characters, the space is:

```text
N = 62^7 = 3,521,614,606,208 possible codes
```

If codes are uniformly random, the expected number of colliding pairs after issuing `n` codes is approximately `n(n−1)/(2N)` when `n` is much smaller than `N`. This birthday approximation shows why “the space is huge” does not remove the need for collision handling at scale. Enforce uniqueness in storage and retry a bounded number of fresh candidates. If retries are exhausted, fail creation clearly and alert; do not return an unverified code.

Sequential IDs encoded as base62 avoid random collision but reveal approximate creation order/volume and can be guessed. Random entropy reduces enumeration but does not replace rate limits, abuse checks, or authorization for link-management operations.

## 9. Consistency and cache invalidation

Suppose an owner disables a malicious link. If the redirect cache uses a 10-minute TTL, users could continue to be redirected for up to that stale window. Options include actively invalidating all relevant cache layers, versioning the mapping and checking state at a small authoritative tier, or using a short TTL. The correct choice follows the abuse-response requirement and cache-control behavior: browsers and intermediary caches can outlive the application cache.

| State change | Correctness concern | Possible mechanism |
|---|---|---|
| Link disabled | Old redirect remains available | Invalidation/version check/short TTL |
| Destination updated | Browser has cached old redirect | Temporary redirect and conservative cache headers |
| Link expires | Clock skew and delayed cleanup | Check expiry on read using trusted time; cleanup is secondary |
| Abuse report arrives | Competing disable operations | Idempotent state transition + audit record |

## 10. Operational signals

Measure redirect p50/p95/p99 by region, status code and cache-hit class; mapping-store latency and saturation; hot-key request distribution; expired/disabled link hit count; creation collision retries; and analytics queue age. Keep labels bounded—do not use the raw short code as a metric label. Sample or aggregate click analytics independently.
