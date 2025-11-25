import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuItem, MenuItemRequest } from '../../models/menu-item.models';

/**
 * Component for managing restaurant menu items (CRUD operations)
 */
@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-management.component.html',
  styleUrl: './menu-management.component.css'
})
export class MenuManagementComponent implements OnInit {
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  
  isFormVisible: boolean = false;
  isEditMode: boolean = false;
  currentItemId?: number;
  
  formData: MenuItemRequest = {
    name: '',
    description: '',
    price: 0,
    category: '',
    available: true
  };

  constructor(private menuItemService: MenuItemService) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.menuItemService.getAllMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
        this.filteredItems = items;
        this.extractCategories();
      },
      error: (error) => {
        console.error('Error loading menu items:', error);
      }
    });
  }

  // Extract unique categories from menu items
  extractCategories(): void {
    const categorySet = new Set(this.menuItems.map(item => item.category));
    this.categories = Array.from(categorySet);
  }

  // Filter menu items by selected category
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredItems = this.menuItems;
    } else {
      this.filteredItems = this.menuItems.filter(item => item.category === category);
    }
  }

  showAddForm(): void {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.resetForm();
  }

  showEditForm(item: MenuItem): void {
    this.isFormVisible = true;
    this.isEditMode = true;
    this.currentItemId = item.id;
    this.formData = {
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      available: item.available
    };
  }

  hideForm(): void {
    this.isFormVisible = false;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      name: '',
      description: '',
      price: 0,
      category: '',
      available: true
    };
    this.currentItemId = undefined;
  }

  // Save menu item (create or update based on mode)
  saveMenuItem(): void {
    if (this.isEditMode && this.currentItemId) {
      this.menuItemService.updateMenuItem(this.currentItemId, this.formData).subscribe({
        next: () => {
          this.loadMenuItems();
          this.hideForm();
        },
        error: (error) => {
          console.error('Error updating menu item:', error);
        }
      });
    } else {
      this.menuItemService.createMenuItem(this.formData).subscribe({
        next: () => {
          this.loadMenuItems();
          this.hideForm();
        },
        error: (error) => {
          console.error('Error creating menu item:', error);
        }
      });
    }
  }

  deleteMenuItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.menuItemService.deleteMenuItem(id).subscribe({
        next: () => {
          this.loadMenuItems();
        },
        error: (error) => {
          console.error('Error deleting menu item:', error);
        }
      });
    }
  }

  // Toggle item availability status
  toggleAvailability(item: MenuItem): void {
    if (item.id) {
      const updatedItem: MenuItemRequest = {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        available: !item.available
      };
      
      this.menuItemService.updateMenuItem(item.id, updatedItem).subscribe({
        next: () => {
          this.loadMenuItems();
        },
        error: (error) => {
          console.error('Error toggling availability:', error);
        }
      });
    }
  }
}
