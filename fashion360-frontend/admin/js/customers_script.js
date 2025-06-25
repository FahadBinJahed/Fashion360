document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '/login.html';
  } else {
    fetchCustomers();
    setupEventListeners();
  }
});

let currentCustomerId = null;
const customerModal = new bootstrap.Modal(document.getElementById('customerModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

function setupEventListeners() {
  // Add customer button
  $('#addCustomerBtn').click(function() {
    $('#modalTitle').text('Add Customer');
    $('#customerForm')[0].reset();
    $('#customerId').val('');
    customerModal.show();
  });

  // Save customer
  $('#saveCustomerBtn').click(saveCustomer);

  // Confirm delete
  $('#confirmDeleteBtn').click(deleteCustomer);

  // Search functionality
  $('#searchCustomers').on('input', function() {
    const searchTerm = $(this).val().toLowerCase();
    $('#customersTable tr').each(function() {
      const rowText = $(this).text().toLowerCase();
      $(this).toggle(rowText.includes(searchTerm));
    });
  });
}

function fetchCustomers() {
  const token = localStorage.getItem('access_token');
  
  $('#customersTable').html('<tr><td colspan="6" class="text-center py-4"><span class="loading-spinner"></span> Loading customers...</td></tr>');
  
  $.ajax({
    url: 'http://127.0.0.1:8000/api/v1/api/v1/users/',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(data) {
      if (Array.isArray(data)) {
        populateCustomersTable(data);
      } else {
        showCustomersError();
      }
    },
    error: function(xhr) {
      console.error('Error fetching customers:', xhr);
      showCustomersError();
    }
  });
}

function showCustomersError() {
  $('#customersTable').html(`
    <tr>
      <td colspan="6" class="text-center py-4 text-danger">
        <i class="bi bi-exclamation-triangle-fill"></i> Failed to load customers.
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="fetchCustomers()">Retry</button>
      </td>
    </tr>
  `);
}

function populateCustomersTable(customers) {
  const customersTable = $('#customersTable');
  customersTable.empty();
  
  if (customers.length === 0) {
    customersTable.append('<tr><td colspan="6" class="text-center py-4">No customers found</td></tr>');
    return;
  }
  
  customers.forEach(customer => {
    const createdAt = formatDate(customer.created_at);
    
    customersTable.append(`
      <tr>
        <td>${customer.name || 'N/A'}</td>
        <td>${customer.email || 'N/A'}</td>
        <td>${customer.phone || 'N/A'}</td>
        <td>${customer.address || 'N/A'}</td>
        <td>${createdAt}</td>
        <td class="customer-actions">
          <button class="btn btn-sm btn-outline-primary edit-customer-btn" data-customer-id="${customer.id}">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn btn-sm btn-outline-danger delete-customer-btn" data-customer-id="${customer.id}">
            <i class="bi bi-trash"></i> Delete
          </button>
        </td>
      </tr>
    `);
  });

  // Set up edit buttons
  $('.edit-customer-btn').click(function() {
    const customerId = $(this).data('customer-id');
    editCustomer(customerId);
  });

  // Set up delete buttons
  $('.delete-customer-btn').click(function() {
    currentCustomerId = $(this).data('customer-id');
    deleteModal.show();
  });
}

function editCustomer(customerId) {
  const token = localStorage.getItem('access_token');
  
  $.ajax({
    url: `http://127.0.0.1:8000/api/v1/api/v1/users/${customerId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(customer) {
      $('#modalTitle').text('Edit Customer');
      $('#customerId').val(customer.id);
      $('#customerName').val(customer.name);
      $('#customerEmail').val(customer.email);
      $('#customerPhone').val(customer.phone);
      $('#customerAddress').val(customer.address);
      customerModal.show();
    },
    error: function(xhr) {
      console.error('Error fetching customer:', xhr);
      alert('Failed to load customer details');
    }
  });
}

function saveCustomer() {
  const token = localStorage.getItem('access_token');
  const customerId = $('#customerId').val();
  const method = customerId ? 'PUT' : 'POST';
  const url = customerId 
    ? `http://127.0.0.1:8000/api/v1/api/v1/users/${customerId}`
    : 'http://127.0.0.1:8000/api/v1/api/v1/users/';

  const data = {
    name: $('#customerName').val(),
    email: $('#customerEmail').val(),
    phone: $('#customerPhone').val(),
    address: $('#customerAddress').val()
  };

  $.ajax({
    url: url,
    method: method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data),
    success: function() {
      customerModal.hide();
      fetchCustomers();
    },
    error: function(xhr) {
      console.error('Error saving customer:', xhr);
      alert('Failed to save customer');
    }
  });
}

function deleteCustomer() {
  const token = localStorage.getItem('access_token');
  
  $.ajax({
    url: `http://127.0.0.1:8000/api/v1/api/v1/users/${currentCustomerId}`,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function() {
      deleteModal.hide();
      fetchCustomers();
    },
    error: function(xhr) {
      console.error('Error deleting customer:', xhr);
      alert('Failed to delete customer');
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