# SearchBar Component

Componente de búsqueda reutilizable desarrollado con **Angular**, **Reactive Forms** y **Lucide Angular**.  
Su función es capturar, validar y exponer un término de búsqueda para que otros componentes puedan reaccionar a él.

---

## 🎯 Objetivo

Este componente existe para resolver **una sola responsabilidad**:

- Permitir al usuario ingresar un término de búsqueda
- Validar que dicho término tenga al menos **4 caracteres**
- Retornar el valor validado para su uso externo (filtros, peticiones, etc.)

No ejecuta búsquedas, no filtra datos y no se comunica directamente con el backend.

---

## 🧱 Stack utilizado

- Angular
- Reactive Forms
- Lucide Angular Icons

---

## 🧩 Estructura interna

### Icono

Search

```ts
searchIcon = Search;
