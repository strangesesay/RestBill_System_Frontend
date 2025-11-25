/**
 * TypeScript interfaces for menu item data structures
 */
export interface MenuItem {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
}

export interface MenuItemRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  available?: boolean;
}