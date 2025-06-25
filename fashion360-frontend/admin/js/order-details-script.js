document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '../index.html';
    return;
  }

  // Get order ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('id');
  
  if (orderId) {
    loadOrderDetails(orderId);
  } else {
    showError('No order ID specified');
  }
});

function loadOrderDetails(orderId) {
  const token = localStorage.getItem('access_token');
  
  // Show loading, hide content and error
  $('#loadingSpinner').show();
  $('#orderDetailsContent').hide();
  $('#errorMessage').hide();

  $.ajax({
    url: `http://127.0.0.1:8000/api/v1/api/v1/orders/${orderId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(order) {
      if (order && order.id) {
        populateOrderDetails(order);
        $('#loadingSpinner').hide();
        $('#orderDetailsContent').show();
      } else {
        showError('Invalid order data format');
      }
    },
    error: function(xhr) {
      console.error('Error fetching order details:', xhr);
      showError(xhr.status === 404 ? 'Order not found' : 'Failed to load order details');
    }
  });
}

function populateOrderDetails(order) {
  $('#orderIdTitle').text(``);
  $('#detailCustomerName').text(order.customer_name || 'N/A');
  $('#detailCustomerEmail').text(order.customer_email || 'N/A');
  $('#detailOrderStatus').html(getStatusBadge(order.status || 'unknown'));
  $('#detailOrderDate').text(formatDate(order.created_at) || 'N/A');

  const itemsTable = $('#orderItemsTable');
  itemsTable.empty();

  let orderTotal = 0;
  if (order.items && order.items.length > 0) {
    order.items.forEach(item => {
      const subtotal = (item.price || 0) * (item.quantity || 0);
      orderTotal += subtotal;

      itemsTable.append(`
        <tr>
          <td>${item.product_id || 'N/A'}</td>
          <td>${item.quantity || 0}</td>
          <td>${(item.price || 0).toFixed(2)}</td>
          <td>${subtotal.toFixed(2)}</td>
        </tr>
      `);
    });
  } else {
    itemsTable.append('<tr><td colspan="5" class="text-center py-2">No items found</td></tr>');
  }

  $('#orderTotal').text(`${orderTotal.toFixed(2)}`);
}

function showError(message) {
  $('#loadingSpinner').hide();
  $('#orderDetailsContent').hide();
  $('#errorText').text(message);
  $('#errorMessage').show();
}

// Helper functions (same as before)
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function getStatusBadge(status) {
  let badgeClass = '';
  switch((status || '').toLowerCase()) {
    case 'pending':
      badgeClass = 'badge-pending';
      break;
    case 'processing':
      badgeClass = 'badge-processing';
      break;
    case 'completed':
      badgeClass = 'badge-completed';
      break;
    case 'cancelled':
      badgeClass = 'badge-danger';
      break;
    default:
      badgeClass = 'badge-secondary';
  }
  return `<span class="badge ${badgeClass}">${status || 'Unknown'}</span>`;
}