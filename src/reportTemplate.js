function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildReportHtml(reportData, orders) {
  const today = new Date().toISOString().split("T")[0];

  const topProductsRows = reportData.topProducts
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.product)}</td>
          <td>${item.order_count}</td>
          <td>$${Number(item.revenue).toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  const ordersRows = orders
    .map(
      (order) => `
        <tr>
          <td>${order.id}</td>
          <td>${escapeHtml(order.customer)}</td>
          <td>${escapeHtml(order.product)}</td>
          <td>$${Number(order.amount).toFixed(2)}</td>
          <td>${escapeHtml(order.created_at)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />

        <title>LittleShop Sales Report</title>

        <style>
          @page {
            size: A4;
            margin: 18mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            color: #222;
            font-size: 12px;
            line-height: 1.4;
          }

          h1 {
            margin: 0 0 4px;
            font-size: 24px;
          }

          h2 {
            margin-top: 28px;
            margin-bottom: 10px;
            font-size: 17px;
          }

          .date {
            color: #666;
            margin-bottom: 24px;
          }

          .summary {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
          }

          .summary-card {
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 14px;
          }

          .summary-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
          }

          .summary-value {
            margin-top: 4px;
            font-size: 20px;
            font-weight: bold;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          thead {
            display: table-header-group;
          }

          th {
            background: #f1f1f1;
            font-weight: bold;
            text-align: left;
          }

          th,
          td {
            border: 1px solid #ddd;
            padding: 7px;
          }

          tr {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .orders-table {
            font-size: 10px;
          }

          .orders-table th,
          .orders-table td {
            padding: 5px;
          }
        </style>
      </head>

      <body>
        <h1>LittleShop Sales Report</h1>

        <div class="date">
          Report date: ${today}
        </div>

        <div class="summary">
          <div class="summary-card">
            <div class="summary-label">
              Total Orders
            </div>

            <div class="summary-value">
              ${reportData.totalOrders}
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-label">
              Total Revenue
            </div>

            <div class="summary-value">
              $${Number(reportData.totalRevenue).toFixed(2)}
            </div>
          </div>
        </div>

        <h2>Top 5 Products by Revenue</h2>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Orders</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            ${topProductsRows}
          </tbody>
        </table>

        <h2>Orders — All Records</h2>

        <table class="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            ${ordersRows}
          </tbody>
        </table>
      </body>
    </html>
  `;
}