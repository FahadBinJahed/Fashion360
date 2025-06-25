document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '/index.html';
  } else {
    fetchDeliveries();
  }
});

function fetchDeliveries() {
  const token = localStorage.getItem('access_token');
  
  $('#deliveriesTable').html('<tr><td colspan="7" class="text-center py-4"><span class="loading-spinner"></span> Loading deliveries...</td></tr>');
  
  $.ajax({
    url: 'http://127.0.0.1:8000/api/v1/deliveries/',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(data) {
      if (Array.isArray(data)) {
        populateDeliveriesTable(data);
      } else {
        console.error('Invalid deliveries data format:', data);
        showDeliveriesError();
      }
    },
    error: function(xhr) {
      console.error('Error fetching deliveries:', xhr);
      showDeliveriesError();
    }
  });
}

function showDeliveriesError() {
  $('#deliveriesTable').html(`
    <tr>
      <td colspan="7" class="text-center py-4 text-danger">
        <i class="bi bi-exclamation-triangle-fill"></i> Failed to load deliveries.
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="fetchDeliveries()">Retry</button>
      </td>
    </tr>
  `);
}

function populateDeliveriesTable(deliveries) {
  const deliveriesTable = $('#deliveriesTable');
  deliveriesTable.empty();
  
  if (deliveries.length === 0) {
    deliveriesTable.append('<tr><td colspan="7" class="text-center py-4">No deliveries found</td></tr>');
    return;
  }
  
  deliveries.forEach(delivery => {
    const shippedAt = formatDate(delivery.shipped_at);
    const deliveredAt = formatDate(delivery.delivered_at);
    const createdAt = formatDate(delivery.created_at);
    const statusBadge = getDeliveryStatusBadge(delivery.status || 'unknown');
    
    deliveriesTable.append(`
      <tr>
        <td>#${delivery.id || 'N/A'}</td>
        <td>#${delivery.order_id || 'N/A'}</td>
        <td>${statusBadge}</td>
        <td>${shippedAt}</td>
        <td>${deliveredAt}</td>
        <td>${createdAt}</td>
        <td class="delivery-actions">
          <button class="btn btn-sm btn-outline-primary view-delivery-btn" data-delivery-id="${delivery.id}">
            <i class="bi bi-eye"></i> View
          </button>
        </td>
      </tr>
    `);
  });
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function getDeliveryStatusBadge(status) {
  let badgeClass = '';
  let displayText = status || 'Unknown';
  
  switch((status || '').toLowerCase()) {
    case 'pending':
      badgeClass = 'badge-pending';
      break;
    case 'processing':
      badgeClass = 'badge-processing';
      break;
    case 'shipped':
      badgeClass = 'badge-processing'; 
      displayText = 'Shipped';
      break;
    case 'delivered':
      badgeClass = 'badge-completed';
      displayText = 'Delivered'; 
      break;
    case 'cancelled':
      badgeClass = 'badge-cancelled'; 
      break;
    default:
      badgeClass = 'badge-secondary'; 
  }
  
  return `<span class="badge ${badgeClass}">${displayText}</span>`;
}

$(document).on('click', '.view-delivery-btn', function() {
  const deliveryId = $(this).data('delivery-id');
  window.location.href = `delivery-details.html?id=${deliveryId}`;
});

$('#searchDeliveries').on('input', function() {
  const searchTerm = $(this).val().toLowerCase();
  $('#deliveriesTable tr').each(function() {
    const rowText = $(this).text().toLowerCase();
    $(this).toggle(rowText.includes(searchTerm));
  });
});

function logout() {
  localStorage.removeItem('access_token');
  window.location.href = '../index.html';
}