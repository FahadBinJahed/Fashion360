document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '/index.html';
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const deliveryId = urlParams.get('id');
  
  if (deliveryId) {
    loadDeliveryDetails(deliveryId);
  } else {
    showError('No delivery ID specified');
  }
});

function loadDeliveryDetails(deliveryId) {
  const token = localStorage.getItem('access_token');
  
  $('#loadingSpinner').show();
  $('#deliveryDetailsContent').hide();
  $('#errorMessage').hide();

  $.ajax({
    url: `http://127.0.0.1:8000/api/v1/deliveries/${deliveryId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(delivery) {
      if (delivery && delivery.id) {
        populateDeliveryDetails(delivery);
        $('#loadingSpinner').hide();
        $('#deliveryDetailsContent').show();
      } else {
        showError('Invalid delivery data format');
      }
    },
    error: function(xhr) {
      console.error('Error fetching delivery details:', xhr);
      showError(xhr.status === 404 ? 'Delivery not found' : 'Failed to load delivery details');
    }
  });
}

function populateDeliveryDetails(delivery) {
  $('#deliveryIdTitle').text(``);
  $('#detailOrderId').text(`#${delivery.order_id || 'N/A'}`);
  $('#detailStatus').html(getDeliveryStatusBadge(delivery.status || 'unknown'));
  $('#detailShippedAt').text(formatDate(delivery.shipped_at) || 'N/A');
  $('#detailDeliveredAt').text(formatDate(delivery.delivered_at) || 'N/A');
  $('#detailCreatedAt').text(formatDate(delivery.created_at) || 'N/A');
  $('#detailUpdatedAt').text(formatDate(delivery.updated_at) || 'N/A');
}

function showError(message) {
  $('#loadingSpinner').hide();
  $('#deliveryDetailsContent').hide();
  $('#errorText').text(message);
  $('#errorMessage').show();
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function getDeliveryStatusBadge(status) {
  let badgeClass = '';
  switch((status || '').toLowerCase()) {
    case 'pending':
      badgeClass = 'badge-warning';
      break;
    case 'processing':
      badgeClass = 'badge-info';
      break;
    case 'shipped':
      badgeClass = 'badge-primary';
      break;
    case 'delivered':
      badgeClass = 'badge-success';
      break;
    case 'cancelled':
      badgeClass = 'badge-danger';
      break;
    default:
      badgeClass = 'badge-secondary';
  }
  return `<span class="badge ${badgeClass}">${status || 'Unknown'}</span>`;
}