import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { MenuItem, MenuItemRequest } from '../models/menu-item.models';

/**
 * Service for menu item API operations
 */
@Injectable({
  providedIn: 'root'
})
export class MenuItemService extends BaseApiService {
  protected readonly endpoint = '/api/menu-items';

  getAllMenuItems(): Observable<MenuItem[]> {
    return this.get<MenuItem[]>('');
  }

  getMenuItemById(id: number): Observable<MenuItem> {
    return this.get<MenuItem>(`/${id}`);
  }

  getMenuItemsByCategory(category: string): Observable<MenuItem[]> {
    return this.get<MenuItem[]>(`/category/${category}`);
  }

  createMenuItem(request: MenuItemRequest): Observable<MenuItem> {
    return this.post<MenuItem>('', request);
  }

  updateMenuItem(id: number, request: MenuItemRequest): Observable<MenuItem> {
    return this.put<MenuItem>(`/${id}`, request);
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.delete<void>(`/${id}`);
  }
}