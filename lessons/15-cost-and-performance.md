# 15 · Cost, capacity planning, and performance

[← Course home](../README.md) · [Previous: Data pipelines](14-data-pipelines.md) · [Case studies →](../case-studies/README.md)

Performance is not a single number, and capacity is not simply “how many servers.” A useful plan relates workload to constrained resources, protects the user-facing latency objective, and explains the cost of delivering one successful operation.

## 1. Build a resource model

For every major operation, count:

- requests/second by average, peak, burst duration, and region;
- bytes in and out, payload distribution, and compression;
- database reads/writes, index maintenance, and transaction duration;
- fan-out work per action and background backlog;
- connections, concurrent requests, and downstream quotas;
- retention, replicas, backups, indexes, and derived data.

One logical API call may perform 10 cache/database operations or fan out to 100,000 recipients. Track physical work per user action as well as API RPS.

## 2. Latency budget and tail behavior

The end-to-end target must include client-to-edge network time, gateway, application processing, dependencies, queueing, serialization, and response transfer. If a route has a 400 ms p99 objective, allocate a budget to each serial dependency and leave slack for variation. Parallel branches are bounded by the slowest required branch plus merge work.

```text
Client / edge network       90 ms
Gateway + authentication    35 ms
Application compute         55 ms
Database / search            125 ms
Serialization + slack         95 ms
                            -------
End-to-end p99 budget        400 ms
```

These are planning allocations, not promises that percentiles add exactly: component tails can be correlated and their measurement windows differ. Trace the critical path, then load-test realistic distributions. For a fan-out request that waits for all 20 dependencies, the tail probability is worse than that of one dependency; reduce required fan-out or make optional branches degradable.

## 3. Capacity headroom and queueing

A service with arrival rate λ and service rate μ is stable only when long-run capacity exceeds arrivals. As utilization approaches 100%, small bursts and slow requests produce long queues and sharply rising latency. Capacity headroom is the ability to absorb peaks, maintenance, and instance loss; choose it from a risk and cost target, not a universal percentage.

Little’s Law helps estimate concurrency at steady state:

> **In-flight work L = arrival rate λ × average time W**

At 2,000 requests/s and 150 ms average residence time, expect about 300 requests in flight. If dependency latency suddenly rises to 1.5 s, the same traffic implies about 3,000 in flight—often enough to exhaust worker pools and connections. Deadlines, concurrency limits, and load shedding bound this pressure.

## 4. Load testing that resembles production

1. Use representative payload size, query distribution, tenant skew, cache warmth, and geographic mix.
2. Include ramp-up, peak, sustained plateau, and recovery; a short maximum-RPS burst alone misses memory leaks and queue growth.
3. Measure p50/p95/p99, error rate, resource saturation, pool wait, backlog age, and downstream impact.
4. Test cold caches, one failed dependency, degraded regions, and rolling deployments.
5. Repeat with realistic retries and client timeouts; retry loops can multiply the offered load.
6. Compare the bottleneck before and after optimization. A faster app tier is not a win if the database becomes overloaded.

Open-loop load tests schedule arrivals independently of response time and reveal overload more honestly. Closed-loop clients wait for each response before issuing more work and can hide queueing by reducing offered load as the system slows.

## 5. Capacity worksheet example

Assume 12,000 peak API requests/s. Each read averages 20 ms CPU, 40 KB response, and 1.3 database reads. At a 70/30 read/write split:

```text
Peak reads/s               = 12,000 × 0.70 = 8,400
Peak writes/s              = 12,000 × 0.30 = 3,600
Database read ops/s        ≈ 8,400 × 1.3 = 10,920
Outbound application bytes ≈ 8,400 × 40 KB = 336 MB/s
CPU core-seconds/s (reads) = 8,400 × 0.020 = 168 cores at 100% utilization
```

Provisioning at 100% utilization is unsafe; add measured headroom, account for writes/background work, and validate the real service time. If compression reduces average response to 18 KB, network demand drops substantially—but compression consumes CPU, so benchmark end-to-end. Averages hide a large payload tail; size for the distribution and enforce maximum response sizes.

## 6. Cost per useful outcome

Model monthly cost by major driver:

| Driver | Example unit | Optimization lever |
|---|---|---|
| Compute | core-seconds / GPU-seconds | Remove duplicate work, batch, choose suitable instance/profile |
| Storage | GB-month × replicas/versions | Retention, tiering, compression, compact indexes |
| Network | egress bytes / cross-region traffic | CDN/cache, smaller payloads, locality, fewer copies |
| Requests | DB writes, queue messages, external API calls | Coalesce, batch, reduce fan-out, use idempotent retries |
| Operations | On-call load and manual recovery | Reduce component count, automate restore, improve runbooks |

Prefer **cost per successful user task** to cost per server-hour. A cheaper component that causes more retries or manual repair can increase total cost. Model fixed cost and variable cost separately, and identify the threshold where a different design becomes economically worthwhile.

## 7. Optimization order

```text
Measure → Find dominant contributor → Reduce unnecessary work → Re-test correctness
   ↓               ↓                         ↓                         ↓
profile       CPU / I/O / network       query / bytes / fan-out     SLO + invariants
```

Common high-leverage changes: fix an N+1 query, add the right index, bound response fields, remove redundant serialization, batch safe writes, cache genuinely reusable public data, or avoid recomputing a derived value. Do not start with a language rewrite or a distributed cache before identifying the bottleneck.

## 8. Scale planning and failover reserve

Plan normal peak and degraded peak separately. If three regions normally serve 33% each but one region fails, the remaining capacity must absorb redistributed demand or deliberately shed lower-priority work. A failover test should validate compute headroom, database write authority, DNS/client reconnection, secrets, external provider quotas, and data lag.

### Knowledge check

1. Why can a closed-loop benchmark understate overload?
2. How does an increase in dependency latency affect in-flight concurrency under steady arrival rate?
3. Why is cost per server-hour less useful than cost per successful user outcome?
4. Which metrics would help distinguish CPU saturation from connection-pool queueing?

<details><summary>Suggested answers</summary>

1. Clients slow their request generation when responses slow, reducing the offered load and hiding the queue that production clients may create.
2. By Little’s Law, in-flight work grows proportionally with residence time when arrival rate stays fixed.
3. It captures retries, user failures, infrastructure, and operational repair cost rather than one resource line item.
4. CPU utilization/run queue versus pool wait time, active/idle connections, acquire timeouts, and downstream latency.

</details>

## Worked example: optimize cost per successful upload

For a photo upload, count the resources consumed by a successful user outcome: API compute, metadata transactions, original and thumbnail bytes, queue work, storage retention, and delivery egress. Divide the total by completed uploads, not attempted requests; retries and failed work still consume resources and should remain visible in the numerator.

Suppose a new thumbnail format reduces stored bytes but increases encoding CPU. Estimate the trade before rollout, then measure both storage cost and encode time at representative image sizes. If encoding pushes queue age past the freshness objective, the apparent storage savings may degrade the product or require more worker capacity. A cost improvement is useful only while correctness, latency, availability, and quality remain inside their budgets.

Find the constrained resource from measurements: utilization, queue depth, saturation, and p95/p99 latency by operation. Test realistic payload sizes and burst patterns, and include warm-up, cache misses, and dependency limits. Scale headroom should reflect recovery time and failure scenarios, not an arbitrary utilization target.

**Review check:** state the cost unit, included resources, quality guardrails, measurement window, and rollback signal before recommending the optimization.

[Apply these tools in the case studies →](../case-studies/README.md)
