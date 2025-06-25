document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '../index.html';
  } else {
    fetchPayments();
    setupEventListeners();
  }
});

const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));

function setupEventListeners() {
  // Add payment button
  $('#addPaymentBtn').click(function() {
    paymentModal.show();
  });

  // Save payment
  $('#savePaymentBtn').click(savePayment);

  // Search functionality
  $('#searchPayments').on('input', function() {
    const searchTerm = $(this).val().toLowerCase();
    $('#paymentsTable tr').each(function() {
      const rowText = $(this).text().toLowerCase();
      $(this).toggle(rowText.includes(searchTerm));
    });
  });
}

function fetchPayments() {
  const token = localStorage.getItem('access_token');
  
  $('#paymentsTable').html('<tr><td colspan="7" class="text-center py-4"><span class="loading-spinner"></span> Loading payments...</td></tr>');
  
  $.ajax({
    url: 'http://127.0.0.1:8000/api/v1/payments/',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(data) {
      if (Array.isArray(data)) {
        populatePaymentsTable(data);
      } else {
        showPaymentsError();
      }
    },
    error: function(xhr) {
      console.error('Error fetching payments:', xhr);
      showPaymentsError();
    }
  });
}

function showPaymentsError() {
  $('#paymentsTable').html(`
    <tr>
      <td colspan="7" class="text-center py-4 text-danger">
        <i class="bi bi-exclamation-triangle-fill"></i> Failed to load payments.
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="fetchPayments()">Retry</button>
      </td>
    </tr>
  `);
}

function populatePaymentsTable(payments) {
  const paymentsTable = $('#paymentsTable');
  paymentsTable.empty();
  
  if (payments.length === 0) {
    paymentsTable.append('<tr><td colspan="7" class="text-center py-4">No payments found</td></tr>');
    return;
  }
  
  payments.forEach(payment => {
    const paymentDate = formatDate(payment.created_at);
    const statusBadge = getPaymentStatusBadge(payment.status);
    
    paymentsTable.append(`
      <tr>
        <td>#${payment.id || 'N/A'}</td>
        <td>#${payment.user_id || 'N/A'}</td>
        <td>#${payment.order_id || 'N/A'}</td>
        <td>${payment.amount?.toFixed(2) || '0.00'}</td>
        <td>${statusBadge}</td>
        <td>${paymentDate}</td>
      </tr>
    `);
  });
}

function getPaymentStatusBadge(status) {
  let badgeClass = '';
  switch((status || '').toLowerCase()) {
    case 'paid':
      badgeClass = 'badge-success';
      break;
    case 'pending':
      badgeClass = 'badge-warning';
      break;
    case 'failed':
      badgeClass = 'badge-danger';
      break;
    case 'refunded':
      badgeClass = 'badge-info';
      break;
    default:
      badgeClass = 'badge-secondary';
  }
  return `<span class="badge ${badgeClass}">${status || 'Unknown'}</span>`;
}

function savePayment() {
  const token = localStorage.getItem('access_token');
  
  const data = {
    user_id: parseInt($('#paymentUserId').val()),
    order_id: parseInt($('#paymentOrderId').val()),
    amount: parseFloat($('#paymentAmount').val()),
    status: $('#paymentStatus').val()
  };

  $.ajax({
    url: 'http://127.0.0.1:8000/api/v1/payments/',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data),
    success: function() {
      paymentModal.hide();
      $('#paymentForm')[0].reset();
      fetchPayments();
    },
    error: function(xhr) {
      console.error('Error saving payment:', xhr);
      alert('Failed to save payment');
    }
  });
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function logout() {
  localStorage.removeItem('access_token');
  window.location.href = '../index.html';
}