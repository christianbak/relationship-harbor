
import { apiClient } from './api';
import { Customer, Contact, Activity } from '@/stores/customerStore';

/**
 * Service for handling customer-related API operations
 */
export const customerService = {
  /**
   * Get a paginated list of customers
   */
  async getCustomers(page = 1, limit = 10, filters?: Record<string, any>): Promise<{
    data: Customer[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    // Add any filters to the query params
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return apiClient.get<any>(`/customers?${queryParams.toString()}`);
  },
  
  /**
   * Get a customer by ID
   */
  async getCustomerById(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`/customers/${id}`);
  },
  
  /**
   * Create a new customer
   */
  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    return apiClient.post<Customer>('/customers', customerData);
  },
  
  /**
   * Update an existing customer
   */
  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
    return apiClient.put<Customer>(`/customers/${id}`, customerData);
  },
  
  /**
   * Delete a customer
   */
  async deleteCustomer(id: string): Promise<void> {
    return apiClient.delete<void>(`/customers/${id}`);
  },
  
  /**
   * Get contacts for a customer
   */
  async getCustomerContacts(customerId: string): Promise<Contact[]> {
    return apiClient.get<Contact[]>(`/customers/${customerId}/contacts`);
  },
  
  /**
   * Add a contact to a customer
   */
  async addContact(customerId: string, contactData: Partial<Contact>): Promise<Contact> {
    return apiClient.post<Contact>(`/customers/${customerId}/contacts`, contactData);
  },
  
  /**
   * Update a contact
   */
  async updateContact(customerId: string, contactId: string, contactData: Partial<Contact>): Promise<Contact> {
    return apiClient.put<Contact>(`/customers/${customerId}/contacts/${contactId}`, contactData);
  },
  
  /**
   * Delete a contact
   */
  async deleteContact(customerId: string, contactId: string): Promise<void> {
    return apiClient.delete<void>(`/customers/${customerId}/contacts/${contactId}`);
  },
  
  /**
   * Get activities for a customer
   */
  async getCustomerActivities(customerId: string): Promise<Activity[]> {
    return apiClient.get<Activity[]>(`/customers/${customerId}/activities`);
  },
  
  /**
   * Add an activity to a customer
   */
  async addActivity(customerId: string, activityData: Partial<Activity>): Promise<Activity> {
    return apiClient.post<Activity>(`/customers/${customerId}/activities`, activityData);
  },
  
  /**
   * Update an activity
   */
  async updateActivity(customerId: string, activityId: string, activityData: Partial<Activity>): Promise<Activity> {
    return apiClient.put<Activity>(`/customers/${customerId}/activities/${activityId}`, activityData);
  },
  
  /**
   * Delete an activity
   */
  async deleteActivity(customerId: string, activityId: string): Promise<void> {
    return apiClient.delete<void>(`/customers/${customerId}/activities/${activityId}`);
  },
};
