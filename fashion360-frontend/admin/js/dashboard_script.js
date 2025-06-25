// Mobile Menu Toggle
    document.getElementById('menuToggle').addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('active');
    });

    // Check authentication
    document.addEventListener('DOMContentLoaded', function() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login.html';
      } else {
        fetchDashboardData();
      }
    });

    // Logout function
    function logout() {
      localStorage.removeItem('access_token');
      window.location.href = '../index.html';
    }

    // Format date
    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Calculate order total
    function calculateOrderTotal(items) {
      return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get stock indicator class
    function getStockClass(quantity) {
      if (quantity === 0) return 'stock-low';
      if (quantity <= 5) return 'stock-medium';
      return 'stock-good';
    }

    // Fetch dashboard data from API
    function fetchDashboardData() {
      const token = localStorage.getItem('access_token');
      
      $.ajax({
        url: 'http://127.0.0.1:8000/api/v1/api/dashboard',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        },
        success: function(data) {
          populateDashboard(data);
        },
        error: function(xhr) {
          console.error('Error fetching dashboard data:', xhr);
          showError('Failed to load dashboard data. Please try again.');
        }
      });
    }

    // Populate dashboard with data
    function populateDashboard(data) {
      // Update stats
      $('#totalOrders').text(data.total_orders);
      $('#totalProducts').text(data.total_inventory_items);
      $('#totalDeliveries').text(data.total_deliveries);
      
      // Count unique customers from orders
      const uniqueCustomers = new Set(data.recent_orders.map(order => order.customer_email));
      $('#totalCustomers').text(uniqueCustomers.size);
      
      // Populate recent orders
      const ordersTable = $('#ordersTable');
      ordersTable.empty();
      
      if (data.recent_orders.length === 0) {
        ordersTable.append('<tr><td colspan="6" class="text-center py-4">No recent orders found</td></tr>');
      } else {
        data.recent_orders.forEach(order => {
          const totalAmount = calculateOrderTotal(order.items);
          const statusClass = order.status === 'pending' ? 'badge-pending' : 
                            order.status === 'processing' ? 'badge-processing' : 'badge-completed';
          
          ordersTable.append(`
            <tr>
              <td>#${order.id}</td>
              <td>${order.customer_name}</td>
              <td>${order.items.length}</td>
              <td>${totalAmount.toFixed(2)}</td>
              <td><span class="badge ${statusClass}">${order.status}</span></td>
              <td>${formatDate(order.created_at)}</td>
            </tr>
          `);
        });
      }
      
      // Populate low stock items (quantity <= 5)
      const lowStockTable = $('#lowStockTable');
      lowStockTable.empty();
      
      const lowStockItems = data.recent_inventory.filter(item => item.quantity <= 5);
      if (lowStockItems.length === 0) {
        lowStockTable.append('<tr><td colspan="3" class="text-center py-4">All items are well stocked</td></tr>');
      } else {
        lowStockItems.forEach(item => {
          const stockClass = getStockClass(item.quantity);
          
          lowStockTable.append(`
            <tr>
              <td>${item.name}</td>
              <td>
                <span class="stock-indicator ${stockClass}"></span>
                ${item.quantity}
              </td>
              <td>${item.location}</td>
            </tr>
          `);
        });
      }
      
      // Populate recent deliveries
      const deliveriesTable = $('#deliveriesTable');
      deliveriesTable.empty();
      
      if (data.recent_deliveries.length === 0) {
        deliveriesTable.append('<tr><td colspan="3" class="text-center py-4">No recent deliveries</td></tr>');
      } else {
        data.recent_deliveries.forEach(delivery => {
          deliveriesTable.append(`
            <tr>
              <td>#${delivery.order_id}</td>
              <td><span class="badge badge-processing">${delivery.status}</span></td>
              <td>${formatDate(delivery.shipped_at)}</td>
            </tr>
          `);
        });
      }
      
      // Update last updated time
      $('#lastUpdated').text(`Last updated: ${new Date().toLocaleString()}`);
    }

    // Show error message
    function showError(message) {
      alert(message); // In a real app, you'd show this in a nicer way
    }

    // Refresh button click handler
    $('#refreshOrders').click(function() {
      $('#ordersTable').html('<tr><td colspan="6" class="text-center py-4"><span class="loading-spinner"></span> Refreshing...</td></tr>');
      $('#lowStockTable').html('<tr><td colspan="3" class="text-center py-4"><span class="loading-spinner"></span> Refreshing...</td></tr>');
      $('#deliveriesTable').html('<tr><td colspan="3" class="text-center py-4"><span class="loading-spinner"></span> Refreshing...</td></tr>');
      
      fetchDashboardData();
    });

    setInterval(fetchDashboardData, 300000);