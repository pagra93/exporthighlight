// Types for i18n system
export type Language = 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt';

export interface Translation {
  // Navigation
  nav: {
    upload: string;
    myAccount: string;
    login: string;
    logout: string;
    language: string;
    myBooks: string;
    tags: string;
    search: string;
    myProfile: string;
    settings: string;
    collections: string;
    newCollection: string;
    manageTags: string;
  backToBooks: string;
  };
  
  // Auth
  auth: {
    title: string;
    subtitle: string;
    signupTitle: string;
    signupSubtitle: string;
    forgotPasswordTitle: string;
    forgotPasswordSubtitle: string;
    email: string;
    password: string;
    magicLink: string;
    login: string;
    signup: string;
    forgotPassword: string;
    createAccount: string;
    sendResetLink: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    checkEmail: string;
    sendMagicLink: string;
    sending: string;
    close: string;
    passwordRequired: string;
    sessionStarted: string;
    signupSuccess: string;
    passwordResetSent: string;
  };
  
  // Account pages
  account: {
    myBooks: string;
    loadingLibrary: string;
    welcome: string;
    unlimitedExports: string;
    uploadNewFile: string;
    emptyLibrary: {
      title: string;
      description: string;
      uploadButton: string;
    };
    stats: {
      books: string;
      notes: string;
      highlights: string;
    };
    yourBooks: string;
    exportAllZip: string;
    loginToExport: string;
    dangerousZone: string;
    deleteBookDescription: string;
    deleteBook: string;
    backToBooks: string;
    addToCollection: string;
    loading: string;
    noCollectionsYet: string;
    createFirstCollection: string;
    newCollection: string;
    books: string;
    removed: string;
    removedDescription: string;
    added: string;
    addedDescription: string;
    errorUpdatingCollection: string;
    copyNotes: string;
    downloadMarkdown: string;
    errors: {
      loadCollectionBooks: string;
      loadTagHighlights: string;
      loadLibrary: string;
      unknown: string;
      deleteBook: string;
      export: string;
      update: string;
      updateDescription: string;
    };
    success: {
      bookDeleted: string;
      bookDeletedDescription: string;
      coversAdded: string;
      metadataUpdated: string;
    };
    filters: {
      showingCollection: string;
      showingTag: string;
      clearFilter: string;
    };
  };
  
  // Tags page
  tags: {
    myTags: string;
    createNewTag: string;
    tagNamePlaceholder: string;
    create: string;
    searchTags: string;
    clearSearch: string;
    yourTags: string;
    noTags: string;
    noTagsDescription: string;
    createFirstTag: string;
    highlightsTagged: string;
    highlights: string;
    highlight: string;
    searchInHighlights: string;
    clearHighlightSearch: string;
    exportTagHighlights: string;
    deleteTag: string;
    noHighlightsInTag: string;
    noHighlightsInTagDescription: string;
    backToTags: string;
    createdOn: string;
    errors: {
      loadTags: string;
      loadHighlights: string;
      createTag: string;
      deleteTag: string;
      export: string;
      unknown: string;
    };
    success: {
      tagCreated: string;
      tagDeleted: string;
    };
    manageTags: string;
    addTag: string;
    tag: string;
    tags: string;
    limitReached: string;
    maxTagsPerHighlight: string;
    tagAdded: string;
    tagAddedDescription: string;
    tagRemoved: string;
    tagRemovedDescription: string;
    couldNotAddTag: string;
    couldNotRemoveTag: string;
    searchOrCreateTag: string;
    appliedTags: string;
    noTagsYet: string;
    searchOrCreateAbove: string;
    tagsRemaining: string;
    tagRemaining: string;
  };
  
  // Search page
  search: {
    title: string;
    placeholder: string;
    loading: string;
    noResults: string;
    resultsFound: string;
    results: string;
    result: string;
    clearSearch: string;
    errors: {
      loadHighlights: string;
      unknown: string;
    };
  };
  
  // Profile page
  profile: {
    title: string;
    accountInfo: string;
    memberSince: string;
    email: string;
    books: string;
    highlights: string;
    change: string;
    errors: {
      loadProfile: string;
      unknown: string;
    };
  };
  
  // Settings page
  settings: {
    title: string;
    language: {
      title: string;
      description: string;
    };
    display: {
      title: string;
      description: string;
      style: {
        label: string;
        compact: {
          title: string;
          description: string;
        };
        detailed: {
          title: string;
          description: string;
        };
      };
      order: {
        label: string;
        byDate: {
          title: string;
          description: string;
        };
        byLocation: {
          title: string;
          description: string;
        };
      };
    };
    export: {
      title: string;
      description: string;
      content: {
        label: string;
        personalNotes: string;
        location: string;
        date: string;
      };
      style: {
        label: string;
        compact: {
          title: string;
          description: string;
        };
        detailed: {
          title: string;
          description: string;
        };
      };
      preview: {
        label: string;
      };
    };
    examples: {
      quijoteTitle: string;
      quijoteQuote: string;
      quijoteNote: string;
      libertadQuote: string;
      libertadNote: string;
      location: string;
      date: string;
    };
  };
  
  // Modals
  modals: {
    collection: {
      title: string;
      editTitle: string;
      name: string;
      nameRequired: string;
      namePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      icon: string;
      color: string;
      preview: string;
      previewName: string;
      cancel: string;
      create: string;
      update: string;
      close: string;
      success: {
        created: string;
        updated: string;
      };
      errors: {
        save: string;
        unknown: string;
      };
    };
  };
  
  // Landing page
  landing: {
    hero: {
      badge: string;
      title: string;
      subtitle: string;
      cta: string;
      dragDrop: string;
      dashboardPreview: string;
    };
    tutorial: {
      title: string;
      subtitle: string;
      steps: {
        step1: { title: string; description: string };
        step2: { title: string; description: string };
        step3: { title: string; description: string };
      };
    };
    features: {
      title: string;
      items: {
        organize: { title: string; description: string };
        export: { title: string; description: string };
        cloud: { title: string; description: string };
        privacy: { title: string; description: string };
      };
    };
    testimonials: {
      title: string;
      subtitle: string;
      items: {
        testimonial1: { name: string; role: string; content: string };
        testimonial2: { name: string; role: string; content: string };
        testimonial3: { name: string; role: string; content: string };
      };
    };
    stats: {
      books: string;
      highlights: string;
      users: string;
    };
    faq: {
      title: string;
      items: {
        q1: { question: string; answer: string };
        q2: { question: string; answer: string };
        q3: { question: string; answer: string };
        q4: { question: string; answer: string };
        q5: { question: string; answer: string };
      };
    };
    cta: {
      title: string;
      subtitle: string;
    };
    footer: {
      madeWith: string;
      privacy: string;
      terms: string;
    };
  };

  // Upload section
  upload: {
    title: string;
    subtitle: string;
    dragActive: string;
    selectFile: string;
    processing: string;
    error: string;
    success: string;
    dragDrop: string;
    orClick: string;
    processFile: string;
    privacy: string;
  };

  // Process page
  process: {
    title: string;
    backToHome: string;
    foundBooks: string;
    totalHighlights: string;
    selectBook: string;
    phases: {
      reading: {
        label: string;
        description: string;
        hint: string;
      };
      detecting: {
        label: string;
        description: string;
        hint: string;
      };
      parsing: {
        label: string;
        description: string;
        hint: string;
      };
      organizing: {
        label: string;
        description: string;
        hint: string;
      };
      complete: {
        label: string;
        description: string;
        hint: string;
      };
    };
    exportSingle: string;
    exportAll: string;
    saveToAccount: string;
    loginRequired: string;
    saving: string;
    saveSuccess: string;
    saveError: string;
    table: {
      text: string;
      note: string;
      location: string;
      page: string;
      date: string;
    };
  };


  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
  };

  // Export limits
  exportLimits: {
    banner: {
      limitReached: {
        title: string;
        message: string;
      };
      lastExport: {
        title: string;
        message: string;
      };
      default: {
        title: string;
        message: string;
      };
      registerButton: string;
      closeButton: string;
    };
  };

  // Export
  export: {
    singleBook: {
      notes: string;
      note: string;
      exportButton: string;
      successTitle: string;
      successDescription: string;
      errorTitle: string;
      errorDescription: string;
      limitReached: string;
      limitDescription: string;
      exported: string;
      exportedDescription: string;
      error: string;
    };
    allBooks: {
      books: string;
      book: string;
      totalNotes: string;
      saveToAccount: string;
      exportAllZip: string;
      loginToExport: string;
      successTitle: string;
      successDescription: string;
      errorTitle: string;
      errorDescription: string;
    };
  };

  // How it works page
  howItWorks: {
    title: string;
    subtitle: string;
    stepsTitle: string;
    step: string;
    steps: {
      step1: { title: string; description: string };
      step2: { title: string; description: string };
      step3: { title: string; description: string };
      step4: { title: string; description: string };
      step5: { title: string; description: string };
    };
    featuresTitle: string;
    features: {
      organize: { title: string; description: string };
      tags: { title: string; description: string };
      search: { title: string; description: string };
      export: { title: string; description: string };
    };
    faqTitle: string;
    faq: {
      q1: { question: string; answer: string };
      q2: { question: string; answer: string };
      q3: { question: string; answer: string };
      q4: { question: string; answer: string };
    };
    cta: {
      title: string;
      description: string;
      button: string;
    };
  };

  // Privacy page
  privacy: {
    title: string;
    subtitle: string;
    lastUpdated: string;
    dataCollection: { title: string; description: string };
    dataSecurity: { title: string; description: string };
    dataUsage: { title: string; description: string };
    userRights: { title: string; description: string };
    sections: {
      dataCollection: { title: string; content: string[] };
      dataUsage: { title: string; content: string[] };
      dataSecurity: { title: string; content: string[] };
      userRights: { title: string; content: string[] };
    };
    contact: {
      title: string;
      description: string;
      button: string;
    };
  };

  // Terms page
  terms: {
    title: string;
    subtitle: string;
    lastUpdated: string;
    acceptance: { title: string; description: string };
    restrictions: { title: string; description: string };
    liability: { title: string; description: string };
    changes: { title: string; description: string };
    sections: {
      acceptance: { title: string; content: string[] };
      serviceDescription: { title: string; content: string[] };
      userObligations: { title: string; content: string[] };
      intellectualProperty: { title: string; content: string[] };
      privacy: { title: string; content: string[] };
      limitations: { title: string; content: string[] };
      termination: { title: string; content: string[] };
    };
    important: {
      title: string;
      description: string;
      note: string;
    };
  };
}

