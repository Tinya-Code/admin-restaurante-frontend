import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error guardando en localStorage [${key}]`, error);
    }
  }
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error leyendo de localStorage [${key}]`, error);
      return null;
    }
  }
  update<T>(key: string, value: Partial<T>): void {
    const current = this.get<T>(key);
    if (current) {
      const updated = { ...current, ...value };
      this.set(key, updated);
    } else {
      console.warn(`No existe la clave [${key}] para actualizar`);
    }
  }
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error eliminando de localStorage [${key}]`, error);
    }
  }
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error limpiando localStorage', error);
    }
  }
  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
