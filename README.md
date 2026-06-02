# ToDo App — Frontend Mobile

Aplicación móvil de gestión de tareas desarrollada con **React Native + Expo**. Permite crear listas de tareas, agregar ítems con prioridad y fecha límite, marcar tareas como completadas y buscar entre tus listas. La autenticación se maneja con Firebase y todas las peticiones HTTP van hacia un backend propio en Quarkus desplegado en GCP Cloud Run.

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| [Expo](https://expo.dev) | ~54 | Framework React Native |
| [Expo Router](https://expo.github.io/router) | v6 | Navegación basada en archivos |
| [React Native](https://reactnative.dev) | 0.81 | UI nativa iOS/Android |
| [Firebase Auth](https://firebase.google.com) | v12 | Autenticación email/password |
| [Axios](https://axios-http.com) | v1 | Cliente HTTP con interceptors y token refresh |
| [NativeWind](https://www.nativewind.dev) | v4 | Estilos con Tailwind CSS |
| [Gluestack UI](https://gluestack.io) | v3 | Componentes de UI |
| AsyncStorage | v2 | Persistencia local del token |

**Backend:** [Quarkus 3](https://quarkus.io) (Java 21) — GCP Cloud Run
**Base de datos:** PostgreSQL 18 — GCP Cloud SQL
**Autenticación:** Firebase Authentication (proyecto `medsync-1`)

---

## Links desplegados

| Servicio | URL |
|---|---|
| Frontend Web | https://frontend-web-ruddy.vercel.app |
| Backend API | https://todo-backend-117948004008.us-central1.run.app |
| Health check | https://todo-backend-117948004008.us-central1.run.app/health |

---

## Requisitos previos

- **Node.js** 18 o superior
- **npm** (incluido con Node.js)
- **[Expo Go](https://expo.dev/go)** instalado en el dispositivo móvil

> Para correr en emulador: Xcode (iOS, solo Mac) o Android Studio (Android)

---

## Instalación

```bash
cd frontend-mobile
npm install
```

---

## Variables de entorno

El archivo `.env` **no se incluye en el repositorio** por seguridad. Las credenciales reales se encuentran en el **ZIP entregado en la tarea**, dentro de la carpeta `frontend-mobile/`.

Crea el archivo `frontend-mobile/.env` con las siguientes variables (los valores los encuentras en el ZIP):

```env
EXPO_PUBLIC_STORYBOOK_ENABLED=false

# Firebase — credenciales en el ZIP (frontend-mobile/.env)
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Backend (GCP Cloud Run) — URL pública, no requiere credenciales
EXPO_PUBLIC_API_URL=https://todo-backend-117948004008.us-central1.run.app
```

> **¿Dónde están los valores?**
> - **Firebase:** en el archivo `.env` dentro del ZIP → carpeta `frontend-mobile/`
> - **API URL:** ya está arriba, es la URL pública del backend en GCP
>
> **Prueba local:** reemplaza `EXPO_PUBLIC_API_URL` con `http://TU_IP_LOCAL:8080`. Obtén tu IP con `ipconfig` (Windows) o `ifconfig` (Mac/Linux). El dispositivo y la computadora deben estar en la **misma red WiFi**.

---

## Cómo ejecutar el proyecto

```bash
npx expo start --clear
```

Escanea el QR con **Expo Go** desde tu iPhone o Android.

### Opciones adicionales

```bash
npx expo start --ios        # Emulador iOS (requiere Xcode en Mac)
npx expo start --android    # Emulador Android (requiere Android Studio)
npx expo start --tunnel     # Si el dispositivo no está en la misma red WiFi
```

---

## Estructura del proyecto

```
frontend-mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx       # Home — lista de todas las listas
│   │   ├── search.tsx      # Buscador de listas y tareas
│   │   └── profile.tsx     # Perfil del usuario + logout
│   ├── lists/[id].tsx      # Detalle de lista con sus tareas
│   ├── login.tsx           # Pantalla de inicio de sesión
│   ├── register.tsx        # Pantalla de registro
│   └── _layout.tsx         # Layout raíz con Stack navigator
├── components/
│   ├── CreateListSheet/    # Modal para crear/editar listas
│   ├── CreateTaskSheet/    # Modal para crear tareas
│   ├── EditTaskSheet/      # Modal para editar tareas
│   ├── TaskListCard/       # Tarjeta de lista con porcentaje
│   └── TaskItem/           # Ítem de tarea con toggle y acciones
├── services/
│   ├── api.ts              # Instancia Axios + interceptors (token refresh)
│   ├── firebase.ts         # Inicialización Firebase
│   ├── auth/               # login.ts, register.ts, logout.ts
│   └── tasks/              # taskLists.ts, taskItems.ts
├── contexts/
│   └── AuthContext.tsx     # Estado global de autenticación
├── types/
│   ├── Task.ts             # Tipo TaskItem
│   └── TaskList.ts         # Tipo TaskList
└── .env                    # Variables de entorno (incluido en el ZIP)
```

---

## Usuarios de prueba

| Email | Contraseña |
|---|---|
| prueba@gmail.com | prueba123 |

> También puedes registrar tu propia cuenta desde la pantalla **Register**.

---

## Endpoints del backend consumidos

Todos los endpoints (excepto `/health`) requieren el header:
`Authorization: Bearer <Firebase ID Token>`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servidor (público) |
| GET | `/api/task-lists` | Listar todas las listas del usuario |
| POST | `/api/task-lists` | Crear lista |
| PUT | `/api/task-lists/:id` | Actualizar lista |
| DELETE | `/api/task-lists/:id` | Eliminar lista (cascade tareas) |
| GET | `/api/task-lists/:id/items` | Listar tareas de una lista |
| POST | `/api/task-lists/:id/items` | Crear tarea |
| PATCH | `/api/task-lists/:id/items/:itemId` | Actualizar tarea |
| DELETE | `/api/task-lists/:id/items/:itemId` | Eliminar tarea |

---

## Cómo funciona la autenticación

1. El usuario inicia sesión con Firebase (email/password)
2. Firebase devuelve un **ID Token** (JWT válido por 1 hora)
3. El token se guarda en `AsyncStorage` y se adjunta a todas las peticiones mediante el interceptor de Axios en `services/api.ts`
4. El backend Quarkus verifica el token con **Firebase Admin SDK** en cada request
5. Si el token expira y la respuesta es `401`, el interceptor llama a `getIdToken(true)` para renovarlo y reintenta la petición automáticamente

---

## Correr el backend localmente (opcional)

```bash
# Requisitos: Java 21, Maven, Docker Desktop

cd backend-web-mobile

# 1. Levantar PostgreSQL
docker-compose up -d

# 2. Correr Quarkus en modo desarrollo (hot reload)
./mvnw quarkus:dev
```

Cambia `EXPO_PUBLIC_API_URL` en `.env` a tu IP local:
```
EXPO_PUBLIC_API_URL=http://192.168.x.x:8080
```
