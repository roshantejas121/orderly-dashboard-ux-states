# Orders Dashboard UX States

## Overview

The original Orders Dashboard had the data-fetching lifecycle wired up, but the table body rendered a development placeholder instead of a usable interface. The page exposed `loading`, `error`, and `orders` state values without translating them into meaningful user feedback. As a result, users could not tell whether the order queue was still loading, empty, or unavailable, and the successful response was not presented as an actionable order-management view.

This change keeps the existing React and mock API structure while separating the four async outcomes into focused rendering components: `LoadingState`, `SuccessState`, `EmptyState`, and `ErrorState`.

## What Was Missing and Why It Mattered

| State | Original behavior | User impact |
| --- | --- | --- |
| Loading | A raw development placeholder was shown while the request remained pending. | Operations and warehouse users could mistake a normal wait for a broken page and refresh repeatedly. |
| Success | The placeholder displayed state metadata rather than the order list. | Users could not scan orders, prioritize work, or understand the workload at a glance. |
| Empty | A partial message and emoji were present, with no contextual action. | Users could not distinguish a genuinely empty workspace from a filtered result. |
| Error | A generic placeholder was rendered and the actual error was hidden. | Customer service and operations users had no diagnosis or recovery path. |

## Implementation Details

### Loading state

`LoadingState` provides a six-row animated skeleton that mirrors the table columns and a three-card skeleton for the summary area. The surrounding page header remains visible, which preserves orientation while the request is in progress and reduces layout shift when the response arrives.

### Success state

`SuccessState` renders the complete order workflow. Each row includes the order ID, customer name, product, order date, total amount, status badge, and a derived high-priority flag. The status breakdown includes Pending, Processing, Shipped, and Delivered counts. Summary cards show total orders, total value, and high-priority orders.

The success view also includes search by order ID or customer, status filtering, and a high-priority-only toggle. Filtered results retain the original total in the header, so a zero-result view can explain that orders still exist but do not match the active criteria.

### Empty state

`EmptyState` is context-aware. It handles an empty workspace, an all-processed queue, and an empty filtered result. The filtered scenario shows the matching count and offers a one-click **Clear filters** action. The unfiltered scenarios offer a **Refresh orders** action and explain what users should expect next.

### Error state

`ErrorState` keeps the table container and page context intact while showing a specific heading, user-facing explanation, technical detail, and retry action. `getErrorDetails` maps common network, server-unavailable, session, permission, and malformed-data errors to actionable messages. Unknown errors use a specific order-loading message rather than the generic “Something went wrong.”

## User Experience Improvements

The dashboard now communicates what is happening at every point in the request lifecycle. Warehouse staff see the shape of the queue before data arrives, operations managers can assess workload and status distribution without counting rows, and customer service representatives receive concrete recovery guidance when the order service fails. The state components are isolated so each can be tested and refined independently without entangling the table rendering logic.

## Verification

The mock API remains the state switch for manual verification. Set `SIMULATE` in `src/mockApi.js` to `loading`, `success`, `empty`, or `error`, then run the project with `npm run dev`. The success view can additionally be tested by searching, changing the status, and enabling the high-priority filter until the context-aware filtered empty state appears.

The production build is verified with `npm run build` before publication. The deployed application URL will be added here once the public repository deployment is available.
