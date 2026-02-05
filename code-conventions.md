# 📏 Code Conventions

Reglas para mantener el proyecto limpio y escalable.

---

## 🧱 Estructura

- Cada módulo va en `features/`
- No mezclar lógica de módulos
- Componentes globales solo en `components/ui`

---

## 🧠 Naming

| Tipo | Formato |
|------|--------|
| Componentes | PascalCase |
| Hooks | useSomething |
| Archivos TS | camelCase |
| Types | PascalCase |

---

## ⚛️ Componentes

✔ Máx. responsabilidad única  
✔ Evitar lógica de API directa en UI  
✔ Usar services para backend  

---

## 🌍 API Calls

Siempre desde:

```
services/
features/x/services.ts
```

---

## 🧩 Imports

Usar alias:

```ts
import Button from "@ui/Button"
```

❌ No usar rutas largas relativas.

---

## 🧠 Estado

Global → Zustand  
Local → useState  

---

## 🎨 Estilos

Tailwind mobile-first:

```
p-4 md:p-6
```

---

# 🏁 Objetivo

Código legible, escalable y mantenible.
