document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '/login.html';
  } else {
    fetchProducts();
    fetchCategories(); // Load categories for dropdown
    setupEventListeners();
  }
});

let currentProductId = null;
let categories = [];
const productModal = new bootstrap.Modal(document.getElementById('productModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

function setupEventListeners() {
  // Add product button
  $('#addProductBtn').click(function() {
    $('#modalTitle').text('Add Product');
    $('#productForm')[0].reset();
    $('#productId').val('');
    productModal.show();
  });

  // Save product
  $('#saveProductBtn').click(saveProduct);

  // Confirm delete
  $('#confirmDeleteBtn').click(deleteProduct);

  // Search functionality
  $('#searchProducts').on('input', function() {
    const searchTerm = $(this).val().toLowerCase();
    $('#productsTable tr').each(function() {
      const rowText = $(this).text().toLowerCase();
      $(this).toggle(rowText.includes(searchTerm));
    });
  });
}

function fetchProducts() {
  const token = localStorage.getItem('access_token');
  
  $('#productsTable').html('<tr><td colspan="7" class="text-center py-4"><span class="loading-spinner"></span> Loading products...</td></tr>');
  
  $.ajax({
    url: 'http://127.0.0.1:8000/api/v1/products/',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(data) {
      if (Array.isArray(data)) {
        populateProductsTable(data);
      } else {
        showProductsError();
      }
    },
    error: function(xhr) {
      console.error('Error fetching products:', xhr);
      showProductsError();
    }
  });
}

function fetchCategories() {
  const token = localStorage.getItem('access_token');
  
  $.ajax({
    url: 'http://127.0.0.1:8000/api/v1/categories/',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(data) {
      if (Array.isArray(data)) {
        categories = data;
        populateCategoryDropdown();
      }
    },
    error: function(xhr) {
      console.error('Error fetching categories:', xhr);
    }
  });
}

function populateCategoryDropdown() {
  const dropdown = $('#productCategory');
  dropdown.empty();
  dropdown.append('<option value="">Select a category</option>');
  
  categories.forEach(category => {
    dropdown.append(`<option value="${category.id}">${category.name}</option>`);
  });
}

function showProductsError() {
  $('#productsTable').html(`
    <tr>
      <td colspan="7" class="text-center py-4 text-danger">
        <i class="bi bi-exclamation-triangle-fill"></i> Failed to load products.
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="fetchProducts()">Retry</button>
      </td>
    </tr>
  `);
}

function populateProductsTable(products) {
  const productsTable = $('#productsTable');
  productsTable.empty();
  
  if (products.length === 0) {
    productsTable.append('<tr><td colspan="7" class="text-center py-4">No products found</td></tr>');
    return;
  }
  
  products.forEach(product => {
    const lastUpdated = formatDate(product.updated_at);
    const category = categories.find(c => c.id === product.category_id) || {};
    
    productsTable.append(`
      <tr>
        <td>${product.name || 'N/A'}</td>
        <td>${product.sku || 'N/A'}</td>
        <td>${product.price?.toFixed(2) || '0.00'}</td>
        <td>
          <span class="badge ${getStockBadgeClass(product.stock_quantity)}">
            ${product.stock_quantity}
          </span>
        </td>
        <td>${category.name || 'Uncategorized'}</td>
        <td>${lastUpdated}</td>
        <td class="product-actions">
          <button class="btn btn-sm btn-outline-primary edit-product-btn" data-product-id="${product.id}">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn btn-sm btn-outline-danger delete-product-btn" data-product-id="${product.id}">
            <i class="bi bi-trash"></i> Delete
          </button>
        </td>
      </tr>
    `);
  });

  // Set up edit buttons
  $('.edit-product-btn').click(function() {
    const productId = $(this).data('product-id');
    editProduct(productId);
  });

  // Set up delete buttons
  $('.delete-product-btn').click(function() {
    currentProductId = $(this).data('product-id');
    deleteModal.show();
  });
}

function getStockBadgeClass(quantity) {
  if (quantity <= 0) return 'badge-danger';
  if (quantity <= 5) return 'badge-warning';
  return 'badge-success';
}

function editProduct(productId) {
  const token = localStorage.getItem('access_token');
  
  $.ajax({
    url: `http://127.0.0.1:8000/api/v1/products/${productId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(product) {
      $('#modalTitle').text('Edit Product');
      $('#productId').val(product.id);
      $('#productName').val(product.name);
      $('#productSku').val(product.sku);
      $('#productPrice').val(product.price);
      $('#productStock').val(product.stock_quantity);
      $('#productCategory').val(product.category_id);
      $('#productDescription').val(product.description);
      productModal.show();
    },
    error: function(xhr) {
      console.error('Error fetching product:', xhr);
      alert('Failed to load product details');
    }
  });
}

function saveProduct() {
  const token = localStorage.getItem('access_token');
  const productId = $('#productId').val();
  const method = productId ? 'PUT' : 'POST';
  const url = productId 
    ? `http://127.0.0.1:8000/api/v1/products/${productId}`
    : 'http://127.0.0.1:8000/api/v1/products/';

  const data = {
    name: $('#productName').val(),
    sku: $('#productSku').val(),
    price: parseFloat($('#productPrice').val()),
    stock_quantity: parseInt($('#productStock').val()),
    description: $('#productDescription').val(),
    category_id: parseInt($('#productCategory').val()),
    image_url: "" 
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
      productModal.hide();
      fetchProducts();
    },
    error: function(xhr) {
      console.error('Error saving product:', xhr);
      alert('Failed to save product');
    }
  });
}

function deleteProduct() {
  const token = localStorage.getItem('access_token');
  
  $.ajax({
    url: `http://127.0.0.1:8000/api/v1/products/${currentProductId}`,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function() {
      deleteModal.hide();
      fetchProducts();
    },
    error: function(xhr) {
      console.error('Error deleting product:', xhr);
      alert('Failed to delete product');
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