# 20. Language and localization

## 20.1 What exists
| Capability | Status | Source |
|---|---|---|
| English and Arabic UI | Implemented: every string has EN and AR (`apps/web/src/i18n/*-messages.ts`, typed keys, tests check parity) | `messages.test.ts` |
| Locale in URL | `/en/…` and `/ar/…`; user locale stored on the account (`Locale` enum) and used for emails | `apps/web/src/app/[locale]` |
| RTL | `<html dir>` from locale (`DIRECTION[locale]`); CSS uses logical properties | layout |
| Language switch | `LocaleSwitch` keeps the current route | `components/locale-switch.tsx` |
| Mixed-direction text | Names, times and message bodies isolated with `bdi` and `dir="auto"` | Phase 6 |
| Arabic search | Normalised diacritics, alef/yaa/taa marbuta, Arabic-Indic digits | `marketplace.service.ts` |
| Bilingual content fields | Products (title/description AR optional), storefront (all text fields EN/AR), categories (EN/AR), captions | contracts |
| Currency | AED via `formatFils` with `Intl.NumberFormat('en-AE' | 'ar-AE', currency AED)` | `packages/contracts/src/money.ts` |
| Dates | Timestamps in Asia/Dubai (`dateStyle: medium, timeStyle: short`); calendar dates without time-zone shift | `i18n/messages.ts` |
| Emails | EN/AR plain-text templates chosen by user locale | `apps/worker/src/email-templates.ts` |

Native-speaker Arabic review has **not** been done (listed as outstanding in `docs/IMPLEMENTATION_STATUS.md`).

## 20.2 Requirements for design

**English and Arabic:** design every P0 screen in both languages (mirrored layout). Arabic strings are typically 20–30% longer or shorter; allow wrapping, never truncate actions. Placeholder typography must include an Arabic-capable face (final typography deferred).

**Right-to-left layouts:** mirror layout direction, navigation order, breadcrumbs (› becomes ‹), progress steppers, chevrons and back arrows. Do **not** mirror: logos (text placeholder), media playback icons, numbers, phone numbers, SKU codes, emails, URLs, charts' time axis (keep left-to-right time in both, but place legends per reading direction), product images.

**Language switching:** visible in every header (and footer); label in the other language ("العربية" / "English"); preserves route and filters; signed-in users' preference saved.

**AED currency formatting:** English "AED 1,234.50"; Arabic as produced by `ar-AE` (e.g. "‏1,234.50 د.إ.‏" in Node ICU; browsers may differ slightly). Always 2 decimals; amounts right-aligned in LTR tables and left-aligned in RTL tables (aligned to the end). Input: AED with up to 2 decimals, converted to fils on the server. Show "excl. VAT" where relevant.

**Date and time:** store UTC, display Asia/Dubai. English "28 Nov 2026, 12:00 PM"; Arabic "28‏/11‏/2026، 12:00 م". Time inputs labelled "(Dubai time)". Relative times ("2 hours ago") are not used today; if added, show the absolute time on hover/focus. Week starts: Monday (UAE business week is Monday–Friday).

**Digits:** current formatting produces Western digits for `ar-AE` in Node; decide whether Arabic-Indic digits are wanted (FD-18 related). Search accepts both.

**UAE phone numbers:** stored E.164 (`+9715XXXXXXXX`); display "+971 50 123 4567"; input with fixed "+971" prefix option and validation message "Enter a UAE number in international format, for example +971501234567". Always LTR inside RTL text.

**Business addresses:** fields label, recipient, phone, line 1, line 2, city, emirate (7 options). No postcode (UAE has none). Optional landmark/Makani number is a recommendation. Company legal address is captured in onboarding.

**International manufacturer information:** product "country of origin" is an ISO 2-letter code (display country name in the UI language). Trading companies must hold a UAE licence; foreign suppliers are not onboarded at launch.

**Long translated text:** buttons allow two lines on mobile; tables wrap; badges never truncate (use shorter labels where needed); test with 30% expansion.

**Multilingual product descriptions:** Arabic fields are optional for sellers today; when missing, show English content with `lang="en" dir="ltr"` inside the Arabic page and a subtle "Available in English only" note (recommended). Seller forms show EN and AR side by side with a character counter for each.
