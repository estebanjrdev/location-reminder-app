# Location Reminder App

Esta aplicación permite a los usuarios configurar recordatorios basados en la ubicación. Es útil para recordar tareas específicas cuando te encuentras en lugares particulares.

## Funcionalidades

- Muestra un mapa con la ubicación actual del usuario en tiempo real.
- Permite agregar nuevos recordatorios especificando:
- Nombre de la tarea.
- Ubicación en el mapa donde se debe activar el recordatorio.
- Radio de proximidad (en metros) para la activación del recordatorio.
- Los recordatorios se activan automáticamente cuando el usuario entra en el radio de proximidad especificado.
- La aplicación muestra una notificación que informa al usuario sobre la tarea activada.
- Muestra un historial de todas las tareas activadas recientemente, indicando la fecha y hora de activación.

## Requisitos

- Node.js
- Expo CLI
- Dispositivo móvil con la aplicación Expo Go instalada (para pruebas)

## Instalación

1. **Clona este repositorio:**
   
   git clone <https://github.com/estebanjrdev/location-reminder-app.git>
   
   cd location-reminder-app
3. **Instala las dependencias:**
   
   npm install
5. **Instala las dependencias específicas de Expo:**
   
   npx expo install expo-location expo-task-manager expo-notifications react-native-maps @react-native-async-storage/async-storage
7. **Inicia el servidor de desarrollo de Expo:**
   
   npx expo start
9. **Abre la aplicación Expo Go en tu dispositivo móvil:** 
   - Escanea el código QR que aparece en Expo Developer Tools en tu navegador.
   - La aplicación se abrirá en tu dispositivo móvil.
   - Asegúrate de permitir el acceso a la ubicación tanto en primer plano como en   segundo plano en tu dispositivo móvil.
10. **Agregar un recordatorio:** 
   - Ingresa el nombre de la tarea en el campo de texto.
   - Toca en el mapa para seleccionar la ubicación donde deseas que se active el recordatorio.
   - Especifica el radio de proximidad (en metros).
   - Presiona el botón "Add Reminder" para agregar el recordatorio.
   - Cuando entres en el radio de proximidad especificado, deberías recibir una notificación en tu dispositivo móvil.
   - El recordatorio activado se guardará en el historial.
<div>
<img src="https://github.com/estebanjrdev/location-reminder-app/blob/master/assets/images/image1.jpg" alt="JuveR" width="300px">
<img src="https://github.com/estebanjrdev/location-reminder-app/blob/master/assets/images/image2.jpg" alt="JuveR" width="300px">
<img src="https://github.com/estebanjrdev/location-reminder-app/blob/master/assets/images/image3.jpg" alt="JuveR" width="300px">
</div>
