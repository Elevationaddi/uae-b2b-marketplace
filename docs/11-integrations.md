# Integrations and background jobs
Provider adapters must expose typed interfaces; never embed credentials in frontend. Mock providers only in local/test, explicit environment guard. Select and verify production provider documentation during implementation; no API SDK method names assumed here.

| Adapter | Contract | Failure handling |
|---|---|---|
| Marketplace PSP | onboardSeller, createCheckout, queryPayment, cancelSession, requestRefund, queryPayout, verifyWebhook; stable keys and normalized results | signed webhooks, durable inbox, reconciliation; uncertain outcome pending, never fake success |
| Storage | presignUpload, scan, authorizedDownload, deleteExpired | quarantine until clean; retry transient; lifecycle cleanup |
| Email | send(template, locale, recipient, variables, idempotencyKey) | outbox retries, delivery status, bounce handling |
| SMS/push | optional later, consent and device registration | in-app fallback |
| Shipping | MVP manual tracking and proof; carrier adapter later | manual update with actor/time audit, no fabricated tracking |
| Verification | MVP manual admin; provider later | needs-info review; no inferred verification |

Outbox events created in same transaction as business mutation. Worker claims jobs using lease/row lock, exponential retry with jitter, bounded attempts, dead-letter queue and alert; idempotent consumers. Webhook unique provider event ID; durable receipt before 2xx. Scheduled jobs: reservation expiry every minute (query PSP first), RFQ/quote expiry every minute, licence expiry daily, payout reconciliation daily, upload cleanup daily, export cleanup daily. Timings proposed operational defaults; tune after load testing. Monitor queue age, failed webhooks, unmatched payments, stuck reservations.

| Event | Recipients | Channel |
|---|---|---|
| Verification submitted/decided/renewal | owner, compliance queue | in-app/email |
| RFQ invite or eligible match | seller sales/owner | in-app; email preference |
| Quote submitted/revised/accepted/expired | buyer procurement/owner and affected seller | in-app/email |
| Payment pending/confirmed/failed | buyer; seller only confirmed order | in-app/email |
| Order dispatched/delivered/completed/delayed | parties | in-app/email |
| Dispute opened/evidence/resolution | parties, assigned support | in-app/email |
| Refund/payout confirmed or failed | relevant finance/owner | in-app/email |
| New message | authorized participants except sender | in-app; email preference |
| Low stock | warehouse/owner | in-app |

Critical transactional notices cannot be opted out from in-app; marketing opt-in and unsubscribe separate. Templates localized, no sensitive files/details in email, deep links require authentication. Deduplicate by event/recipient/channel; no repeated emails on webhook replay.
