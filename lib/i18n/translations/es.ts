import { Translation } from '../types';

export const es: Translation = {
  // Navigation
  nav: {
    upload: 'Subir archivo',
    myAccount: 'Mi cuenta',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    language: 'Idioma',
    myBooks: 'Mis Libros',
    tags: 'Etiquetas',
    search: 'Buscar',
    myProfile: 'Mi Perfil',
    settings: 'Configuración',
    collections: 'Colecciones',
    newCollection: 'Nueva colección',
    manageTags: 'Gestionar etiquetas',
    backToBooks: 'Volver a todos los libros',
  },

  auth: {
    title: 'Iniciar sesión',
    subtitle: 'Accede a tu cuenta para exportar todos tus highlights',
    email: 'Email',
    password: 'Contraseña',
    magicLink: 'Magic Link',
    login: 'Iniciar sesión',
    emailPlaceholder: 'tu@email.com',
    passwordPlaceholder: '••••••••',
    checkEmail: 'Revisa tu email',
    sendMagicLink: 'Enviar Magic Link',
    google: 'Continuar con Google',
    orContinueWith: 'O continúa con',
    sending: 'Enviando...',
    close: 'Cerrar',
    passwordRequired: 'Por favor ingresa tu contraseña',
    sessionStarted: '✅ ¡Sesión iniciada correctamente!',
  },

  account: {
    myBooks: 'Mis Libros',
    loadingLibrary: 'Cargando biblioteca...',
    welcome: 'Bienvenido',
    unlimitedExports: 'Ahora tienes exportaciones ilimitadas',
    uploadNewFile: 'Subir nuevo archivo',
    emptyLibrary: {
      title: 'Tu biblioteca está vacía',
      description: 'Sube tu archivo My Clippings.txt para comenzar a organizar tus highlights',
      uploadButton: 'Subir archivo',
    },
    stats: {
      books: 'Libros',
      notes: 'Notas',
      highlights: 'Highlights',
    },
    yourBooks: 'Tus libros',
    exportAllZip: 'Exportar todos (ZIP)',
    loginToExport: 'Login para exportar',
    dangerousZone: 'Zona peligrosa',
    deleteBookDescription: 'Esta acción no se puede deshacer',
    deleteBook: 'Borrar libro',
    backToBooks: 'Volver a todos los libros',
    addToCollection: 'Añadir a colección',
    loading: 'Cargando...',
    noCollectionsYet: 'No tienes colecciones aún',
    createFirstCollection: 'Crear primera colección',
    newCollection: 'Nueva colección',
    books: 'libros',
    removed: 'Eliminado',
    removedDescription: 'Libro eliminado de la colección',
    added: 'Añadido',
    addedDescription: 'Libro añadido a la colección',
    errorUpdatingCollection: 'Error al actualizar colección',
    copyNotes: 'Notas copiadas al portapapeles',
    downloadMarkdown: 'Archivo Markdown descargado',
    errors: {
      loadCollectionBooks: 'No se pudieron cargar los libros de la colección',
      loadTagHighlights: 'No se pudieron cargar los highlights de la etiqueta',
      loadLibrary: 'Error al cargar biblioteca',
      unknown: 'Error desconocido',
      deleteBook: 'Error al borrar',
      export: 'Error al exportar',
      update: 'Error al actualizar',
      updateDescription: 'No se pudieron guardar los cambios',
    },
    success: {
      bookDeleted: 'Libro borrado',
      bookDeletedDescription: 'El libro ha sido eliminado de tu biblioteca',
      coversAdded: 'Las portadas se han añadido correctamente',
      metadataUpdated: '¡Metadata actualizada!',
    },
    filters: {
      showingCollection: 'Mostrando libros de la colección',
      showingTag: 'Mostrando highlights con la etiqueta',
      clearFilter: 'Limpiar filtro',
    },
  },

  tags: {
    myTags: 'Mis Etiquetas',
    createNewTag: 'Crear nueva etiqueta',
    tagNamePlaceholder: 'Nombre de la etiqueta (ej: Importante, Para revisar...)',
    create: 'Crear',
    searchTags: 'Buscar etiquetas...',
    clearSearch: 'Limpiar búsqueda de etiquetas',
    yourTags: 'Tus etiquetas',
    noTags: 'No tienes etiquetas creadas',
    noTagsDescription: 'Crea tu primera etiqueta para organizar tus highlights',
    createFirstTag: 'Crear primera etiqueta',
    highlightsTagged: 'highlights etiquetados',
    highlights: 'highlights',
    highlight: 'highlight',
    searchInHighlights: 'Buscar en highlights...',
    clearHighlightSearch: 'Limpiar búsqueda',
    exportTagHighlights: 'Exportar highlights de etiqueta',
    deleteTag: 'Eliminar etiqueta',
    noHighlightsInTag: 'No hay highlights con esta etiqueta',
    noHighlightsInTagDescription: 'Esta etiqueta no tiene highlights asociados',
    backToTags: 'Volver a todas las etiquetas',
    createdOn: 'Creada el',
    errors: {
      loadTags: 'Error al cargar etiquetas',
      loadHighlights: 'Error al cargar highlights',
      createTag: 'Error al crear etiqueta',
      deleteTag: 'Error al eliminar',
      export: 'Error al exportar',
      unknown: 'Error desconocido',
    },
    success: {
      tagCreated: 'Etiqueta creada',
      tagDeleted: 'Etiqueta eliminada',
    },
    manageTags: 'Gestionar etiquetas',
    addTag: 'Añadir etiqueta',
    tag: 'etiqueta',
    tags: 'etiquetas',
    limitReached: 'Límite alcanzado',
    maxTagsPerHighlight: 'Máximo 10 etiquetas por highlight',
    tagAdded: 'Etiqueta añadida',
    tagAddedDescription: 'añadida al highlight',
    tagRemoved: 'Etiqueta eliminada',
    tagRemovedDescription: 'eliminada del highlight',
    couldNotAddTag: 'No se pudo añadir la etiqueta',
    couldNotRemoveTag: 'No se pudo eliminar la etiqueta',
    searchOrCreateTag: 'Buscar o crear etiqueta...',
    appliedTags: 'Etiquetas aplicadas',
    noTagsYet: 'Sin etiquetas aún',
    searchOrCreateAbove: 'Busca o crea una etiqueta arriba',
    tagsRemaining: 'etiquetas restantes',
    tagRemaining: 'etiqueta restante',
  },

  search: {
    title: 'Buscar en tus highlights',
    placeholder: 'Busca por texto, nota, libro...',
    loading: 'Cargando...',
    noResults: 'Escribe algo para buscar en tu biblioteca',
    resultsFound: 'resultados encontrados',
    results: 'resultados',
    result: 'resultado',
    clearSearch: 'Limpiar búsqueda',
    errors: {
      loadHighlights: 'Error al cargar highlights',
      unknown: 'Error desconocido',
    },
  },

  profile: {
    title: 'Mi Perfil',
    accountInfo: 'Información de la cuenta',
    memberSince: 'Miembro desde',
    email: 'Email',
    books: 'Libros',
    highlights: 'Highlights',
    change: 'Cambiar',
    errors: {
      loadProfile: 'Error al cargar perfil',
      unknown: 'Error desconocido',
    },
  },

  settings: {
    title: 'Configuración',
    language: {
      title: 'Idioma',
      description: 'Cambia el idioma de la interfaz',
    },
    display: {
      title: 'Visualización de Highlights',
      description: 'Configura cómo se muestran tus highlights',
      style: {
        label: 'Estilo de visualización',
        compact: {
          title: 'Compacto',
          description: 'Muestra solo el texto',
        },
        detailed: {
          title: 'Detallado',
          description: 'Incluye ubicación y fecha',
        },
      },
      order: {
        label: 'Orden de highlights',
        byDate: {
          title: 'Por fecha',
          description: 'Más recientes primero',
        },
        byLocation: {
          title: 'Por ubicación',
          description: 'Orden del libro',
        },
      },
    },
    export: {
      title: 'Exportación',
      description: 'Preferencias para exportar tus highlights',
      content: {
        label: 'Contenido a incluir',
        personalNotes: 'Incluir notas personales',
        location: 'Incluir ubicación',
        date: 'Incluir fecha',
      },
      style: {
        label: 'Estilo de exportación',
        compact: {
          title: 'Compacto',
          description: 'Todo en una línea',
        },
        detailed: {
          title: 'Detallado',
          description: 'Información separada',
        },
      },
      preview: {
        label: 'Vista previa del export',
      },
    },
    examples: {
      quijoteTitle: '📖 El Quijote - Miguel de Cervantes',
      quijoteQuote: 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo...',
      quijoteNote: '💭 Nota: Comienzo clásico de la literatura española',
      libertadQuote: 'La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos...',
      libertadNote: '💭 Nota: Reflexión sobre la libertad',
      location: '📍 Ubicación: 123-125',
      date: '📅 Fecha: 15 de marzo de 2024',
    },
  },

  modals: {
    collection: {
      title: 'Nueva colección',
      editTitle: 'Editar colección',
      name: 'Nombre',
      nameRequired: 'El nombre es obligatorio',
      namePlaceholder: 'ej: Ficción, Negocios, Favoritos...',
      description: 'Descripción (opcional)',
      descriptionPlaceholder: 'Describe esta colección...',
      icon: 'Icono',
      color: 'Color',
      preview: 'Vista previa:',
      previewName: 'Nombre de la colección',
      cancel: 'Cancelar',
      create: 'Crear',
      update: 'Actualizar',
      close: 'Cerrar',
      success: {
        created: 'Colección creada',
        updated: 'Colección actualizada',
      },
      errors: {
        save: 'Error al guardar colección',
        unknown: 'Error desconocido',
      },
    },
  },

  landing: {
    hero: {
      title: 'Exporta Highlights de Kindle',
      subtitle: 'Extrae todas tus notas de Kindle, incluyendo libros de fuentes externas. Convierte My Clippings.txt en highlights organizados y exportables.',
      cta: 'Extraer Mis Highlights Ahora',
      dragDrop: 'Arrastra tu archivo My Clippings.txt aquí',
      uniqueValue: {
        title: '¡Extrae highlights de CUALQUIER libro Kindle!',
        description: 'Libros de Amazon, PDFs, EPUBs, MOBIs, libros descargados de internet...',
        subtitle: 'No importa de dónde venga el libro. Si lo leíste en tu Kindle, podemos extraer tus highlights',
        badge: '⚡ VENTAJA ÚNICA',
        comparison: {
          onlyAmazon: 'Solo Amazon',
          allBooks: 'TODOS los libros',
        },
      },
    },
    tutorial: {
      title: 'Cómo Encontrar tu Archivo My Clippings.txt',
      subtitle: 'Sigue estos 3 pasos simples para localizar y extraer tus highlights de Kindle',
      steps: {
        step1: {
          title: 'Conecta tu Kindle',
          description: 'Usa el cable USB para conectar tu Kindle a tu computadora. El dispositivo aparecerá como una unidad de almacenamiento.',
        },
        step2: {
          title: 'Navega a la carpeta',
          description: 'Abre la carpeta "documents" en la raíz de tu Kindle. Busca el archivo "My Clippings.txt".',
        },
        step3: {
          title: 'Copia el archivo',
          description: 'Copia "My Clippings.txt" a tu computadora y súbelo aquí. ¡Es así de fácil!',
        },
      },
    },
    features: {
      title: 'Características Únicas de Nuestra Herramienta',
      items: {
        organize: {
          title: 'Extrae TODOS los libros',
          description: 'No solo libros de Amazon. Funciona con PDFs, EPUBs, MOBIs y cualquier archivo que hayas leído en tu Kindle.',
        },
        export: {
          title: 'Exporta a múltiples formatos',
          description: 'Descarga tus highlights en Markdown, PDF o ZIP. Compatible con Notion, Obsidian y más.',
        },
        cloud: {
          title: 'Sincronización en la nube',
          description: 'Accede a tus highlights desde cualquier dispositivo. Tus datos están seguros y siempre disponibles.',
        },
        privacy: {
          title: 'Privacidad total',
          description: 'Tus notas son tuyas. Procesamiento local opcional y cifrado de extremo a extremo.',
        },
      },
    },
    testimonials: {
      title: 'Lo que dicen nuestros usuarios',
      subtitle: 'Miles de usuarios ya han extraído sus highlights de Kindle con nuestra herramienta',
      items: {
        testimonial1: {
          name: 'María González',
          role: 'Estudiante de Literatura',
          content: 'Increíble herramienta. Pude extraer todos mis highlights de libros que descargué de internet. Antes era imposible organizarlos.',
        },
        testimonial2: {
          name: 'Carlos Ruiz',
          role: 'Investigador',
          content: 'Finalmente puedo exportar mis notas de libros técnicos que no compré en Amazon. La herramienta funciona perfectamente.',
        },
        testimonial3: {
          name: 'Ana Martín',
          role: 'Escritora',
          content: 'He probado muchas herramientas pero esta es la única que funciona con TODOS mis libros Kindle, sin importar de dónde los conseguí.',
        },
      },
    },
    stats: {
      books: 'libros procesados',
      highlights: 'highlights organizados',
      users: 'usuarios felices',
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: {
        q1: {
          question: '¿Funciona con libros que NO compré en Amazon?',
          answer: '¡Sí! Esta es nuestra ventaja principal. Funciona con PDFs, EPUBs, MOBIs y cualquier archivo que hayas leído en tu Kindle, sin importar de dónde lo conseguiste.',
        },
        q2: {
          question: '¿Dónde encuentro mi archivo My Clippings.txt?',
          answer: 'Conecta tu Kindle a tu computadora. El archivo está en la carpeta raíz: Kindle/documents/My Clippings.txt',
        },
        q3: {
          question: '¿Es gratis?',
          answer: 'Totalmente gratis. Sin límites, sin anuncios, sin tarjeta de crédito requerida.',
        },
        q4: {
          question: '¿Qué formatos de export soportan?',
          answer: 'Actualmente exportamos a Markdown (.md), compatible con Notion, Obsidian, Roam Research y otras apps.',
        },
        q5: {
          question: '¿Soporta múltiples idiomas?',
          answer: 'Sí. Detectamos automáticamente el idioma de tus highlights y los procesamos correctamente.',
        },
      },
    },
    cta: {
      title: '¿Listo para extraer tus notas?',
      subtitle: 'Únete a miles de usuarios que ya organizan sus notas de Kindle con nuestra herramienta',
    },
    footer: {
      madeWith: 'Hecho con ❤️ para lectores',
      privacy: 'Privacidad',
      terms: 'Términos',
    },
  },

  upload: {
    title: 'Sube tu archivo',
    subtitle: 'Arrastra y suelta tu archivo My Clippings.txt o haz clic para seleccionar',
    dragActive: '¡Suelta el archivo aquí!',
    selectFile: 'Seleccionar archivo',
    processing: 'Procesando...',
    error: 'Error al procesar el archivo',
    success: 'Archivo procesado exitosamente',
    dragDrop: 'Arrastra tu My Clippings.txt aquí',
    orClick: 'o haz clic para seleccionar',
    processFile: 'Haz clic en "Procesar archivo" para continuar',
    privacy: 'Todo ocurre en tu navegador. No subimos tu archivo.',
  },

  process: {
    title: 'Tus libros',
    backToHome: 'Volver al inicio',
    foundBooks: 'libros encontrados',
    totalHighlights: 'highlights totales',
    selectBook: 'Selecciona un libro para ver sus highlights',
    phases: {
      reading: {
        label: '📖 Leyendo tu archivo Kindle...',
        description: 'Analizando la estructura de tus notas',
        hint: '📄 Procesando bytes del archivo...',
      },
      detecting: {
        label: '🌍 Detectando idioma...',
        description: 'Identificando el formato de tus notas',
        hint: '🔍 Analizando patrones de fecha y ubicación...',
      },
      parsing: {
        label: '✨ Procesando notas...',
        description: 'Extrayendo y organizando tus notas',
        hint: '⚡ Extrayendo texto y metadata...',
      },
      organizing: {
        label: '📚 Organizando biblioteca...',
        description: 'Agrupando libros y verificando duplicados',
        hint: '🗂️ Creando índices y eliminando duplicados...',
      },
      complete: {
        label: '🎉 ¡Completado!',
        description: 'Tu biblioteca está lista',
        hint: '✅ Todo listo para visualizar',
      },
    },
    exportSingle: 'Exportar este libro',
    exportAll: 'Exportar todos',
    saveToAccount: 'Guardar en mi cuenta',
    loginRequired: 'Inicia sesión para guardar',
    saving: 'Guardando...',
    saveSuccess: '¡Guardado exitosamente!',
    saveError: 'Error al guardar',
    table: {
      text: 'Highlight',
      note: 'Nota',
      location: 'Ubicación',
      page: 'Página',
      date: 'Fecha',
    },
  },


  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
  },

  // Export limits
  exportLimits: {
    banner: {
      limitReached: {
        title: 'Límite alcanzado',
        message: 'Has usado tus 2 exportaciones gratis. Regístrate para exportaciones ilimitadas y guardar tu biblioteca permanentemente.',
      },
      lastExport: {
        title: 'Te queda 1 exportación gratis',
        message: 'Regístrate para exportaciones ilimitadas y no perder tu biblioteca.',
      },
      default: {
        title: 'Tienes 2 exportaciones gratis',
        message: 'Regístrate para exportaciones ilimitadas y guardar tu biblioteca.',
      },
      registerButton: 'Registrarse gratis',
      closeButton: 'Cerrar',
    },
  },

  // Export
  export: {
    singleBook: {
      notes: 'notas',
      note: 'nota',
      exportButton: 'Exportar MD',
      successTitle: '¡Exportado con éxito!',
      successDescription: 'se ha descargado como Markdown.',
      errorTitle: 'Error al exportar',
      errorDescription: 'Error desconocido',
      limitReached: 'Límite alcanzado',
      limitDescription: 'Regístrate para exportaciones ilimitadas',
      exported: '¡Exportado!',
      exportedDescription: 'descargado',
      error: 'Error',
    },
    allBooks: {
      books: 'libros',
      book: 'libro',
      totalNotes: 'notas totales',
      saveToAccount: 'Guardar en mi cuenta',
      exportAllZip: 'Exportar todos (ZIP)',
      loginToExport: 'Login para exportar todos',
      successTitle: '¡Exportado con éxito!',
      successDescription: 'libros exportados en un archivo ZIP.',
      errorTitle: 'Error al exportar',
      errorDescription: 'Error desconocido',
    },
  },

  howItWorks: {
    title: 'Cómo funciona',
    subtitle: 'Descubre cómo Kindle Notes Organizer transforma tus notas de Kindle en una biblioteca organizada',
    stepsTitle: 'Proceso paso a paso',
    step: 'Paso',
    steps: {
      step1: {
        title: 'Sube tu archivo',
        description: 'Arrastra tu archivo My Clippings.txt desde tu Kindle. El sistema lo procesará automáticamente.',
      },
      step2: {
        title: 'Procesamiento inteligente',
        description: 'Nuestro algoritmo separa tus highlights por libro, detecta autores y organiza todo por fecha.',
      },
      step3: {
        title: 'Organiza con etiquetas',
        description: 'Crea etiquetas personalizadas para categorizar tus highlights por tema, importancia o cualquier criterio.',
      },
      step4: {
        title: 'Busca y filtra',
        description: 'Encuentra cualquier highlight usando nuestro buscador avanzado o filtra por etiquetas y colecciones.',
      },
      step5: {
        title: 'Exporta y comparte',
        description: 'Descarga tus highlights en Markdown para usar en Notion, Obsidian o cualquier otra aplicación.',
      },
    },
    featuresTitle: 'Características principales',
    features: {
      organize: {
        title: 'Organización automática',
        description: 'Agrupa tus highlights por libro y autor automáticamente, sin configuración manual.',
      },
      tags: {
        title: 'Sistema de etiquetas',
        description: 'Crea etiquetas personalizadas para organizar tus highlights por tema o importancia.',
      },
      search: {
        title: 'Búsqueda avanzada',
        description: 'Encuentra cualquier highlight usando palabras clave, autores o filtros específicos.',
      },
      export: {
        title: 'Exportación flexible',
        description: 'Descarga tus highlights en Markdown compatible con las mejores aplicaciones de notas.',
      },
    },
    faqTitle: 'Preguntas frecuentes',
    faq: {
      q1: {
        question: '¿Es seguro subir mi archivo My Clippings.txt?',
        answer: 'Sí, completamente seguro. Puedes procesar el archivo localmente sin crear cuenta, o guardarlo en la nube con cifrado de extremo a extremo.',
      },
      q2: {
        question: '¿Puedo usar la aplicación sin crear cuenta?',
        answer: 'Absolutamente. Puedes procesar y exportar tus highlights sin registrarte. La cuenta solo es necesaria para guardar en la nube.',
      },
      q3: {
        question: '¿Qué formatos de exportación soportan?',
        answer: 'Actualmente exportamos a Markdown (.md), que es compatible con Notion, Obsidian, Roam Research y muchas otras aplicaciones.',
      },
      q4: {
        question: '¿Hay límites en el número de highlights?',
        answer: 'No hay límites. Puedes procesar archivos con miles de highlights sin restricciones.',
      },
    },
    cta: {
      title: '¿Listo para organizar tus notas?',
      description: 'Comienza ahora mismo subiendo tu archivo My Clippings.txt',
      button: 'Comenzar ahora',
    },
  },

  privacy: {
    title: 'Política de Privacidad',
    subtitle: 'Tu privacidad es importante para nosotros. Aquí te explicamos cómo protegemos tus datos.',
    lastUpdated: 'Última actualización: Diciembre 2024',
    dataCollection: {
      title: 'Recopilación de datos',
      description: 'Solo recopilamos los datos necesarios para proporcionar el servicio: tu archivo My Clippings.txt y tu email (opcional).',
    },
    dataSecurity: {
      title: 'Seguridad de datos',
      description: 'Todos los datos están cifrados en tránsito y en reposo usando estándares de la industria.',
    },
    dataUsage: {
      title: 'Uso de datos',
      description: 'Tus datos solo se usan para procesar y organizar tus highlights. Nunca los compartimos con terceros.',
    },
    userRights: {
      title: 'Tus derechos',
      description: 'Puedes acceder, modificar o eliminar tus datos en cualquier momento desde tu cuenta.',
    },
    sections: {
      dataCollection: {
        title: '¿Qué datos recopilamos?',
        content: [
          'Recopilamos únicamente los datos necesarios para proporcionar nuestros servicios:',
          '• Tu archivo My Clippings.txt (contenido de tus highlights)',
          '• Tu dirección de email (solo si decides crear una cuenta)',
          '• Información de uso básica (número de libros procesados, etc.)',
          'No recopilamos información personal identificable adicional sin tu consentimiento explícito.',
        ],
      },
      dataUsage: {
        title: '¿Cómo usamos tus datos?',
        content: [
          'Utilizamos tus datos únicamente para:',
          '• Procesar y organizar tus highlights por libro y autor',
          '• Permitirte crear etiquetas y colecciones personalizadas',
          '• Facilitar la búsqueda y filtrado de tus notas',
          '• Generar archivos de exportación en formato Markdown',
          '• Mejorar nuestros algoritmos de procesamiento (de forma anónima)',
          'Nunca vendemos, alquilamos o compartimos tus datos con terceros.',
        ],
      },
      dataSecurity: {
        title: '¿Cómo protegemos tus datos?',
        content: [
          'Implementamos múltiples capas de seguridad:',
          '• Cifrado SSL/TLS para todos los datos en tránsito',
          '• Cifrado AES-256 para datos almacenados',
          '• Row Level Security (RLS) en nuestra base de datos',
          '• Acceso restringido solo a personal autorizado',
          '• Copias de seguridad regulares y seguras',
          '• Cumplimiento con estándares de seguridad de la industria',
        ],
      },
      userRights: {
        title: 'Tus derechos y control',
        content: [
          'Tienes control total sobre tus datos:',
          '• Acceso: Puedes ver todos tus datos en cualquier momento',
          '• Modificación: Puedes editar o actualizar tu información',
          '• Eliminación: Puedes eliminar tu cuenta y todos tus datos',
          '• Portabilidad: Puedes exportar todos tus datos en formato Markdown',
          '• Rectificación: Puedes corregir cualquier información inexacta',
          'Para ejercer cualquiera de estos derechos, contacta con nosotros.',
        ],
      },
    },
    contact: {
      title: '¿Tienes preguntas sobre privacidad?',
      description: 'Estamos aquí para ayudarte con cualquier duda sobre cómo protegemos tus datos.',
      button: 'Contactar privacidad',
    },
  },

  terms: {
    title: 'Términos de Servicio',
    subtitle: 'Al usar Kindle Notes Organizer, aceptas estos términos de servicio.',
    lastUpdated: 'Última actualización: Diciembre 2024',
    acceptance: {
      title: 'Aceptación de términos',
      description: 'Al usar nuestro servicio, aceptas automáticamente estos términos de servicio.',
    },
    restrictions: {
      title: 'Restricciones de uso',
      description: 'No puedes usar el servicio para actividades ilegales o que violen derechos de terceros.',
    },
    liability: {
      title: 'Limitación de responsabilidad',
      description: 'Nuestro servicio se proporciona "tal como está" sin garantías expresas o implícitas.',
    },
    changes: {
      title: 'Cambios en los términos',
      description: 'Nos reservamos el derecho de modificar estos términos en cualquier momento.',
    },
    sections: {
      acceptance: {
        title: '1. Aceptación de los Términos',
        content: [
          'Al acceder y usar Kindle Notes Organizer ("el Servicio"), aceptas estar sujeto a estos Términos de Servicio ("Términos").',
          'Si no estás de acuerdo con alguno de estos términos, no debes usar el Servicio.',
          'Estos términos constituyen un acuerdo legalmente vinculante entre tú y Kindle Notes Organizer.',
        ],
      },
      serviceDescription: {
        title: '2. Descripción del Servicio',
        content: [
          'Kindle Notes Organizer es una herramienta web que permite:',
          '• Procesar archivos My Clippings.txt de dispositivos Kindle',
          '• Organizar highlights por libro, autor y fecha',
          '• Crear etiquetas y colecciones personalizadas',
          '• Buscar y filtrar highlights',
          '• Exportar datos en formato Markdown',
          'El servicio se proporciona gratuitamente y puede incluir funcionalidades adicionales en el futuro.',
        ],
      },
      userObligations: {
        title: '3. Obligaciones del Usuario',
        content: [
          'Como usuario del Servicio, te comprometes a:',
          '• Proporcionar información precisa y actualizada',
          '• No usar el Servicio para actividades ilegales o fraudulentas',
          '• No intentar acceder a sistemas o datos no autorizados',
          '• Respetar los derechos de propiedad intelectual de terceros',
          '• No interferir con el funcionamiento del Servicio',
          '• Mantener la confidencialidad de tu cuenta',
        ],
      },
      intellectualProperty: {
        title: '4. Propiedad Intelectual',
        content: [
          'El contenido de tus highlights pertenece exclusivamente a ti.',
          'Kindle Notes Organizer no reclama propiedad sobre el contenido que procesas.',
          'Nos reservamos todos los derechos sobre el software, diseño y funcionalidades del Servicio.',
          'No puedes copiar, modificar o distribuir nuestro código sin autorización.',
        ],
      },
      privacy: {
        title: '5. Privacidad y Protección de Datos',
        content: [
          'Tu privacidad es importante para nosotros. Consulta nuestra Política de Privacidad para más detalles.',
          'Procesamos tus datos únicamente para proporcionar el Servicio.',
          'Implementamos medidas de seguridad apropiadas para proteger tu información.',
          'Puedes eliminar tus datos en cualquier momento.',
        ],
      },
      limitations: {
        title: '6. Limitaciones del Servicio',
        content: [
          'El Servicio se proporciona "tal como está" sin garantías de ningún tipo.',
          'No garantizamos que el Servicio esté libre de errores o interrupciones.',
          'No somos responsables por la pérdida de datos o daños indirectos.',
          'Nos reservamos el derecho de modificar o discontinuar el Servicio.',
        ],
      },
      termination: {
        title: '7. Terminación',
        content: [
          'Puedes terminar tu uso del Servicio en cualquier momento.',
          'Podemos suspender o terminar tu acceso por violación de estos términos.',
          'Al terminar, puedes exportar tus datos antes de la eliminación.',
          'Las disposiciones que por su naturaleza deban sobrevivir permanecerán en vigor.',
        ],
      },
    },
    important: {
      title: 'Aviso Importante',
      description: 'Estos términos pueden cambiar. Te notificaremos sobre cambios significativos.',
      note: 'El uso continuado del Servicio constituye aceptación de los términos modificados.',
    },
  },
};

