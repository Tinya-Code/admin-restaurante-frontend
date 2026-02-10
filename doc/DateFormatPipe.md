# DateFormatPipe

## Formatea valores de fecha para su visualizacion en templates de angular.

---

## USO

---- .ts
### importacon del pipe ubicado en  src/app/shared/pipes/date-format-pipe.ts

import DateFormatPipe from "src/app/shared/pipes/date-format-pipe.ts"

imports: [DateFormatPipe]

--- html

{{ value | dateFormat: `short` }};
{{ value | dateFormat: `long` }};
{{ value | dateFormat: `full` }};

---

## Parametros

que recibe el pipe:

{{ valor + argumento }};
{{ valor | dateFormat: `argumento` }};

## Valores soportados

| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| value: `Date` | `string` | `number` | valor de fecha esperada a formatear     |
| mode: `short` | `long`   | `full`   | modo de formateo : por defecto `short`  |

## Manejo de errojes

Si el valor no es soportados o no es valido para formatear con `new Date(value)`

---string

  ""  | un string vacio

## notas

- El pipe no soporta letras ; `abc`
- No contiene logica de negocio
- Solo se usa para presentacion de fecha