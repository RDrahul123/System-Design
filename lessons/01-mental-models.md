# 01 · System design mental models

[← Course home](../README.md) · [Previous: Orientation](00-course-orientation.md) · [Next: Requirements & estimates →](02-requirements-and-estimates.md)

## 1. Start with a boundary

Every design has a **system boundary**: what this team owns, what it calls, and what it assumes about external systems. Drawing the boundary prevents accidental promises about a payment provider, identity service, or mobile network that the system cannot control.

An architecture is also a graph. Nodes represent responsibilities or state; edges represent communication. Every edge costs something: time, capacity, and a chance of failure. Combining boxes can reduce network boundaries; splitting boxes can enable independent ownership and scaling, but introduces remote-call and operations costs.

## 2. Find the bottleneck, not a fashionable component

For a serial request path, response time is approximately the sum of its component and network times. Under parallel work, it is closer to the slowest branch plus coordination and merge time. Throughput is constrained by the narrowest resource on the critical path.

Little’s Law is a useful steady-state relation:

> **L = λ × W**
>
> average work in the system = arrival rate × average time in the system

If a service receives 200 requests/second and average residence time is 0.25 seconds, Little’s Law predicts about 50 requests in flight at steady state. This is not a capacity guarantee: bursts, queueing, and changing latency can raise concurrency quickly.

## 3. Coupling and cohesion

High cohesion means a component’s responsibilities belong together. Low coupling means changes or failures in one component do not unnecessarily propagate to another. These are goals, not binary properties. A synchronous chain of eight “independent” services is still tightly coupled at runtime if one request needs all eight to succeed.

```mermaid
flowchart LR
    subgraph TightlyCoupled[Long synchronous dependency chain]
      C[Client] --> A[API] --> P[Profile] --> R[Recommendations] --> X[External service]
    end
    subgraph LooserRuntimeCoupling[Asynchronous side effect]
      C2[Client] --> A2[API] --> DB[(Committed state)]
      DB -. outbox event .-> Q[Queue]
      Q --> W[Worker]
    end
```

Async decoupling changes the user-visible contract: the request can complete before the side effect. It is only correct if the product accepts eventual completion and the workflow has a way to track and retry it.

## 4. Trade-offs are conditional

Architecture decisions exchange one property for another. “X is better than Y” is incomplete without workload and requirements.

| Choice | Helps with | Costs or risks |
|---|---|---|
| Cache | Repeated reads and latency | Stale values, invalidation, memory, stampedes |
| Replica | Read capacity and regional proximity | Replication lag, failover complexity |
| Partitioning | Data volume and write capacity | Cross-partition queries and rebalancing |
| Queue | Burst smoothing and failure isolation | Delayed completion, duplicates, backlog |
| More services | Independent ownership or scaling | Network calls, deployments, observability burden |

## 5. Optimize the whole user journey

Local improvements can make a system worse end-to-end. A faster cache lookup does not help if a slow downstream dependency dominates. A high availability percentage for each component does not guarantee the whole request path meets its goal. Begin with the critical user action and include every dependency in its path.

### Knowledge check

1. What does Little’s Law estimate, and what assumptions make the estimate useful?
2. Why can splitting one process into more services increase latency and failure modes?
3. Give one requirement that would justify accepting stale cached data.

<details><summary>Suggested answers</summary>

1. Average in-flight work from arrival rate and average time, under a stable/steady-state workload.
2. Calls cross networks and deployment boundaries; each adds latency, timeout, capacity, and failure considerations.
3. A profile picture or public catalog description may tolerate short staleness; an account balance usually needs stronger guarantees.

</details>

[Continue to Lesson 02 →](02-requirements-and-estimates.md)
