// Spring Boot Backend Inventory Service
class InventoryService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  }

  // Add new inventory item to Spring Boot backend
  async addItem(itemData) {
    try {
      console.log('Sending data to Spring Boot:', itemData);
      
      // Map frontend field names to match your Spring Boot entity
      const backendData = {
        name: itemData.name,           // Maps to 'Name' in your entity
        quantity: parseInt(itemData.quantity),
        price: parseFloat(itemData.price),
        freshnessStatus: itemData.freshnessStatus,
        date: itemData.date,
        description: itemData.description  // Maps to 'Description' in your entity
      };

      const response = await fetch(`${this.baseURL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(backendData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      console.log('Item added successfully to database');
      
      return {
        success: true,
        data: backendData,
        message: 'Item added successfully to database'
      };
    } catch (error) {
      console.error('Error connecting to backend:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure your Spring Boot application is running on http://localhost:8080');
      }
      
      throw new Error('Failed to save item to database: ' + error.message);
    }
  }

  // Get items from backend (placeholder for future implementation)
  async getItems() {
    try {
      const response = await fetch(`${this.baseURL}/items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const items = await response.json();
      return {
        success: true,
        data: items,
        total: items.length
      };
    } catch (error) {
      console.error('Error fetching items:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure your Spring Boot application is running on http://localhost:8080');
      }
      
      return {
        success: false,
        data: [],
        total: 0,
        error: error.message
      };
    }
  }

  // Get inventory statistics (placeholder)
  async getDashboardStats() {
    try {
      console.log('Fetching dashboard stats from Spring Boot...');
      
      const response = await fetch(`${this.baseURL}/retrive`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Dashboard stats received:', data);
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure your Spring Boot application is running on http://localhost:8080');
      }
      
      throw new Error('Failed to fetch dashboard data: ' + error.message);
    }
  }

  // Retrieve items from inventory
  async retrieveItems(itemId, quantityRetrieved) {
    try {
      console.log('Retrieving items from inventory:', { itemId, quantityRetrieved });
      
      const requestData = {
        itemId: parseInt(itemId),
        quantityRetrieved: parseInt(quantityRetrieved)
      };

      const response = await fetch(`${this.baseURL}/retrieve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || `Server error: ${response.status}`);
      }

      console.log('Items retrieved successfully:', responseText);
      
      return {
        success: true,
        message: responseText
      };
    } catch (error) {
      console.error('Error retrieving items:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure your Spring Boot application is running on http://localhost:8080');
      }
      
      throw new Error(error.message || 'Failed to retrieve items from inventory');
    }
  }

  // Fallback stats for offline mode
  getFallbackStats() {
    return {
      success: false,
      data: {
        totalItems: 0,
        totalQuantity: 0,
        totalValue: 0,
        freshnessStatusCount: {},
        recentItems: []
      },
      fallback: {
        totalItems: 0,
        totalValue: '0.00',
        freshPercentage: 0
      }
    };
  }
}

// Export singleton instance
export default new InventoryService();