document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '/login.html';
  } else {
    fetchCategories();
    setupEventListeners();
  }
});

let currentCategoryId = null;
const categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

function setupEventListeners() {
  // Add category button
  $('#addCategoryBtn').click(function() {
    $('#modalTitle').text('Add Category');
    $('#categoryForm')[0].reset();
    $('#categoryId').val('');
    categoryModal.show();
  });

  // Save category
  $('#saveCategoryBtn').click(saveCategory);

  // Confirm delete
  $('#confirmDeleteBtn').click(deleteCategory);

  // Search functionality
  $('#searchCategories').on('input', function() {
    const searchTerm = $(this).val().toLowerCase();
    $('#categoriesTable tr').each(function() {
      const rowText = $(this).text().toLowerCase();
      $(this).toggle(rowText.includes(searchTerm));
    });
  });
}

function fetchCategories() {
  const token = localStorage.getItem('access_token');
  
  $('#categoriesTable').html('<tr><td colspan="5" class="text-center py-4"><span class="loading-spinner"></span> Loading categories...</td></tr>');
  
  $.ajax({
    url: 'http://127.0.0.1:8000/api/v1/categories/',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(data) {
      if (Array.isArray(data)) {
        populateCategoriesTable(data);
      } else {
        showCategoriesError();
      }
    },
    error: function(xhr) {
      console.error('Error fetching categories:', xhr);
      showCategoriesError();
    }
  });
}

function showCategoriesError() {
  $('#categoriesTable').html(`
    <tr>
      <td colspan="5" class="text-center py-4 text-danger">
        <i class="bi bi-exclamation-triangle-fill"></i> Failed to load categories.
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="fetchCategories()">Retry</button>
      </td>
    </tr>
  `);
}

function populateCategoriesTable(categories) {
  const categoriesTable = $('#categoriesTable');
  categoriesTable.empty();
  
  if (categories.length === 0) {
    categoriesTable.append('<tr><td colspan="5" class="text-center py-4">No categories found</td></tr>');
    return;
  }
  
  categories.forEach(category => {
    const createdAt = formatDate(category.created_at);
    const updatedAt = formatDate(category.updated_at);
    
    categoriesTable.append(`
      <tr>
        <td>${category.name || 'N/A'}</td>
        <td>${category.description || 'N/A'}</td>
        <td>${createdAt}</td>
        <td>${updatedAt}</td>
        <td class="category-actions">
          <button class="btn btn-sm btn-outline-primary edit-category-btn" data-category-id="${category.id}">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn btn-sm btn-outline-danger delete-category-btn" data-category-id="${category.id}">
            <i class="bi bi-trash"></i> Delete
          </button>
        </td>
      </tr>
    `);
  });

  // Set up edit buttons
  $('.edit-category-btn').click(function() {
    const categoryId = $(this).data('category-id');
    editCategory(categoryId);
  });

  // Set up delete buttons
  $('.delete-category-btn').click(function() {
    currentCategoryId = $(this).data('category-id');
    deleteModal.show();
  });
}

function editCategory(categoryId) {
  const token = localStorage.getItem('access_token');
  
  $.ajax({
    url: `http://127.0.0.1:8000/api/v1/categories/${categoryId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function(category) {
      $('#modalTitle').text('Edit Category');
      $('#categoryId').val(category.id);
      $('#categoryName').val(category.name);
      $('#categoryDescription').val(category.description);
      categoryModal.show();
    },
    error: function(xhr) {
      console.error('Error fetching category:', xhr);
      alert('Failed to load category details');
    }
  });
}

function saveCategory() {
  const token = localStorage.getItem('access_token');
  const categoryId = $('#categoryId').val();
  const method = categoryId ? 'PUT' : 'POST';
  const url = categoryId 
    ? `http://127.0.0.1:8000/api/v1/categories/${categoryId}`
    : 'http://127.0.0.1:8000/api/v1/categories/';

  const data = {
    name: $('#categoryName').val(),
    description: $('#categoryDescription').val()
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
      categoryModal.hide();
      fetchCategories();
    },
    error: function(xhr) {
      console.error('Error saving category:', xhr);
      alert('Failed to save category');
    }
  });
}

function deleteCategory() {
  const token = localStorage.getItem('access_token');
  
  $.ajax({
    url: `http://127.0.0.1:8000/api/v1/categories/${currentCategoryId}`,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    },
    success: function() {
      deleteModal.hide();
      fetchCategories();
    },
    error: function(xhr) {
      console.error('Error deleting category:', xhr);
      alert('Failed to delete category');
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