# 🚀 Deploy Guide — React SaaS Template

Esta guía explica cómo llevar el proyecto a **producción**.

---

## 🧱 1. Build de producción

```bash
npm run build
```

Se genera la carpeta:

```
dist/
```

---

## 🌍 2. Variables de entorno producción

Crear `.env.production`:

```
VITE_API_URL=https://api.tudominio.com
```

---

## 🖥️ 3. Opciones de hosting

### 🔹 Frontend (Recomendado)

| Plataforma | Ideal para |
|-----------|-------------|
| Vercel | React + Vite |
| Netlify | Apps estáticas |
| Cloudflare Pages | Alto rendimiento |

Subir carpeta `dist`.

---

### 🔹 Backend

| Stack | Hosting |
|------|---------|
| Node.js | Railway / Render / VPS |
| AS400 API | Servidor propio |

---

## 🔐 4. Seguridad

✔ HTTPS obligatorio  
✔ Tokens JWT con expiración  
✔ CORS configurado en backend  
✔ Variables sensibles solo en backend  

---

## ⚙️ 5. Comandos útiles

```bash
npm run preview   # probar build local
```

---

# 🏁 Checklist final

✔ `.env.production` listo  
✔ API funcionando  
✔ Build sin errores  
✔ Dominio conectado  
✔ HTTPS activo  
