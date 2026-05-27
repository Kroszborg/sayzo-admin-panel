# SAYZO Admin Panel — Backend API PRD

**For:** Backend developers  
**Frontend repo:** `sayzo-admin-panel` (Next.js 16 App Router)  
**Purpose:** Define every API the admin panel needs to replace mock data and become fully functional.  
**Updated:** 2026-05-27 — reflects latest UI design (all pages audited against reference images)

---

## Overview

The admin panel has 10 main sections: Dashboard, Users, Tasks, Disputes, Payments, Support, Notifications, Live Feed, Team, and Communications. All data is currently mocked; this document specifies every backend endpoint required.

**Namespace:** All endpoints live under `/admin/v1/` and require admin JWT authentication via `Authorization: Bearer <token>`. Do NOT reuse the user-facing `/api/v1/` gateway for admin calls.

**Base URL:** `https://admin-api.sayzo.in/admin/v1`

---

## Auth

### POST /admin/v1/auth/login
Send OTP to admin email.

```json
{ "email": "aarav@sayzo.in" }
```
**Response:**
```json
{ "message": "OTP sent", "expires_in": 300 }
```

---

### POST /admin/v1/auth/verify-otp
Verify OTP and issue admin JWT tokens.

**Request:**
```json
{ "email": "aarav@sayzo.in", "otp": "123456" }
```
**Response:**
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "admin": {
    "id": "ADM-001",
    "name": "Aarav Sharma",
    "email": "aarav@sayzo.in",
    "role": "Super Admin",
    "permissions": ["users.read", "users.write", "disputes.resolve", "..."]
  }
}
```

---

### POST /admin/v1/auth/refresh
Exchange refresh token for new access token.

**Request:** `{ "refresh_token": "..." }`  
**Response:** `{ "access_token": "...", "expires_in": 1800 }`

---

### POST /admin/v1/auth/logout
Invalidate tokens server-side.

---

### GET /admin/v1/auth/me
Get current admin profile. Called on every page load to validate session and load permissions.

**Response:** Same shape as `admin` object in `verify-otp`.

---

## Dashboard

### GET /admin/v1/dashboard/kpis
Top-level platform metrics for the 4 KPI cards and sparklines.

**Response:**
```json
{
  "gmv": {
    "today": 12840000,
    "today_pct_change": 14.2,
    "online": 4284000,
    "offline": 8556000,
    "sparkline": [820000, 950000, 880000, 1020000, 1150000, 1080000, 1280000]
  },
  "users": {
    "total": 24817,
    "today_delta": 342,
    "doers": 18204,
    "givers": 6613,
    "suspended_banned": 83,
    "sparkline": [210, 240, 220, 260, 280, 270, 320]
  },
  "tasks": {
    "active": 1247,
    "in_matching": 84,
    "in_progress": 1163
  },
  "disputes": {
    "open": 8,
    "at_sla_risk": 5,
    "avg_value": 4200,
    "this_week_delta": 2
  }
}
```

---

### GET /admin/v1/dashboard/live-feed
Latest 20 platform events for the dashboard live-feed widget.

**Response:**
```json
{
  "events": [
    {
      "id": "EVT-001",
      "type": "task_posted",
      "title": "Task TG-4582 posted by Arjun K.",
      "meta": "Cleaning · ₹1,500 · Mumbai",
      "user": "Arjun K.",
      "user_id": "USR-0007",
      "amount": 1500,
      "time_ago": "just now",
      "time": "2026-05-27T10:05:00Z",
      "city": "Mumbai",
      "severity": "normal",
      "entity_id": "TSK-19255",
      "entity_type": "task"
    }
  ]
}
```

**`type` values:** `task_posted` | `dispute_opened` | `payout` | `user_signup` | `kyc_verified` | `payment_released` | `task_completed` | `trust_signal` | `task_force_closed`  
**`severity` values:** `normal` | `high` | `critical`

---

### GET /admin/v1/dashboard/top-cities
Revenue and task counts by city (bar chart, top 5).

**Response:**
```json
{
  "cities": [
    { "city": "Mumbai",    "gmv": 328420, "tasks": 1240, "pct": 100 },
    { "city": "Bengaluru", "gmv": 284160, "tasks": 1080, "pct": 87 }
  ],
  "stats": {
    "completion_rate": 87.3,
    "avg_task_value": 2140,
    "take_rate": 12.0,
    "avg_match_time_seconds": 252
  }
}
```

---

## Users

### GET /admin/v1/users/stats
KPI strip data for the Users page header. Called once on page load.

**Response:**
```json
{
  "total": 24817,
  "today_delta": 342,
  "task_doers": 18204,
  "task_givers": 6613,
  "suspended_banned": 83
}
```

---

### GET /admin/v1/users
Paginated, filterable user list.

**Query params:**
| Param | Type | Example |
|---|---|---|
| `page` | int | `1` |
| `per_page` | int | `25` |
| `search` | string | `rahul` (matches name, email, phone, UID) |
| `role` | string | `Task Doer` \| `Task Giver` \| `Both` |
| `status` | string | `Active` \| `Suspended` \| `Shadow Banned` \| `Banned` \| `Pending KYC` |
| `city` | string | `Mumbai` |
| `availability` | string | `Available` \| `Busy` \| `Offline` |
| `joined` | string | `7d` \| `30d` \| `3m` \| `1y` |
| `sort` | string | `trust_score` \| `tasks` \| `name` |
| `sort_dir` | string | `asc` \| `desc` |

**Response:**
```json
{
  "data": [
    {
      "id": "USR-0002",
      "name": "Rahul Mehta",
      "email": "rahul.m@outlook.com",
      "phone": "+91 98765 43210",
      "role": "Task Giver",
      "status": "Active",
      "city": "Mumbai",
      "trust_score": 76,
      "tasks": 14,
      "joined_at": "2025-01-15T10:00:00Z",
      "is_verified": true,
      "upi_id": "rahul.m@oksbi",
      "availability": "Available"
    }
  ],
  "meta": { "total": 24817, "page": 1, "per_page": 25, "total_pages": 993 }
}
```

---

### GET /admin/v1/users/:id
Full user profile for the detail page (Overview / Tasks / Activity / Trust & Risk tabs).

**Response:**
```json
{
  "id": "USR-0002",
  "name": "Rahul Mehta",
  "email": "rahul.m@outlook.com",
  "phone": "+91 98765 43210",
  "role": "Task Giver",
  "status": "Active",
  "city": "Mumbai",
  "trust_score": 76,
  "joined_at": "2025-01-15T10:00:00Z",
  "is_verified": true,
  "upi_id": "rahul.m@oksbi",
  "bio": "...",
  "avatar_url": "...",
  "stats": {
    "tasks_posted": 14,
    "tasks_completed": 0,
    "disputes_filed": 2,
    "disputes_won": 1,
    "total_spent": 48200,
    "total_earned": 0,
    "avg_rating": 4.7
  },
  "recent_tasks": [
    {
      "id": "TSK-19255",
      "title": "Logo design for new cafe",
      "status": "Completed",
      "amount": 450,
      "posted_at": "..."
    }
  ],
  "trust_log": [
    { "event": "KYC verified", "delta": 15, "score_after": 76, "at": "..." },
    { "event": "Dispute resolved against", "delta": -10, "score_after": 61, "at": "..." }
  ],
  "kyc": {
    "aadhaar_verified": true,
    "pan_verified": false,
    "face_verified": false
  },
  "flags": [
    { "type": "device_cluster", "note": "3 accounts from same device", "raised_at": "..." }
  ],
  "activity_log": [
    { "action": "Account suspended", "by": "Aarav Sharma", "at": "...", "note": "..." }
  ]
}
```

---

### PATCH /admin/v1/users/:id/status
Change user status. Requires `users.write` permission.

**Request:**
```json
{
  "status": "Suspended",
  "reason": "Multiple trust violations",
  "duration_days": 7
}
```
**`status` values:** `Active` | `Suspended` | `Shadow Banned` | `Banned`

---

### POST /admin/v1/users/:id/trust-score
Manually adjust trust score.

**Request:** `{ "delta": -10, "reason": "Dispute resolved against user" }`

---

### POST /admin/v1/users/:id/force-close-tasks
Force-close all active tasks belonging to this user. Requires `tasks.write` permission.

**Request:**
```json
{ "reason": "User account banned per policy violation" }
```
**Response:**
```json
{ "closed_count": 3, "task_ids": ["TSK-001", "TSK-002", "TSK-003"] }
```

---

### GET /admin/v1/users/export
Generate CSV of filtered users. Returns a signed download URL (or streams directly).

**Query params:** Same as list, plus `date_from` / `date_to`.

---

## Tasks

### GET /admin/v1/tasks
Paginated task list.

**Query params:**
| Param | Type | Values |
|---|---|---|
| `page` | int | |
| `per_page` | int | |
| `search` | string | task ID, title, giver name |
| `status` | string | `Matching` \| `In Progress` \| `Completed` \| `Disputed` \| `Force-Closed` |
| `category_id` | string | |
| `city` | string | |
| `role` | string | `Giver` (tasks with giver) \| `Doer` (tasks with doer assigned) |
| `sort` | string | `posted_at` \| `amount` |
| `sort_dir` | string | `asc` \| `desc` |

**Response:**
```json
{
  "tabs": {
    "all": 3420, "matching": 18, "in_progress": 156,
    "completed": 2891, "disputed": 24, "force_closed": 11
  },
  "data": [
    {
      "id": "TSK-19255",
      "title": "Logo design for new cafe",
      "category": "Design",
      "giver": { "id": "USR-0007", "name": "Sneha Joshi" },
      "doer": null,
      "amount": 450,
      "status": "Matching",
      "posted_at": "2026-05-27T10:00:00Z",
      "posted_ago": "4m ago",
      "nearby_doers": 6,
      "matching_expires_at": "2026-05-27T10:04:00Z",
      "city": "Mumbai"
    }
  ],
  "meta": { "total": 3420, "page": 1, "per_page": 10, "total_pages": 342 }
}
```

> **Note:** `tabs` counts are always returned regardless of active filter so the tab badges stay accurate.

---

### GET /admin/v1/tasks/:id
Full task detail.

**Response:** Task object plus:
```json
{
  "description": "Create a modern logo...",
  "skills_required": ["Figma", "Illustrator"],
  "timeline": [
    { "event": "Task posted", "at": "...", "actor": "Sneha Joshi" },
    { "event": "Doer matched", "at": "...", "actor": "System" }
  ],
  "chat_messages_count": 12,
  "payment": {
    "id": "PAY-001",
    "status": "In Escrow",
    "amount": 450,
    "doer_earns": 405
  },
  "disputes": []
}
```

---

### PATCH /admin/v1/tasks/:id/status
Admin override task status.

**Request:** `{ "status": "Force-Closed", "reason": "Both parties agreed to cancel" }`

---

### GET /admin/v1/tasks/export
Export tasks CSV.

---

## Disputes

### GET /admin/v1/disputes/stats
KPI strip data for the Disputes page header.

**Response:**
```json
{
  "open": 24,
  "open_at_sla_risk": 5,
  "unassigned": 7,
  "avg_resolution_hours": 99,
  "avg_resolution_display": "4d 3h",
  "avg_resolution_pct_change": -18,
  "resolved_today": 3,
  "resolved_today_sla_met": 3
}
```

---

### GET /admin/v1/disputes
Paginated dispute list.

**Query params:**
| Param | Type | Values |
|---|---|---|
| `page` | int | |
| `per_page` | int | |
| `status` | string | `Unassigned` \| `In Progress` \| `Evidence Pending` \| `Escalated` \| `Resolved` |
| `priority` | string | `Critical` \| `High` \| `Medium` \| `Low` |
| `category` | string | `Payment` \| `Quality` \| `Abandonment` \| `Fraud` |
| `city` | string | |
| `assigned_to` | string | admin ID (or `unassigned`) |
| `sla_overdue` | bool | `true` |
| `sort` | string | `sla_deadline` \| `filed_at` \| `amount` |
| `sort_dir` | string | `asc` \| `desc` |

**Response:**
```json
{
  "tabs": {
    "all": 24, "unassigned": 7, "in_progress": 12,
    "evidence_pending": 3, "escalated": 2, "resolved": 486
  },
  "data": [
    {
      "id": "DSP-2026-0847",
      "task_id": "TSK-19248",
      "title": "Payment not released after task completion",
      "giver": { "id": "USR-0006", "name": "Priya Mehta" },
      "doer":  { "id": "USR-0004", "name": "Vikram Kumar" },
      "amount": 22000,
      "priority": "Critical",
      "category": "Payment",
      "status": "Unassigned",
      "sla": "Overdue · Was due 2h ago",
      "sla_overdue": true,
      "sla_deadline": "2026-05-27T08:00:00Z",
      "assigned_to": null,
      "filed_at": "2026-05-27T10:00:00Z",
      "filed_ago": "Just now",
      "city": "Mumbai"
    }
  ],
  "meta": { "total": 24, "page": 1, "per_page": 10, "total_pages": 3 }
}
```

---

### GET /admin/v1/disputes/:id
Full dispute detail.

**Response:** Dispute object plus:
```json
{
  "task": { "...full task object..." },
  "evidence": [
    {
      "id": "EVD-001",
      "uploaded_by": "Priya Mehta",
      "uploaded_by_id": "USR-0006",
      "role": "giver",
      "type": "screenshot",
      "url": "...",
      "thumb_url": "...",
      "description": "Chat showing agreed deliverables",
      "uploaded_at": "..."
    }
  ],
  "timeline": [
    { "event": "Dispute filed", "at": "...", "actor": "Priya Mehta" },
    { "event": "Assigned to Aarav Sharma", "at": "...", "actor": "System" }
  ],
  "chat_thread": [
    { "id": "MSG-001", "from": "Aarav Sharma", "role": "admin", "body": "...", "at": "..." }
  ]
}
```

---

### PATCH /admin/v1/disputes/:id/assign
Assign dispute to a resolver.

**Request:** `{ "assignee_id": "ADM-001" }`

---

### PATCH /admin/v1/disputes/:id/status
Update dispute status.

**Request:** `{ "status": "In Progress" }`  
**`status` values:** `Unassigned` | `In Progress` | `Evidence Pending` | `Escalated` | `Resolved`

---

### POST /admin/v1/disputes/:id/resolution
Submit final resolution.

**Request:**
```json
{
  "outcome": "favor_giver",
  "payment_action": "refund",
  "notes": "Evidence shows doer did not deliver agreed scope.",
  "trust_penalty_doer": -15,
  "trust_penalty_giver": 0
}
```
**`outcome` values:** `favor_giver` | `favor_doer` | `split`  
**`payment_action` values:** `release` | `refund` | `split`

---

### GET /admin/v1/disputes/:id/evidence
List evidence files for a dispute.

---

### POST /admin/v1/disputes/:id/evidence
Upload evidence file. Admin-uploaded only. Multipart.

**Form fields:** `file` (binary), `description` (string)

---

### POST /admin/v1/disputes/:id/messages
Add message to the admin-side dispute thread.

**Request:** `{ "body": "Please provide screenshots of delivered work." }`

---

### GET /admin/v1/disputes/export
Export disputes CSV.

---

## Payments

### GET /admin/v1/payments/stats
KPI strip data for the Payments page header.

**Response:**
```json
{
  "total_in_escrow": 42840000,
  "total_in_escrow_task_count": 247,
  "released_today": 11260000,
  "released_today_payout_count": 34,
  "released_today_auto": true,
  "disputed_amount": 23820000,
  "disputed_count": 8,
  "failed_stuck_amount": 1420000,
  "failed_stuck_count": 3
}
```

---

### GET /admin/v1/payments
Paginated payment list.

**Query params:**
| Param | Type | Values |
|---|---|---|
| `page` | int | |
| `per_page` | int | |
| `search` | string | payment ID, task title, giver/doer name, UPI |
| `status` | string | `In Escrow` \| `Released` \| `Refunded` \| `Disputed` \| `Failed` |
| `city` | string | |
| `date_from` | date | `2026-05-01` |
| `date_to` | date | `2026-05-27` |
| `sort` | string | `amount` \| `created_at` |
| `sort_dir` | string | `asc` \| `desc` |

**Response:**
```json
{
  "tabs": {
    "all": 2428, "in_escrow": 247, "released": 2104, "refunded": 74, "disputed": 3
  },
  "data": [
    {
      "id": "PAY-87233",
      "task_id": "TSK-19250",
      "task_title": "Mobile UI UX Design",
      "category": "Design",
      "giver": { "id": "USR-0006", "name": "Priya Mehta" },
      "doer":  { "id": "USR-0004", "name": "Vikram Kumar" },
      "amount": 22000,
      "doer_earns": 19360,
      "platform_fee": 2640,
      "status": "In Escrow",
      "release_window": "3d 22h",
      "release_window_note": "Auto-release window",
      "created_at": "2026-05-27T10:00:00Z",
      "created_ago": "Just now"
    }
  ],
  "meta": { "total": 2428, "page": 1, "per_page": 10, "total_pages": 243 }
}
```

---

### GET /admin/v1/payments/:id
Full payment detail.

**Response:** Payment object plus:
```json
{
  "timeline": [
    { "event": "Escrow created", "at": "...", "actor": "System" },
    { "event": "Task completed", "at": "...", "actor": "Sneha Joshi" }
  ],
  "gateway": "Razorpay",
  "gateway_order_id": "...",
  "gateway_payment_id": "...",
  "upi_vpa": "pooja.g@paytm",
  "related_dispute": null
}
```

---

### POST /admin/v1/payments/:id/release
Manually release escrow to doer. Requires `payments.release` permission.

**Request:** `{ "reason": "Task confirmed completed by admin review" }`

---

### POST /admin/v1/payments/:id/refund
Refund payment to giver. Requires `payments.release` permission.

**Request:** `{ "reason": "Dispute resolved in favor of giver" }`

---

### POST /admin/v1/payments/:id/retry
Retry a failed payout.

---

### GET /admin/v1/payments/export
Export payments CSV.

---

## Support Tickets

### GET /admin/v1/support/stats
KPI strip data for the Support page header.

**Response:**
```json
{
  "open_tickets": 31,
  "new_last_hour": 4,
  "unassigned": 9,
  "avg_first_response_minutes": 108,
  "avg_first_response_display": "1h 48m",
  "avg_first_response_pct_change": -14,
  "resolved_today": 22,
  "resolution_rate_today": 91
}
```

---

### GET /admin/v1/support/tickets
Paginated ticket list.

**Query params:**
| Param | Type | Values |
|---|---|---|
| `page` | int | |
| `per_page` | int | |
| `search` | string | ticket ID, title, requester name |
| `status` | string | `Open` \| `Pending Reply` \| `Unassigned` \| `Resolved` |
| `category` | string | `Payment` \| `Account` \| `Dispute` \| `Verification` \| `Technical` \| `Refund` \| `KYC` \| `Trust` |
| `city` | string | |
| `assigned_to` | string | admin ID |
| `date_from` | date | |
| `date_to` | date | |
| `sort` | string | `created_at` \| `sla_deadline` |
| `sort_dir` | string | `asc` \| `desc` |

**Response:**
```json
{
  "tabs": {
    "all": 31, "open": 18, "pending_reply": 7, "unassigned": 7, "resolved": 22
  },
  "data": [
    {
      "id": "TKT-2026-1841",
      "title": "Escrow released but payment not received in bank",
      "category": "Payment",
      "requester": {
        "id": "USR-0004",
        "name": "Vikram Kumar",
        "role": "Task Doer"
      },
      "assigned_to": { "id": "ADM-002", "name": "Aarav Sharma" },
      "status": "Open",
      "sla": "42m left",
      "sla_overdue": false,
      "sla_deadline": "2026-05-27T12:00:00Z",
      "created_at": "2026-05-27T09:00:00Z",
      "created_ago": "3h ago"
    }
  ],
  "meta": { "total": 31, "page": 1, "per_page": 10, "total_pages": 4 }
}
```

---

### GET /admin/v1/support/tickets/:id
Ticket detail with full message thread.

**Response:** Ticket object plus:
```json
{
  "messages": [
    {
      "id": "MSG-001",
      "from_id": "USR-0011",
      "from_name": "Pooja Gupta",
      "from_role": "user",
      "body": "My payment has been stuck for 7 days...",
      "at": "...",
      "read_by_admin": true
    },
    {
      "id": "MSG-002",
      "from_id": "ADM-002",
      "from_name": "Riya Verma",
      "from_role": "admin",
      "body": "We're looking into this right now.",
      "at": "...",
      "read_by_user": false
    }
  ],
  "related_task": { "id": "TSK-19255", "title": "Logo design for new cafe" },
  "related_payment": { "id": "PAY-0001", "status": "In Escrow", "amount": 450 },
  "related_dispute": null
}
```

---

### PATCH /admin/v1/support/tickets/:id/assign
Assign ticket to agent.

**Request:** `{ "assignee_id": "ADM-002" }`

---

### PATCH /admin/v1/support/tickets/:id/status
Update ticket status.

**Request:** `{ "status": "Resolved" }`  
**`status` values:** `Open` | `Pending Reply` | `Resolved` | `Escalated`

---

### POST /admin/v1/support/tickets/:id/messages
Add message to ticket thread.

**Request:** `{ "body": "This has been escalated to our payments team." }`

---

### GET /admin/v1/support/tickets/export
Export tickets CSV.

---

## Notifications

### GET /admin/v1/notifications
Paginated admin notifications.

**Query params:** `page`, `per_page`, `category` (Users | Task Updates | Payments | Support | System), `severity` (critical | warning | info | success), `unread_only` (bool)

**Response:**
```json
{
  "unread_count": 12,
  "data": [
    {
      "id": "NTF-001",
      "category": "Payments",
      "severity": "critical",
      "title": "Payment stuck — manual release needed",
      "body": "PAY-0001 has been in escrow 14 days without auto-release.",
      "redirect_url": "/payments/PAY-0001",
      "cta_label": "Review payment",
      "is_read": false,
      "time": "2026-05-27T10:00:00Z",
      "time_ago": "2m ago"
    }
  ],
  "meta": { "total": 84, "page": 1, "per_page": 20, "total_pages": 5 }
}
```

---

### PATCH /admin/v1/notifications/:id/read
Mark single notification as read.

---

### POST /admin/v1/notifications/read-all
Mark all notifications as read (scoped to current admin).

---

### DELETE /admin/v1/notifications/:id
Dismiss/delete notification.

---

## Live Feed

### GET /admin/v1/live-feed/events
Full event log page with advanced filters.

**Query params:**
| Param | Type | Values |
|---|---|---|
| `page` | int | |
| `per_page` | int | |
| `type` | string | `tasks` \| `disputes` \| `payments` \| `users` \| `trust` \| `system` |
| `severity` | string | `critical` \| `high` \| `normal` |
| `city` | string | |
| `date_from` | date | `2026-05-27` |
| `date_to` | date | `2026-05-27` |
| `time_from` | time | `00:00` |
| `time_to` | time | `23:59` |

**Response:**
```json
{
  "data": [
    {
      "id": "EVT-001",
      "type": "task_posted",
      "title": "Task TG-4582 posted",
      "meta": "Cleaning · ₹1,500 · Mumbai",
      "user": "Arjun K.",
      "user_id": "USR-0007",
      "amount": 1500,
      "time": "2026-05-27T10:05:00Z",
      "time_ago": "just now",
      "city": "Mumbai",
      "severity": "normal",
      "entity_id": "TSK-19255",
      "entity_type": "task"
    }
  ],
  "meta": { "total": 8563, "page": 1, "per_page": 50, "total_pages": 172 }
}
```

---

### POST /admin/v1/live-feed/events/export
Export filtered event log to CSV.

**Request body:** Same filter params as GET.  
**Response:** `{ "download_url": "...", "expires_at": "..." }`

---

## Team

### GET /admin/v1/team/stats
KPI strip data for the Team page header.

**Response:**
```json
{
  "total": 8,
  "roles": { "super_admin": 1, "admin": 3, "support_agent": 3, "viewer": 1 },
  "online_now": 5,
  "actions_today": 342,
  "actions_today_pct_change": 18,
  "pending_invites": 3,
  "expired_invites": 1
}
```

---

### GET /admin/v1/team/members
List all admin team members.

**Query params:** `page`, `per_page`, `search`, `role` (`Super Admin` | `Admin` | `Support Agent` | `Viewer`), `sort` (`last_active` | `name`)

**Response:**
```json
{
  "data": [
    {
      "id": "ADM-001",
      "name": "Aarav Sharma",
      "email": "aarav@sayzo.in",
      "phone": "+91 98765 00001",
      "role": "Super Admin",
      "is_online": true,
      "permissions": ["users.read", "users.write", "disputes.resolve", "payments.release", "team.manage"],
      "last_action": "Resolved dispute DSP-2026-0841",
      "last_action_at": "2026-05-27T08:00:00Z",
      "last_action_ago": "2 min ago",
      "joined_at": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": { "total": 8, "page": 1, "per_page": 12, "total_pages": 1 }
}
```

---

### PATCH /admin/v1/team/members/:id
Update team member role or permissions.

**Request:**
```json
{
  "role": "Admin",
  "permissions": ["users.read", "users.write", "disputes.read"]
}
```

---

### DELETE /admin/v1/team/members/:id
Remove team member (revoke all access).

---

### GET /admin/v1/team/invites
List pending and expired invitations.

**Response:**
```json
{
  "data": [
    {
      "id": "INV-001",
      "email": "ananya.s@sayzo.in",
      "role": "Support Agent",
      "invited_by": "Aarav Sharma",
      "invited_by_id": "ADM-001",
      "sent_at": "2026-04-30T10:00:00Z",
      "sent_ago": "2 days ago",
      "expires_at": "2026-05-07T10:00:00Z",
      "expires_display": "Expires May 7",
      "status": "Pending"
    }
  ]
}
```

---

### POST /admin/v1/team/invites
Send one or more invitations.

**Request:**
```json
{
  "invites": [
    { "email": "neha@sayzo.in", "role": "Support Agent" }
  ]
}
```
**Response:**
```json
{
  "results": [
    { "email": "neha@sayzo.in", "status": "sent", "invite_id": "INV-004" },
    { "email": "dev@sayzo.in", "status": "already_member" }
  ]
}
```

---

### POST /admin/v1/team/invites/:id/resend
Resend an expired invite; refreshes the expiry.

**Response:** Updated invite object.

---

### DELETE /admin/v1/team/invites/:id
Cancel/revoke a pending invite.

---

## Communications

### GET /admin/v1/communications/conversations
Live support chat list.

**Query params:** `page`, `per_page`, `status` (`open` | `resolved`), `assigned_to`

**Response:**
```json
{
  "data": [
    {
      "id": "CONV-001",
      "user": { "id": "USR-0011", "name": "Pooja Gupta", "role": "Task Doer" },
      "subject": "Payment stuck issue",
      "status": "open",
      "assigned_to": { "id": "ADM-002", "name": "Riya Verma" },
      "last_message": "Thanks for reaching out...",
      "last_message_at": "...",
      "unread_by_admin": 2
    }
  ],
  "meta": { "total": 34, "page": 1, "per_page": 20, "total_pages": 2 }
}
```

---

### GET /admin/v1/communications/conversations/:id
Conversation with full message history.

**Response:**
```json
{
  "id": "CONV-001",
  "user": { "...user object..." },
  "status": "open",
  "assigned_to": { "...admin object..." },
  "messages": [
    {
      "id": "MSG-001",
      "from_role": "user",
      "from_name": "Pooja Gupta",
      "from_id": "USR-0011",
      "body": "My payment hasn't been released...",
      "at": "...",
      "read_by_admin": true
    }
  ]
}
```

---

### POST /admin/v1/communications/conversations/:id/messages
Send a message in the conversation.

**Request:** `{ "body": "Your issue has been escalated to the payments team." }`

---

### PATCH /admin/v1/communications/conversations/:id/read
Mark all messages in conversation as read by admin.

---

### WebSocket /admin/ws/conversations/:id
Real-time chat stream.

**Events emitted to client:**
- `{ "type": "message", "data": { ...message object... } }` — new message
- `{ "type": "typing", "data": { "from": "user" } }` — user typing
- `{ "type": "read", "data": { "by": "user", "message_id": "MSG-001" } }` — read receipt

---

### POST /admin/v1/communications/broadcast
Send platform broadcast.

**Request:**
```json
{
  "title": "Platform maintenance scheduled",
  "body": "Down for maintenance May 30, 2026 from 2–4 AM IST.",
  "target": {
    "roles": ["Task Doer", "Task Giver"],
    "cities": ["Mumbai", "Bengaluru"],
    "status": ["Active"]
  },
  "channels": ["push", "in_app"],
  "scheduled_at": null
}
```
**`channels` values:** `push` | `in_app` | `email` | `sms`  
**`scheduled_at`:** ISO timestamp or `null` for immediate.

---

### GET /admin/v1/communications/broadcasts
Broadcast history.

**Response:**
```json
{
  "data": [
    {
      "id": "BRC-001",
      "title": "Platform maintenance scheduled",
      "body": "...",
      "sent_at": "...",
      "sent_by": "Aarav Sharma",
      "recipients": 18420,
      "channels": ["push", "in_app"],
      "target": { "roles": ["..."], "cities": ["..."] }
    }
  ]
}
```

---

## Categories

### GET /admin/v1/categories
Task categories with counts. Used in all task filter dropdowns.

**Response:**
```json
{
  "categories": [
    { "id": "CAT-01", "name": "Design",      "task_count": 2840, "icon_url": "..." },
    { "id": "CAT-02", "name": "Development", "task_count": 3104, "icon_url": "..." }
  ]
}
```

---

## Platform Settings (Phase 2)

### GET /admin/v1/settings
Get platform config. Requires `settings.manage`.

**Response:**
```json
{
  "platform_fee_pct": 10,
  "escrow_auto_release_days": 7,
  "kyc_auto_approve_confidence": 90,
  "dispute_sla_hours": 48,
  "max_trust_score": 100,
  "min_task_budget": 100,
  "max_task_budget": 500000
}
```

---

### PATCH /admin/v1/settings
Update platform settings. Requires `settings.manage`.

---

## Authentication & Authorization

All admin endpoints require `Authorization: Bearer <admin_access_token>`.

Access tokens expire in 30 minutes. Use `POST /admin/v1/auth/refresh` to renew.

**Role hierarchy:**

| Role | Permissions |
|---|---|
| `Super Admin` | All permissions |
| `Admin` | users.read/write, disputes.read/resolve, payments.read/release, support.read/write, team.manage |
| `Support Agent` | users.read, disputes.read, support.read/write |
| `Viewer` | users.read, disputes.read, payments.read, support.read |

Return `403 Forbidden` for permission violations.  
Return `401 Unauthorized` for missing/expired tokens.

---

## Error Response Format

```json
{
  "error": {
    "code": "PAYMENT_ALREADY_RELEASED",
    "message": "This payment has already been released to the doer.",
    "details": {}
  }
}
```

**Common error codes:**
- `UNAUTHORIZED` — missing or invalid JWT
- `FORBIDDEN` — insufficient permissions for the action
- `NOT_FOUND` — resource doesn't exist
- `VALIDATION_ERROR` — request body failed validation (details contains field errors)
- `CONFLICT` — duplicate action (e.g. already released, already assigned)
- `RATE_LIMITED` — too many requests

---

## Pagination Convention

All paginated list endpoints use:

```json
{
  "data": [...],
  "meta": {
    "total": 2428,
    "page": 1,
    "per_page": 10,
    "total_pages": 243
  }
}
```

Default `per_page` is 10. Maximum is 100.

---

## Endpoint Summary

| # | Method | Path | Description |
|---|---|---|---|
| 1 | POST | `/admin/v1/auth/login` | Send login OTP |
| 2 | POST | `/admin/v1/auth/verify-otp` | Verify OTP + issue tokens |
| 3 | POST | `/admin/v1/auth/refresh` | Refresh access token |
| 4 | POST | `/admin/v1/auth/logout` | Invalidate session |
| 5 | GET | `/admin/v1/auth/me` | Get current admin |
| 6 | GET | `/admin/v1/dashboard/kpis` | Dashboard KPI cards |
| 7 | GET | `/admin/v1/dashboard/live-feed` | Dashboard feed widget |
| 8 | GET | `/admin/v1/dashboard/top-cities` | City revenue chart |
| 9 | GET | `/admin/v1/users/stats` | Users page KPI strip |
| 10 | GET | `/admin/v1/users` | User list |
| 11 | GET | `/admin/v1/users/:id` | User detail |
| 12 | PATCH | `/admin/v1/users/:id/status` | Suspend/ban user |
| 13 | POST | `/admin/v1/users/:id/trust-score` | Adjust trust score |
| 13a | POST | `/admin/v1/users/:id/force-close-tasks` | Force-close all user's active tasks |
| 14 | GET | `/admin/v1/users/export` | Export users CSV |
| 15 | GET | `/admin/v1/tasks` | Task list |
| 16 | GET | `/admin/v1/tasks/:id` | Task detail |
| 17 | PATCH | `/admin/v1/tasks/:id/status` | Force-close task |
| 18 | GET | `/admin/v1/tasks/export` | Export tasks CSV |
| 19 | GET | `/admin/v1/disputes/stats` | Disputes page KPI strip |
| 20 | GET | `/admin/v1/disputes` | Dispute list |
| 21 | GET | `/admin/v1/disputes/:id` | Dispute detail |
| 22 | PATCH | `/admin/v1/disputes/:id/assign` | Assign dispute |
| 23 | PATCH | `/admin/v1/disputes/:id/status` | Update dispute status |
| 24 | POST | `/admin/v1/disputes/:id/resolution` | Submit resolution |
| 25 | GET | `/admin/v1/disputes/:id/evidence` | List evidence |
| 26 | POST | `/admin/v1/disputes/:id/evidence` | Upload evidence |
| 27 | POST | `/admin/v1/disputes/:id/messages` | Add dispute message |
| 28 | GET | `/admin/v1/disputes/export` | Export disputes CSV |
| 29 | GET | `/admin/v1/payments/stats` | Payments page KPI strip |
| 30 | GET | `/admin/v1/payments` | Payment list |
| 31 | GET | `/admin/v1/payments/:id` | Payment detail |
| 32 | POST | `/admin/v1/payments/:id/release` | Manual release |
| 33 | POST | `/admin/v1/payments/:id/refund` | Refund to giver |
| 34 | POST | `/admin/v1/payments/:id/retry` | Retry failed payout |
| 35 | GET | `/admin/v1/payments/export` | Export payments CSV |
| 36 | GET | `/admin/v1/support/stats` | Support page KPI strip |
| 37 | GET | `/admin/v1/support/tickets` | Ticket list |
| 38 | GET | `/admin/v1/support/tickets/:id` | Ticket detail |
| 39 | PATCH | `/admin/v1/support/tickets/:id/assign` | Assign ticket |
| 40 | PATCH | `/admin/v1/support/tickets/:id/status` | Update ticket status |
| 41 | POST | `/admin/v1/support/tickets/:id/messages` | Add reply |
| 42 | GET | `/admin/v1/support/tickets/export` | Export tickets CSV |
| 43 | GET | `/admin/v1/notifications` | Admin notifications |
| 44 | PATCH | `/admin/v1/notifications/:id/read` | Mark read |
| 45 | POST | `/admin/v1/notifications/read-all` | Mark all read |
| 46 | DELETE | `/admin/v1/notifications/:id` | Delete notification |
| 47 | GET | `/admin/v1/live-feed/events` | Live feed page |
| 48 | POST | `/admin/v1/live-feed/events/export` | Export event log |
| 49 | GET | `/admin/v1/team/stats` | Team page KPI strip |
| 50 | GET | `/admin/v1/team/members` | Team member list |
| 51 | PATCH | `/admin/v1/team/members/:id` | Update member role |
| 52 | DELETE | `/admin/v1/team/members/:id` | Remove member |
| 53 | GET | `/admin/v1/team/invites` | Invitation list |
| 54 | POST | `/admin/v1/team/invites` | Send invites |
| 55 | POST | `/admin/v1/team/invites/:id/resend` | Resend expired invite |
| 56 | DELETE | `/admin/v1/team/invites/:id` | Cancel invite |
| 57 | GET | `/admin/v1/communications/conversations` | Live support list |
| 58 | GET | `/admin/v1/communications/conversations/:id` | Conversation detail |
| 59 | POST | `/admin/v1/communications/conversations/:id/messages` | Send message |
| 60 | PATCH | `/admin/v1/communications/conversations/:id/read` | Mark conversation read |
| 61 | WS | `/admin/ws/conversations/:id` | Real-time chat |
| 62 | POST | `/admin/v1/communications/broadcast` | Send broadcast |
| 63 | GET | `/admin/v1/communications/broadcasts` | Broadcast history |
| 64 | GET | `/admin/v1/categories` | Task categories |
| 65 | GET | `/admin/v1/settings` | Platform settings |
| 66 | PATCH | `/admin/v1/settings` | Update settings |
