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
  if (!user) return;

  // PLAN B: Hardcoded (Acceso instantáneo para ti)
  const ADMIN_PRIMARIO = "richardmendezmatos@gmail.com";

  if (user.email === ADMIN_PRIMARIO) {
    console.log("⭐ Acceso Maestro detectado.");
    activarInterfazAdmin();
    return; // Ya no necesita esperar a la base de datos
  }

  // PLAN A: Verificación en Firestore (Para otros admins en el futuro)
  try {
    const docRef = doc(db, "config_segura", "admins");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().lista_correos.includes(user.email)) {
      activarInterfazAdmin();
    } else {
      console.log("👤 Acceso de cliente estándar.");
      mostrarVistaCliente();
    }
  } catch (e) {
    console.error("Error de conexión, pero el Plan B te protege.", e);
  }
}

function activarInterfazAdmin() {
  // Muestra el botón de gestión de inventario o el dashboard
  const adminUI = document.getElementById('admin-dashboard');
  if (adminUI) adminUI.style.display = 'block';

  // Mostrar el botón del navbar
  const adminNav = document.getElementById('admin-btn-nav');
  if (adminNav) adminNav.style.display = 'inline-block';

  // Puedes cambiar el título de la página o añadir un badge de Admin
  document.title = "Richard Automotive | Admin Mode";
}

function mostrarVistaCliente() {
  console.log("Permaneciendo en vista de cliente.");
}
