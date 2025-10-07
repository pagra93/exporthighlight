// Script de diagnóstico para verificar configuración de emails
// Ejecutar en la consola del navegador en tu aplicación

console.log('🔍 Diagnóstico de Configuración de Emails');
console.log('=====================================');

// Verificar variables de entorno
console.log('📋 Variables de Entorno:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'NO CONFIGURADO');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'CONFIGURADO' : 'NO CONFIGURADO');

// Verificar configuración de Supabase
console.log('\n🔧 Configuración de Supabase:');
console.log('URL actual:', window.location.origin);
console.log('Callback URL:', `${window.location.origin}/auth/callback`);

// Test de conexión a Supabase
console.log('\n🧪 Test de Conexión:');
if (typeof window !== 'undefined' && window.supabase) {
  console.log('✅ Supabase client disponible');
} else {
  console.log('❌ Supabase client no disponible');
}

// Función para test de registro
window.testSignup = async (email = 'test@example.com', password = 'testpassword123') => {
  console.log('\n🧪 Test de Registro:');
  console.log('Email:', email);
  console.log('Password:', password);
  
  try {
    const { data, error } = await window.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Registro exitoso');
      console.log('Usuario:', data.user);
      console.log('Sesión:', data.session);
      console.log('Confirmation sent:', data.user?.email_confirmed_at ? 'NO' : 'SÍ');
    }
  } catch (err) {
    console.log('❌ Error inesperado:', err);
  }
};

// Función para test de magic link
window.testMagicLink = async (email = 'test@example.com') => {
  console.log('\n🧪 Test de Magic Link:');
  console.log('Email:', email);
  
  try {
    const { data, error } = await window.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Magic Link enviado');
      console.log('Data:', data);
    }
  } catch (err) {
    console.log('❌ Error inesperado:', err);
  }
};

// Función para test de reset password
window.testResetPassword = async (email = 'test@example.com') => {
  console.log('\n🧪 Test de Reset Password:');
  console.log('Email:', email);
  
  try {
    const { data, error } = await window.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    
    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Reset password enviado');
      console.log('Data:', data);
    }
  } catch (err) {
    console.log('❌ Error inesperado:', err);
  }
};

console.log('\n🚀 Funciones de Test Disponibles:');
console.log('- testSignup(email, password)');
console.log('- testMagicLink(email)');
console.log('- testResetPassword(email)');
console.log('\nEjemplo: testSignup("mi-email@ejemplo.com", "mi-password")');

console.log('\n📋 Checklist de Verificación:');
console.log('1. ✅ Variables de entorno configuradas');
console.log('2. ✅ Supabase client disponible');
console.log('3. ✅ URLs de callback correctas');
console.log('4. ⚠️  Verificar configuración SMTP en Supabase dashboard');
console.log('5. ⚠️  Verificar templates de email habilitados');
console.log('6. ⚠️  Verificar Site URL en Supabase');
console.log('7. ⚠️  Verificar Redirect URLs en Supabase');

console.log('\n📖 Para más información, revisa: EMAIL_SETUP.md');
