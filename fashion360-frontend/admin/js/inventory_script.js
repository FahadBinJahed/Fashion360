document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '/login.html';
  } else {
    fetchInventory();
    setupEventListeners();
  }
});

let currentItemId = null;
const inventoryModal = new bootstrap.Modal(document.getElementById('inventoryModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

function setupEventListeners() {
  // Add item button
  $('#addInventoryBtn').click(function() {
    $('#modalTitle').text('Add Inventory Item');
    $('#inventoryForm')[0].reset();
    $('#itemId').val('');
    inventoryModal.show();
  });

  // Save item
  $('#saveInventoryBtn').click(saveInventoryItem);

  // Confirm delete
  $('#confirmDeleteBtn').click(deleteInventoryItem);

  // Search functionality
  $('#searchInventory').on('input', function() {
    const searchTerm = $(this).val().toLowerCase();
    $('#inventoryTable tr').each(function() {
      const rowText = $(this).text().toLowerCase();
      $(this).toggle(rowText.includes(searchTerm));
    });
  });
}

function fetchInventory() {
  const token = localStorage.getItem('access_token');
  
  $('#inventoryTable').html('<tr><td colspan="6" class="text-center py-4"><span class="loading-spinner"></span> Loading inventory...</td></tr>');
  
  $.ajax({
    url: 'http://127.0.0.1:8000/api/v1/inventory/',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(data) {
      if (Array.isArray(data)) {
        populateInventoryTable(data);
      } else {
        showInventoryError();
      }
    },
    error: function(xhr) {
      console.error('Error fetching inventory:', xhr);
      showInventoryError();
    }
  });
}

function showInventoryError() {
  $('#inventoryTable').html(`
    <tr>
      <td colspan="6" class="text-center py-4 text-danger">
        <i class="bi bi-exclamation-triangle-fill"></i> Failed to load inventory.
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="fetchInventory()">Retry</button>
      </td>
    </tr>
  `);
}

function populateInventoryTable(items) {
  const inventoryTable = $('#inventoryTable');
  inventoryTable.empty();
  
  if (items.length === 0) {
    inventoryTable.append('<tr><td colspan="6" class="text-center py-4">No inventory items found</td></tr>');
    return;
  }
  
  items.forEach(item => {
    const lastUpdated = formatDate(item.updated_at);
    
    inventoryTable.append(`
      <tr>
        <td>${item.sku || 'N/A'}</td>
        <td>${item.name || 'N/A'}</td>
        <td>
          <span class="badge ${getQuantityBadgeClass(item.quantity)}">
            ${item.quantity}
          </span>
        </td>
        <td>${item.location || 'N/A'}</td>
        <td>${lastUpdated}</td>
        <td class="inventory-actions">
          <button class="btn btn-sm btn-outline-primary edit-item-btn" data-item-id="${item.id}">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn btn-sm btn-outline-danger delete-item-btn" data-item-id="${item.id}">
            <i class="bi bi-trash"></i> Delete
          </button>
        </td>
      </tr>
    `);
  });

  // Set up edit buttons
  $('.edit-item-btn').click(function() {
    const itemId = $(this).data('item-id');
    editInventoryItem(itemId);
  });

  // Set up delete buttons
  $('.delete-item-btn').click(function() {
    currentItemId = $(this).data('item-id');
    deleteModal.show();
  });
}

function getQuantityBadgeClass(quantity) {
  if (quantity <= 0) return 'badge-danger';
  if (quantity <= 5) return 'badge-warning';
  return 'badge-success';
}

function editInventoryItem(itemId) {
  const token = localStorage.getItem('access_token');
  
  $.ajax({
    url: `http://127.0.0.1:8000/api/v1/inventory/${itemId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(item) {
      $('#modalTitle').text('Edit Inventory Item');
      $('#itemId').val(item.id);
      $('#sku').val(item.sku);
      $('#name').val(item.name);
      $('#quantity').val(item.quantity);
      $('#location').val(item.location);
      $('#description').val(item.description);
      inventoryModal.show();
    },
    error: function(xhr) {
      console.error('Error fetching item:', xhr);
      alert('Failed to load item details');
    }
  });
}

function saveInventoryItem() {
  const token = localStorage.getItem('access_token');
  const itemId = $('#itemId').val();
  const method = itemId ? 'PUT' : 'POST';
  const url = itemId 
    ? `http://127.0.0.1:8000/api/v1/inventory/${itemId}`
    : 'http://127.0.0.1:8000/api/v1/inventory/';

  const data = {
    sku: $('#sku').val(),
    name: $('#name').val(),
    quantity: parseInt($('#quantity').val()),
    location: $('#location').val(),
    description: $('#description').val()
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
      inventoryModal.hide();
      fetchInventory();
    },
    error: function(xhr) {
      console.error('Error saving item:', xhr);
      alert('Failed to save item');
    }
  });
}

function deleteInventoryItem() {
  const token = localStorage.getItem('access_token');
  
  $.ajax({
    url: `http://127.0.0.1:8000/api/v1/inventory/${currentItemId}`,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function() {
      deleteModal.hide();
      fetchInventory();
    },
    error: function(xhr) {
      console.error('Error deleting item:', xhr);
      alert('Failed to delete item');
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