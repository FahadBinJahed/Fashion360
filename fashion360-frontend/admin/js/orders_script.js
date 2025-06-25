// Check authentication
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '/login.html';
  } else {
    fetchOrders();
    initializeModal();
  }
});

// Initialize modal event listeners
function initializeModal() {
  const modal = document.getElementById('orderDetailsModal');
  modal.addEventListener('hidden.bs.modal', function() {
    $('#orderDetailsModal').find('.modal-body').html('');
  });
}

// Fetch all orders
function fetchOrders() {
  const token = localStorage.getItem('access_token');
  
  $('#ordersTable').html('<tr><td colspan="7" class="text-center py-4"><span class="loading-spinner"></span> Loading orders...</td></tr>');
  
  $.ajax({
    url: 'http://127.0.0.1:8000/api/v1/api/v1/orders/',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(data) {
      if (Array.isArray(data)) {
        populateOrdersTable(data);
      } else {
        console.error('Invalid orders data format:', data);
        showOrdersError();
      }
    },
    error: function(xhr) {
      console.error('Error fetching orders:', xhr);
      showOrdersError();
    }
  });
}

function showOrdersError() {
  $('#ordersTable').html(`
    <tr>
      <td colspan="7" class="text-center py-4 text-danger">
        <i class="bi bi-exclamation-triangle-fill"></i> Failed to load orders.
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="fetchOrders()">Retry</button>
      </td>
    </tr>
  `);
}

// Populate orders table
function populateOrdersTable(orders) {
  const ordersTable = $('#ordersTable');
  ordersTable.empty();
  
  if (orders.length === 0) {
    ordersTable.append('<tr><td colspan="7" class="text-center py-4">No orders found</td></tr>');
    return;
  }
  
  orders.forEach(order => {
    const totalAmount = calculateOrderTotal(order.items || []);
    const statusBadge = getStatusBadge(order.status || 'unknown');
    const orderDate = formatDate(order.created_at);
    
    ordersTable.append(`
      <tr>
        <td>#${order.id || 'N/A'}</td>
        <td>${order.customer_name || 'N/A'}</td>
        <td>${order.items ? order.items.length : 0}</td>
        <td>${totalAmount.toFixed(2)}</td>
        <td>${statusBadge}</td>
        <td>${orderDate}</td>
        <td class="order-actions">
          <button class="btn btn-sm btn-outline-primary view-order-btn" data-order-id="${order.id}">
            <i class="bi bi-eye"></i> View
          </button>
        </td>
      </tr>
    `);
  });
}


// Helper functions
function calculateOrderTotal(items) {
  if (!items || !items.length) return 0;
  return items.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
}

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

$(document).on('click', '.view-order-btn', function() {
  const orderId = $(this).data('order-id');
  window.location.href = `order-details.html?id=${orderId}`;
});

// Search functionality
$('#searchOrders').on('input', function() {
  const searchTerm = $(this).val().toLowerCase();
  $('#ordersTable tr').each(function() {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(searchTerm));
  });
});

// Logout function
function logout() {
  localStorage.removeItem('access_token');
  window.location.href = '../index.html';
}