# PostgreSQL logical schema
Implement via reviewed Prisma migrations. All IDs UUID, created_at/updated_at timestamptz unless immutable event (created_at only). Required unless `?`; FK deletion RESTRICT for historical data, CASCADE only ephemeral children after review. `money` = bigint integer fils >=0, serialized decimal string in JSON; `qty` = numeric(18,3) serialized string, positive except stock >=0; MVP units piece/carton require integer quantities. All status fields enums defined in workflows. Tenant-owned tables include company_id or ownership via explicit FK; verify consistency transactionally. No floating-point money. Do not store raw card/bank credentials.

| Table | Fields beyond id/timestamps | Constraints/indexes |
|---|---|---|
| users | email, password_hash?, email_verified_at?, locale, status, mfa_enabled | unique lower(email); auth provider alternative |
| sessions | user_id, token_hash, expires_at, revoked_at? | unique token_hash; user_id,expiry |
| companies | legal_name, display_name, licence_number, licence_issuer, licence_expiry, activity, emirate, trn?, status, contact_email, contact_phone | unique issuer+licence; status,expiry |
| workspaces | company_id, kind BUYER/SELLER, status | unique company+kind |
| memberships | workspace_id, user_id, role, status | unique workspace+user; user index |
| invitations | workspace_id, email, role, token_hash, expires_at, accepted_at? | unique token_hash |
| verification_cases | company_id, state, assigned_admin_id?, submitted_at?, decided_at?, reason? | company+state; one active case |
| files | owner_company_id?, uploader_id, object_key, mime, bytes, sha256, scan_state, visibility | unique object_key; private by default |
| verification_documents | case_id, file_id, type, expires_at? | case index |
| addresses | company_id, type, emirate, city, area, street, building, contact_name, phone, archived_at? | company+type |
| storefronts | seller_workspace_id, description_en, description_ar?, logo_file_id?, capabilities JSON, approved_version_id? | unique seller workspace |
| storefront_versions | storefront_id, version, snapshot JSON, moderation_state, reason? | unique storefront+version |
| categories | parent_id?, slug, name_en, name_ar, active, attributes_schema JSON | unique slug; no cycles |
| products | seller_workspace_id, category_id, slug, mode, state, approved_version_id? | unique seller+slug; category/state |
| product_versions | product_id, version, title_en, title_ar?, description_en, description_ar?, attributes JSON, moderation_state, reason? | unique product+version |
| product_media | product_version_id, file_id, position, alt_text | unique version+position |
| skus | product_id, seller_workspace_id, code, attributes JSON, unit, moq qty, lead_days, sample_allowed, tax_code, active | unique seller+code; moq>0 |
| price_tiers | sku_id, min_qty qty, unit_price money, currency | unique sku+min_qty; first tier = MOQ |
| inventory | sku_id, on_hand qty, reserved qty, low_threshold qty, restock_at? | unique sku; 0<=reserved<=on_hand |
| stock_movements | sku_id, actor_id?, delta_on_hand signed qty, delta_reserved signed qty, reason, reference_id? | sku+created_at; append only |
| reservations | checkout_id, sku_id, quantity qty, expires_at, state | unique checkout+sku; state+expiry |
| saved_items | buyer_workspace_id, product_id?, seller_workspace_id? | exactly one target; partial unique indexes |
| rfqs | buyer_workspace_id, title, category_id, specs, quantity qty, unit, target_date, emirate, budget money?, deadline, visibility, state | buyer+state; category+deadline |
| rfq_invites | rfq_id, seller_workspace_id | unique pair |
| rfq_files | rfq_id, file_id | unique pair |
| quotes | rfq_id, seller_workspace_id, state, current_version_id? | unique rfq+seller |
| quote_versions | quote_id, version, quantity qty, unit, unit_price money, shipping money, tax money, total money, specs, lead_days, delivery_date, valid_until, terms, state | unique quote+version; immutable after submit |
| quote_files | quote_version_id, file_id | unique pair |
| carts | buyer_workspace_id, user_id, state | one active per buyer+user |
| cart_items | cart_id, sku_id, quantity qty | unique cart+sku |
| checkouts | buyer_workspace_id, cart_id?, quote_version_id?, state, total money, expires_at, snapshot JSON | exactly one source; buyer+state |
| orders | checkout_id, buyer_workspace_id, seller_workspace_id, quote_version_id?, number, state, subtotal money, shipping money, tax money, total money, address_snapshot JSON, terms_snapshot JSON, po_reference? | unique number; unique checkout+seller; unique accepted quote_version where nonnull |
| order_items | order_id, sku_id?, title_snapshot, specs_snapshot JSON, qty, unit, unit_price money, tax money, line_total money | order index; immutable after creation |
| order_events | order_id, actor_id?, previous_state, new_state, reason?, metadata JSON | order+created_at; append only |
| shipments | order_id, carrier, tracking_code?, state, dispatched_at?, delivered_at?, proof_file_id? | order+state |
| shipment_items | shipment_id, order_item_id, qty | unique pair; total <= ordered qty |
| payments | checkout_id, provider, external_id?, amount money, currency, state | unique provider+external_id; checkout+state |
| payment_allocations | payment_id, order_id, amount money | unique pair; sum = captured amount |
| refunds | payment_id, order_id, amount money, state, external_id?, reason, requested_by, approved_by? | unique external_id; requester != approver |
| payouts | seller_workspace_id, provider, external_id?, amount money, state | unique provider+external_id |
| payout_allocations | payout_id, order_id, amount money | unique pair |
| ledger_transactions | reference_type, reference_id, event_key, currency | unique event_key; append only |
| ledger_entries | transaction_id, account_code, company_id?, debit money, credit money | exactly one nonzero; balanced transaction |
| invoices | order_id?, company_id, issuer_snapshot JSON, recipient_snapshot JSON, number, type, totals_snapshot JSON, file_id?, state | unique issuer+number (issuer key stored separately); immutable issued |
| disputes | order_id, opened_by, type, state, assigned_admin_id?, reason, resolution?, deadline? | order+state; one active dispute per order |
| case_evidence | dispute_id, file_id, submitted_by | dispute index |
| tickets | workspace_id, created_by, subject, state, assigned_admin_id?, order_id? | workspace+state |
| ticket_messages | ticket_id, author_id, body | ticket+created_at |
| conversations | buyer_workspace_id, seller_workspace_id, rfq_id?, order_id? | participant indexes; unique contextual pair |
| messages | conversation_id, sender_id, body?, file_id? | body or file required; conversation+created_at |
| read_receipts | conversation_id, user_id, last_read_message_id? | unique pair |
| reviews | order_id, buyer_workspace_id, seller_workspace_id, rating, comment?, state | unique order; rating 1–5 |
| notifications | user_id, type, payload JSON, read_at? | user+read_at+created_at |
| preferences | user_id, channel, event_type, enabled | unique user+channel+event |
| admin_memberships | user_id, role, active | unique user+role |
| audit_events | actor_id?, action, resource_type, resource_id, reason?, redacted_diff JSON, request_id | resource+created_at; append only |
| webhook_events | provider, event_id, payload_ref, state, attempts, processed_at? | unique provider+event_id |
| outbox | event_type, aggregate_id, payload JSON, state, attempts, next_attempt_at | state+next_attempt_at |
| idempotency_keys | actor_id, workspace_id?, route, key, request_hash, response_ref?, expires_at | unique actor+scope+route+key (null-safe) |
| plans | code, version, audience, price money, interval, entitlements JSON, state | unique code+version |
| subscriptions | workspace_id, plan_id, provider_ref?, state, period_end? | one active per workspace |
| configuration_versions | key, version, value JSON, approved_by?, effective_at? | unique key+version |
| settlement_accounts | seller_workspace_id, provider, provider_account_id, status | unique seller+provider |

Phase 2 additions: production_milestones, change_orders, approvals, warehouses, promotions, subscription_usage, tax_credit_notes as needed. Do not create unused tables solely to claim implementation.

Atomic constraints: lock inventory rows in SKU ID order; reserve and create order in transaction; use unique award guard on RFQ (accepted_quote_version_id nullable unique FK added to rfqs, with row lock); ledger insert validates balanced entries inside transaction; enforce aggregate refund <= capture and payout <= eligible payable with lock; historical snapshots immutable after payment. Search indexes: approved products category/state, seller/emirate, trigram or PostgreSQL text search for localized titles; filter by authorized visibility before pagination. Test foreign-key tenant mismatch and concurrency. Seed fictional UAE companies, categories, products, RFQs and roles; no real personal data.
