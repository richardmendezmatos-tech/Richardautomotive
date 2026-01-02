import { getAuth, GoogleAuthProvider, signInWithCredential } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { app, db } from "./firebaseConfig.js";

const auth = getAuth(app);

export const initRichardAuth = () => {
  // Solo se ejecuta si estamos en el navegador
  if (typeof window !== "undefined") {

    // Safer event listener
    window.addEventListener('load', () => {
      google.accounts.id.initialize({
        client_id: "TU_CLIENT_ID.apps.googleusercontent.com", // Saca esto de Google Cloud Console
        callback: handleCredentialResponse,
        auto_select: true, // ¡ANTIGRAVITY! Si ya entró antes, loguea solo
      });

      // Renderiza la burbuja de One Tap
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("One Tap no se mostró, podrías mostrar un botón normal aquí.");
        }
      });
    });
  }
};

// Función interna para procesar la respuesta
const handleCredentialResponse = async (response) => {
  const credential = GoogleAuthProvider.credential(response.credential);
  try {
    const result = await signInWithCredential(auth, credential);
    console.log("¡Bienvenido a Richard Automotive!", result.user.displayName);
    // Verificar Admin
    await verificarSiEsAdmin(result.user);
  } catch (error) {
    console.error("Error en la autenticación silenciosa", error);
  }
};

async function verificarSiEsAdmin(user) {
  if (!user || !user.email) return;

  try {
    const docRef = doc(db, "config_segura", "admins");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const admins = docSnap.data().lista_correos;

      // Verificamos si tu correo está en la lista de Firebase
      if (admins.includes(user.email)) {
        console.log("⭐ Bienvenido, Richard. Acceso de Administrador concedido.");
        mostrarPanelAdmin();
      } else {
        console.log("👤 Acceso de cliente estándar.");
        mostrarVistaCliente();
      }
    } else {
      // Si el documento en Firebase no existe aún, puedes usar este respaldo
      if (user.email === "richardmendezmatos@gmail.com") {
        console.log("⭐ Admin detectado por respaldo de código.");
        mostrarPanelAdmin();
      }
    }
  } catch (error) {
    console.error("Error al verificar permisos:", error);
  }
}

function mostrarPanelAdmin() {
  // Muestra el botón de gestión de inventario o el dashboard
  const adminUI = document.getElementById('admin-dashboard');
  if (adminUI) adminUI.style.display = 'block';

  // Puedes cambiar el título de la página o añadir un badge de Admin
  document.title = "Richard Automotive | Admin Mode";
}

function mostrarVistaCliente() {
  console.log("Permaneciendo en vista de cliente.");
}
