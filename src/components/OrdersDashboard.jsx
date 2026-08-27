import { useEffect, useMemo, useState } from 'react'
import { fetchOrders } from '../mockApi'

const STATUS_CONFIG = {
  Delivered: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', dot: '#10b981' },
  Shipped: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', dot: '#3b82f6' },
  Processing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', dot: '#f59e0b' },
  Pending: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', dot: '#8b5cf6' },
  Cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', dot: '#ef4444' },
}

const TABLE_COLUMNS = ['Order ID', 'Customer', 'Product', 'Order Date', 'Total Amount', 'Status', 'Priority']
const STATUS_FILTERS = ['All statuses', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

function isPriorityOrder(order) {
  return order.priority ?? (order.status === 'Pending' || order.status === 'Processing')
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function formatAmount(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: config.bg, color: config.color, padding: '5px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: config.dot }} />
      {status}
    </span>
  )
}

function PriorityBadge({ priority }) {
  return priority ? (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid rgba(245,158,11,0.25)', padding: '5px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
      <span aria-hidden="true">!</span> High priority
    </span>
  ) : (
    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Standard</span>
  )
}

function TableHeader() {
  return (
    <thead>
      <tr style={{ borderBottom: '1px solid var(--border)' }}>
        {TABLE_COLUMNS.map(column => (
          <th key={column} scope="col" style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
            {column}
          </th>
        ))}
      </tr>
    </thead>
  )
}

function OrderRow({ order }) {
  const priority = isPriorityOrder(order)
  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
      onMouseEnter={event => { event.currentTarget.style.background = 'var(--surface-2)' }}
      onMouseLeave={event => { event.currentTarget.style.background = 'transparent' }}>
      <td style={{ padding: '15px 20px', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>{order.id}</td>
      <td style={{ padding: '15px 20px', color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap' }}>{order.customer}</td>
      <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', maxWidth: 210, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.product}</td>
      <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap' }}>{formatDate(order.date)}</td>
      <td style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontSize: 13, whiteSpace: 'nowrap' }}>{formatAmount(order.amount)}</td>
      <td style={{ padding: '15px 20px' }}><StatusBadge status={order.status} /></td>
      <td style={{ padding: '15px 20px' }}><PriorityBadge priority={priority} /></td>
    </tr>
  )
}

function SkeletonBlock({ width = '100%', height = 14 }) {
  return <div aria-hidden="true" style={{ width, height, borderRadius: 6, background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
}

function LoadingState() {
  return (
    <section aria-label="Loading orders" style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
        {[1, 2, 3].map(card => (
          <div key={card} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 28px' }}>
            <SkeletonBlock width="46%" height={13} />
            <div style={{ marginTop: 16 }}><SkeletonBlock width="58%" height={30} /></div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)' }}><SkeletonBlock width="180px" height={18} /></div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 980, borderCollapse: 'collapse' }}>
            <TableHeader />
            <tbody>
              {[1, 2, 3, 4, 5, 6].map(row => (
                <tr key={row} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {[52, 112, 170, 92, 86, 88, 92].map((width, column) => (
                    <td key={column} style={{ padding: '16px 20px' }}><SkeletonBlock width={width} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function SummaryMetrics({ orders }) {
  const totals = orders.reduce((summary, order) => {
    summary.totalValue += order.amount
    summary.byStatus[order.status] = (summary.byStatus[order.status] || 0) + 1
    return summary
  }, { totalValue: 0, byStatus: {} })

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
        <MetricCard label="Total orders" value={orders.length} icon="#" color="var(--accent)" />
        <MetricCard label="Total value" value={formatAmount(totals.totalValue)} icon="₹" color="var(--green)" />
        <MetricCard label="High priority" value={orders.filter(isPriorityOrder).length} icon="!" color="var(--purple)" />
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Status breakdown</span>
        {['Pending', 'Processing', 'Shipped', 'Delivered'].map(status => (
          <span key={status} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_CONFIG[status].dot }} />
            <strong style={{ color: 'var(--text-primary)' }}>{totals.byStatus[status] || 0}</strong> {status}
          </span>
        ))}
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon, color }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '22px 26px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center', background: `${color}20`, color, fontFamily: 'var(--mono)', fontWeight: 700 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: 'var(--mono)' }}>{value}</div>
    </div>
  )
}

function EmptyState({ filtered, totalOrders, onClearFilters, onRefresh }) {
  const allProcessed = !filtered && totalOrders > 0
  const title = filtered ? 'No orders match these filters' : allProcessed ? "You're all caught up" : 'No orders in this workspace yet'
  const message = filtered
    ? `We found 0 matching orders out of ${totalOrders}. Try a different search or clear the active filters to see the full queue.`
    : allProcessed
      ? 'Every current order has been delivered or cancelled. New work will appear here as soon as it arrives.'
      : 'Orders created by your sales and checkout channels will appear here. Refresh after the first order is placed to see it in the queue.'

  return (
    <div role="status" style={{ padding: '76px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, textAlign: 'center' }}>
      <div aria-hidden="true" style={{ width: 64, height: 64, display: 'grid', placeItems: 'center', borderRadius: 18, background: filtered ? 'var(--blue-dim)' : 'var(--accent-dim)', color: filtered ? 'var(--blue)' : 'var(--accent)', fontSize: 30 }}>{filtered ? '⌕' : allProcessed ? '✓' : '○'}</div>
      <h3 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 430, lineHeight: 1.65, fontSize: 14 }}>{message}</p>
      {filtered ? (
        <button onClick={onClearFilters} style={primaryButtonStyle}>Clear filters</button>
      ) : (
        <button onClick={onRefresh} style={primaryButtonStyle}>Refresh orders</button>
      )}
    </div>
  )
}

function ErrorState({ error, onRetry }) {
  const details = getErrorDetails(error)
  return (
    <div role="alert" style={{ padding: '68px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, textAlign: 'center' }}>
      <div aria-hidden="true" style={{ width: 64, height: 64, display: 'grid', placeItems: 'center', borderRadius: 18, background: 'var(--red-dim)', color: 'var(--red)', fontSize: 29 }}>!</div>
      <h3 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)' }}>{details.title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 450, lineHeight: 1.65, fontSize: 14 }}>{details.message}</p>
      <p style={{ color: 'var(--text-muted)', maxWidth: 500, fontSize: 12, fontFamily: 'var(--mono)' }}>Technical detail: {error}</p>
      <button onClick={onRetry} style={primaryButtonStyle}>↻ Retry loading orders</button>
    </div>
  )
}

function getErrorDetails(error = '') {
  const normalized = error.toLowerCase()
  if (normalized.includes('503') || normalized.includes('server') || normalized.includes('service')) {
    return { title: 'Orders service is temporarily unavailable', message: 'The order service is not responding right now. Please retry in a moment; your existing workflow is still safe.' }
  }
  if (normalized.includes('network') || normalized.includes('offline') || normalized.includes('fetch')) {
    return { title: 'Unable to connect to orders', message: 'Check your internet connection, then retry. If you are offline, reconnect before continuing to process new orders.' }
  }
  if (normalized.includes('401') || normalized.includes('session') || normalized.includes('unauthorized')) {
    return { title: 'Your session has timed out', message: 'Please log in again to securely continue viewing the orders queue.' }
  }
  if (normalized.includes('403') || normalized.includes('permission')) {
    return { title: "You don't have permission to view these orders", message: 'Contact an Orderly administrator or your support team to request access.' }
  }
  if (normalized.includes('parse') || normalized.includes('data')) {
    return { title: "Order data can't be displayed right now", message: 'The service returned data in an unexpected format. Refresh to request a clean response.' }
  }
  return { title: 'Orders could not be loaded', message: 'The dashboard could not retrieve the order queue. Please retry, and contact support if the problem continues.' }
}

const primaryButtonStyle = {
  marginTop: 7,
  padding: '11px 20px',
  background: 'var(--accent)',
  border: 'none',
  borderRadius: 'var(--radius)',
  color: '#17120a',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
}

function Filters({ search, status, priorityOnly, onSearch, onStatus, onPriority, onClear }) {
  const active = search || status !== 'All statuses' || priorityOnly
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(30,35,51,0.35)' }}>
      <label style={{ flex: '1 1 220px', position: 'relative' }}>
        <span className="sr-only">Search orders</span>
        <input value={search} onChange={event => onSearch(event.target.value)} placeholder="Search by order ID or customer" style={inputStyle} />
      </label>
      <label>
        <span className="sr-only">Filter by status</span>
        <select value={status} onChange={event => onStatus(event.target.value)} style={inputStyle}>
          {STATUS_FILTERS.map(option => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13, padding: '0 8px' }}>
        <input type="checkbox" checked={priorityOnly} onChange={event => onPriority(event.target.checked)} />
        High priority only
      </label>
      {active && <button onClick={onClear} style={{ ...secondaryButtonStyle, marginLeft: 'auto' }}>Clear</button>}
    </div>
  )
}

const inputStyle = { minHeight: 38, width: '100%', padding: '0 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none' }
const secondaryButtonStyle = { minHeight: 38, padding: '0 13px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }

function SuccessState({ orders, onRefresh }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [priorityOnly, setPriorityOnly] = useState(false)
  const filteredOrders = useMemo(() => orders.filter(order => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || order.id.toLowerCase().includes(query) || order.customer.toLowerCase().includes(query)
    const matchesStatus = status === 'All statuses' || order.status === status
    const matchesPriority = !priorityOnly || isPriorityOrder(order)
    return matchesSearch && matchesStatus && matchesPriority
  }), [orders, priorityOnly, search, status])
  const filtersActive = Boolean(search.trim()) || status !== 'All statuses' || priorityOnly
  const clearFilters = () => {
    setSearch('')
    setStatus('All statuses')
    setPriorityOnly(false)
  }

  return (
    <section aria-label="Orders loaded" style={{ display: 'grid', gap: 20 }}>
      <SummaryMetrics orders={orders} />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Recent orders <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>{filteredOrders.length} of {orders.length}</span></h2>
            <p style={{ marginTop: 5, color: 'var(--text-muted)', fontSize: 12 }}>Scan priority and status to decide what needs attention next.</p>
          </div>
          <button onClick={onRefresh} style={secondaryButtonStyle}>↻ Refresh</button>
        </div>
        <Filters search={search} status={status} priorityOnly={priorityOnly} onSearch={setSearch} onStatus={setStatus} onPriority={setPriorityOnly} onClear={clearFilters} />
        {filteredOrders.length === 0 ? (
          <EmptyState filtered={filtersActive} totalOrders={orders.length} onClearFilters={clearFilters} onRefresh={onRefresh} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 1080, borderCollapse: 'collapse' }}>
              <TableHeader />
              <tbody>{filteredOrders.map(order => <OrderRow key={order.id} order={order} />)}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadOrders = () => {
    setLoading(true)
    setError(null)
    fetchOrders()
      .then(data => {
        setOrders(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Unknown order service error')
        setLoading(false)
      })
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 32px 64px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 34 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div aria-hidden="true" style={{ width: 38, height: 38, background: 'var(--accent)', color: '#17120a', borderRadius: 10, display: 'grid', placeItems: 'center', fontSize: 19 }}>▣</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>Orders</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage and track all customer orders in one place.</p>
        </div>
        {loading && <span aria-live="polite" style={{ color: 'var(--blue)', fontSize: 12, fontFamily: 'var(--mono)' }}>Loading live order queue…</span>}
      </div>
      {loading ? <LoadingState /> : error ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}><ErrorState error={error} onRetry={loadOrders} /></div>
      ) : <SuccessState orders={orders} onRefresh={loadOrders} />}
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
        @media (max-width: 720px) { main { padding-left: 16px !important; padding-right: 16px !important; } }
      `}</style>
    </main>
  )
}
