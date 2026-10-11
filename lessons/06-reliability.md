# 06 · Reliability and fault tolerance

[← Course home](../README.md) · [Previous](05-distributed-systems.md) · [Next →](07-queues-and-events.md)

## 1. Define the promise

**Availability** asks whether a service is usable when needed. **Reliability** includes correct behavior over time. **Durability** asks whether acknowledged data survives failures. These are related, not interchangeable.

An SLI is a measured indicator; an SLO is the target for that indicator; an SLA is an external commitment with consequences. Example SLI: successful eligible requests / total eligible requests. An availability target of 99.9% over 30 days allows roughly 43 minutes of error budget (30 × 24 × 60 × 0.001). Define how planned maintenance, client errors, and dependencies are counted.

## 2. Fail in bounded ways

```mermaid
flowchart TD
    R[Request] --> T[Set deadline / timeout]
    T --> C{Dependency response?}
    C -->|Yes| OK[Return result]
    C -->|No| B{Safe fallback exists?}
    B -->|Yes| F[Degraded response]
    B -->|No| E[Fail clearly and quickly]
    T -. limited retry with backoff + jitter .-> C
```

Retries can amplify an outage. Retry only transient failures, bound attempts, use exponential backoff with jitter, and stay within the end-to-end deadline. Avoid retrying at every layer: three attempts at three layers can create 27 downstream calls for one user action.

## 3. Isolation and graceful degradation

Bulkheads isolate resource pools so one slow dependency cannot consume all workers. Circuit breakers temporarily stop calls likely to fail, then probe recovery. Rate limits protect capacity and fairness. These mechanisms need observable state and carefully chosen thresholds; a breaker that never resets creates an outage of its own.

Graceful degradation preserves the most valuable behavior. A storefront may show cached catalog data while recommendations are unavailable, but must not claim a payment succeeded when it did not. Decide which features can be stale, omitted, or queued before an incident.

## 4. Backups, recovery, and deployment

Reliability includes restore, not just redundancy. Document backup frequency, retention, encryption, restore validation, and recovery-point objective (RPO: tolerable data loss) / recovery-time objective (RTO: tolerable downtime). A backup that has never been restored is an assumption.

Use health-gated and gradual deployments where possible. Canary or blue/green rollout reduces blast radius but requires compatibility across versions. Database migrations should be reversible or forward-recoverable. Define rollback triggers from user-facing metrics, not only process health.

## 5. Failure analysis table

| Failure | User impact | Detection | Mitigation / recovery |
|---|---|---|---|
| App instance exits | Some requests fail | Error rate, health check | Remove instance, replace, inspect crash |
| Primary database unavailable | Reads/writes may fail | Dependency probes, SLO burn | Failover if safe; preserve writes; recover |
| Queue consumer stops | Work delayed | Oldest-message age | Restore consumers, control backlog, replay |
| Bad deployment | Broad incorrect behavior | SLOs, canary comparison | Stop rollout, rollback or forward-fix |
| Region loss | Regional users impacted | Synthetic probes | Fail over with data-loss / consistency policy |

### 5.1 Error budgets turn objectives into decisions

For an SLO with a 30-day window, 99.9% success permits 0.1% eligible failures. If there are 10 million eligible requests, that is approximately 10,000 failed requests. This request-based budget is not necessarily equal to a minutes-based downtime budget: a partial regional failure can affect only a fraction of requests.

An error budget helps decide whether to ship a risky release, slow feature work, or invest in reliability. It is meaningful only when the SLI has a stable denominator, excludes only justified traffic, and reflects user-visible behavior. Alert on fast burn (a small outage consuming budget rapidly) and slow burn (persistent degradation) with different urgency.

### 5.2 Dependency budgets and deadlines

Pass one end-to-end deadline downstream, reducing the remaining budget as work proceeds. If an API has 500 ms total and authentication consumed 90 ms, a later search call cannot reasonably receive a fresh 500 ms timeout. Reserve time for serialization and response delivery. Cancel work when the caller’s deadline is already expired so abandoned requests do not consume capacity.

```mermaid
flowchart LR
    A[Request deadline: 500 ms] -->|remaining 410 ms| B[Profile lookup]
    B -->|remaining 280 ms| C[Search dependency]
    C -->|remaining 70 ms| D[Assemble response]
    D --> E[Return before deadline]
```

Timeouts should be based on measured latency distributions and network scope. Too-short timeouts create retries and duplicate load; too-long timeouts tie up threads/connections while users wait.

### 5.3 Circuit breaker lifecycle

```mermaid
stateDiagram-v2
    [*] --> Closed
    Closed --> Open: failure threshold reached
    Open --> HalfOpen: cool-down expires
    HalfOpen --> Closed: probe succeeds
    HalfOpen --> Open: probe fails
```

Closed allows traffic and counts failures; open fails fast or uses a fallback; half-open permits a small probe sample. The breaker should be scoped to a dependency and failure domain, expose state transitions, and avoid treating expected business errors as infrastructure failures. It is a load-protection mechanism—not a substitute for fixing an unhealthy dependency.

### 5.4 Redundancy, failure domains, and independence

Two copies in one rack may share power, network, credentials, or a bad deployment. Redundancy helps only when failure modes are sufficiently independent and failover is tested. Active-active regions reduce some recovery time but introduce cross-region conflict, data transfer, capacity reservation, and split-brain risks. Active-passive is simpler only if the passive site is kept current and can handle production load.

### 5.5 Recovery runbook as part of the design

For each critical dependency, document detection, who owns the decision, safe degraded behavior, how to stop new work, how to recover backlog, and how to validate correctness after recovery. Practice restoring backups and failing over in a controlled game day. Measure actual RPO/RTO; a diagram alone cannot prove them.

### Knowledge check

1. If a service’s SLO error budget is exhausted, what should change in engineering priorities?
2. Why can retries worsen a dependency outage?
3. Define RPO and RTO in your own words.

<details><summary>Suggested answers</summary>

1. Prioritize reliability work and reduce risky changes until the service is back within its reliability target.
2. Retries add traffic to an already saturated dependency and can multiply load across layers.
3. RPO is how much recent data loss is tolerable; RTO is how long recovery may take.

</details>

[Continue to Lesson 07 →](07-queues-and-events.md)
