# CurrencyPipe

## Formatea valores numéricos a formato de moneda peruana (Soles - PEN).

---

## USO

### Importación del pipe ubicado en src/app/shared/pipes/currency-pipe.ts

```typescript
import { CurrencyPipe } from 'src/app/shared/pipes/currency-pipe';

@Component({
  imports: [CurrencyPipe]
})
```

### En el template HTML

```html
{{ precio | currency }}
```

---

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| value | `number \| string \| null \| undefined` | Valor numérico a formatear |

---

## Ejemplos

| Entrada | Salida |
|---------|--------|
| `100` | `"S/ 100.00"` |
| `99.9` | `"S/ 99.90"` |
| `"abc"` | `"S/ 0.00"` |
| `null` | `"S/ 0.00"` |
| `undefined` | `"S/ 0.00"` |

---

## Manejo de errores

Si el valor no es numérico o no se puede convertir, el pipe retorna:

```
"S/ 0.00"
```

---

## Notas

- El pipe siempre retorna exactamente 2 decimales
- Utiliza el símbolo `S/` para Soles peruanos
- No contiene lógica de negocio, solo es para presentación