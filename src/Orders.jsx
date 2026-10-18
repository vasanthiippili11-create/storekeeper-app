import { useEffect, useState } from 'react'

function Orders() {
    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState('All')
    const [amountFilter, setAmountFilter] = useState('')
    const [showDigest, setShowDigest] = useState(false)

    useEffect(() => {
        fetch('/orders.json')
            .then((response) => {
                if (!response.ok) throw new Error('Could not load orders')
                return response.json()
            })
            .then(setOrders)
            .catch((error) => console.error('Error fetching orders:', error))
    }, [])

    const getAmount = (order) =>
        parseFloat(String(order.amount).replace(/[$,]/g, '')) || 0

    const filteredOrders = orders.filter((order) => {
        const statusMatch = filter === 'All' || order.status === filter
        const amountMatch =
            amountFilter === '' || getAmount(order) >= Number(amountFilter)

        return statusMatch && amountMatch
    })

    const topCustomer = filteredOrders.reduce((top, order) => {
        const currentAmount = getAmount(order)

        return !top || currentAmount > top.amount
            ? { name: order.customer, amount: currentAmount }
            : top
    }, null)

    const totalAmount = filteredOrders.reduce(
        (total, order) => total + getAmount(order),
        0
    )

    const digestHtml = `
    <div style="font-family:Arial,sans-serif;color:#263238;max-width:650px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden">
      <div style="background:#d84315;color:white;padding:24px">
        <h1 style="margin:0;font-size:25px">Storekeeper Digest Email</h1>
        <p style="margin:8px 0 0">Your order summary</p>
      </div>
      <div style="padding:24px">
        <h2 style="color:#d84315">Order Summary</h2>
        <p><strong>Total orders:</strong> ${filteredOrders.length}</p>
        <p><strong>Total order value:</strong> $${totalAmount.toFixed(2)}</p>
        <p><strong>Top customer:</strong> ${topCustomer
            ? `${topCustomer.name} ($${topCustomer.amount.toFixed(2)})`
            : 'No orders'
        }</p>
        <h2 style="color:#d84315">Order Details</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:#fbe9e7">
              <th style="padding:10px;border:1px solid #ddd;text-align:left">Order</th>
              <th style="padding:10px;border:1px solid #ddd;text-align:left">Customer</th>
              <th style="padding:10px;border:1px solid #ddd;text-align:left">Amount</th>
              <th style="padding:10px;border:1px solid #ddd;text-align:left">Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredOrders.map((order) => `
              <tr>
                <td style="padding:10px;border:1px solid #ddd">${order.order}</td>
                <td style="padding:10px;border:1px solid #ddd">${order.customer}</td>
                <td style="padding:10px;border:1px solid #ddd">${order.amount}</td>
                <td style="padding:10px;border:1px solid #ddd">${order.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="color:#777;font-size:12px;margin-top:24px">Storekeeper · Order management digest</p>
      </div>
    </div>
  `

    const sendDigest = () => {
        const subject = encodeURIComponent('Storekeeper Digest Email')
        const body = encodeURIComponent(
            `Storekeeper Digest\n\n` +
            `Total orders: ${filteredOrders.length}\n` +
            `Total order value: $${totalAmount.toFixed(2)}\n` +
            `Top customer: ${topCustomer?.name || 'No orders'}\n\n` +
            filteredOrders.map((order) =>
                `Order ${order.order} | ${order.customer} | ${order.amount} | ${order.status}`
            ).join('\n')
        )

        window.location.href = `mailto:?subject=${subject}&body=${body}`
    }

    return (
        <main className="orders-page">
            <h2>Orders</h2>

            <div className="filters">
                {['All', 'Open', 'Shipped'].map((status) => (
                    <button
                        key={status}
                        type="button"
                        className={filter === status ? 'selected' : ''}
                        onClick={() => setFilter(status)}
                    >
                        {status}
                    </button>
                ))}

                <input
                    type="number"
                    min="0"
                    placeholder="Filter by amount"
                    value={amountFilter}
                    onChange={(event) => setAmountFilter(event.target.value)}
                />
            </div>

            {topCustomer && (
                <p className="top-customer">
                    Top customer: {topCustomer.name} — ${topCustomer.amount.toFixed(2)}
                </p>
            )}

            <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                <button type="button" onClick={() => setShowDigest(!showDigest)}>
                    {showDigest ? 'Hide Email Digest' : 'Preview Email Digest'}
                </button>

                <button type="button" onClick={sendDigest}>
                    Prepare Email
                </button>
            </div>

            {showDigest && (
                <div>
                    <div style={{ marginBottom: '12px' }}>
                        <strong>Subject:</strong> Storekeeper Digest Email
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: digestHtml }} />
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Ordered at</th>
                        <th>Product(s)</th>
                        <th>Amount</th>
                        <th>Payment status</th>
                        <th>Order status</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.order}>
                            <td>{order.order}</td>
                            <td>{order.customer}</td>
                            <td>{order.orderedAt}</td>
                            <td>{order.products}</td>
                            <td>{order.amount}</td>
                            <td>{order.payment}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}

export default Orders
