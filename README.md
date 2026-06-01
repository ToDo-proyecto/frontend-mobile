# Todo Mobile

Aplicación móvil de gestión de tareas construida con React Native y Expo. Permite crear listas de tareas, agregar ítems con prioridad y fecha límite, y marcarlos como completados.

## Tecnologías

- **React Native** con **Expo** (SDK 52)
- **Expo Router** — navegación basada en archivos
- **Firebase Authentication** — autenticación con email/password
- **NativeWind** — estilos con Tailwind CSS
- **Gluestack UI** — componentes de UI
- **Axios** — peticiones HTTP al backend

## Requisitos previos

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Expo Go instalado en tu celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Instalación

```bash
cd frontend-mobile
pnpm install
```

## Variables de entorno

Crea un archivo `.env` en la carpeta `frontend-mobile/` con el siguiente contenido:

```env
EXPO_PUBLIC_STORYBOOK_ENABLED=false

EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id

EXPO_PUBLIC_API_URL=https://todo-backend-117948004008.us-central1.run.app
```

> El archivo `.env` con las credenciales reales se encuentra en la carpeta `frontend-mobile/` dentro del ZIP entregado en la tarea.

## Cómo ejecutar

```bash
pnpm start
```

Escanea el QR con la app **Expo Go** en tu celular. Si no estás en la misma red WiFi, usa:

```bash
pnpm start --tunnel
```

## Backend desplegado

```
https://todo-backend-117948004008.us-central1.run.app
```

## Usuarios de prueba

| Email | Contraseña |
|-------|------------|
| prueba@gmail.com | prueba123 |

> También puedes crear tu propia cuenta desde la pantalla de registro.

## Funcionalidades

- Registro e inicio de sesión con email/password
- Crear, editar y eliminar listas de tareas
- Agregar tareas con título, descripción, prioridad (low/medium/high) y fecha límite
- Marcar tareas como completadas
- Buscador de listas
- Perfil de usuario con edición de nombre
