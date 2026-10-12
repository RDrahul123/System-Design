# Case study · Design a payment and ledger service

[← Case studies](README.md) · [Question bank](../INTERVIEW_QUESTION_BANK.md) · [Course home](../README.md)

Design a service that accepts a payment request, sends it to a payment provider, records money movement, and reports the final state. The important design principle: **provider status, API response, and ledger truth are related but distinct states**.

## 1. Requirements and invariants

Scope: create payment intent, authorize/capture (or charge), process asynchronous provider notifications, issue refunds, and expose status. Exclude card-network internals and detailed fraud models, but include a fraud/risk decision boundary.

Invariants:

1. One logical client request must not create duplicate charges on retry.
2. Every posted ledger transaction balances debits and credits per currency.
3. Ledger entries are append-only; corrections are compensating entries, not edits.
4. A provider timeout is an **unknown outcome**, not proof of failure.
5. Amounts use integer minor units or exact decimals—never binary floating-point arithmetic.

## 2. Request and storage model

```text
Payment(payment_id, merchant_id, idempotency_key, amount_minor, currency,
        state, provider_ref, created_at, version)
LedgerTransaction(ledger_tx_id, payment_id, type, state, created_at)
LedgerEntry(ledger_tx_id, account_id, direction, amount_minor, currency)
ProviderEvent(provider, provider_event_id, received_at, processed_at)
```

Enforce uniqueness on `(merchant_id, idempotency_key)` and provider event ID. Bind the idempotency key to a canonical request hash; if the key is reused with a different amount or currency, return a conflict. Store only payment data needed for the workflow and tokenize/minimize sensitive payment credentials.

## 3. Payment flow

```mermaid
sequenceDiagram
    participant M as Merchant client
    participant A as Payment API
    participant D as Payment DB + ledger
    participant R as Risk service
    participant P as Provider
    participant Q as Outbox / event stream
    M->>A: Create payment + idempotency key
    A->>D: Claim key, persist PENDING state
    A->>R: Evaluate bounded risk inputs
    R-->>A: Approve / review / reject
    A->>P: Authorize or charge using stable provider key
    alt Provider response received
      P-->>A: Approved / declined + provider reference
      A->>D: Record outcome + balanced ledger entries + outbox
      A-->>M: Current payment state
    else Network timeout
      A->>D: Record outcome UNKNOWN
      A-->>M: Pending / processing; do not claim failure
    end
    P-->>Q: Signed webhook event (possibly duplicate / out of order)
    Q->>D: Deduplicate event and reconcile state
```

Persist the operation before calling the provider so a process crash is recoverable. The provider call is not in the local database transaction. If the service crashes after provider approval but before recording it, retry/query using the same provider idempotency key or reconcile through a signed webhook/API lookup.

## 4. Ledger accounting

For a simple card purchase of 25.00 in USD, a ledger might record:

```text
At capture:
  Debit  processor_receivable   2,500 USD minor units
  Credit merchant_payable      2,500 USD minor units

At refund:
  Debit  merchant_payable      2,500 USD minor units
  Credit processor_receivable  2,500 USD minor units
```

The exact accounts depend on fees, settlement, reserves, and accounting policy. The invariant is that each posted transaction balances. Pending authorizations, captures, settlements, disputes, and refunds should be distinct event/state transitions. Corrections append reversing or compensating entries so the audit trail remains reconstructable.

## 5. Webhooks, idempotency, and ordering

Verify provider webhook signatures over the raw request body, enforce timestamp/replay policy, persist the provider event ID, and process idempotently. Webhooks can be repeated, delayed, or delivered out of order. Use provider object version/sequence where available and validate legal payment-state transitions. Do not let an old “authorized” event overwrite a later “refunded” state.

Webhook acknowledgement should follow durable receipt, then asynchronous processing can retry. Keep a provider-event inbox and a reconciliation job that periodically compares internal pending/unknown payments with provider status.

## 6. Security and compliance boundary

Use hosted/tokenized payment details where possible so the platform does not handle raw card data. Isolate credentials, rotate provider secrets, encrypt data, restrict operator access, and keep PAN/CVV/secrets out of logs and analytics. A risk service receives only the minimum necessary fields. Apply rate limits by merchant/account and protect idempotency records from cross-tenant access.

## 7. Failure policy and operations

| Condition | Customer/API behavior | Recovery |
|---|---|---|
| Provider decline | Return terminal decline where known | No retry unless policy/provider says transient |
| Provider timeout | Return `PROCESSING` / `UNKNOWN` | Query by provider key; await webhook; reconcile |
| Duplicate client request | Return original payment/result | Unique idempotency key and request hash |
| Duplicate webhook | Acknowledge without double-posting | Provider event inbox uniqueness |
| Ledger write failure after approval | Do not lose provider outcome | Durable payment state/outbox retry and reconciliation |
| Refund partially fails | Keep explicit refund-pending state | Retry idempotently; alert on aged pending refunds |

Metrics: authorization/capture success by provider and merchant tier, unknown-outcome age, webhook lag, duplicate rate, reconciliation mismatches, ledger balance violations, refund age, provider latency/quota, and chargeback/dispute rate. Alert on correctness and money movement, not only HTTP uptime.

## 8. Interview follow-ups

1. The client timed out after the card was charged. What response should a retry receive?
2. How does the design guarantee ledger entries balance under concurrent updates?
3. What if a refund webhook arrives before the capture webhook?
4. How do you migrate idempotency-key retention without allowing an old retry to double-charge?
5. Which reports are derived from ledger truth, and how are they rebuilt?

**Key lesson:** payments combine an externally controlled side effect with an internally auditable ledger. Model unknown outcomes and reconciliation as first-class paths.
