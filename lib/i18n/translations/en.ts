import { Translation } from '../types';

export const en: Translation = {
  // Navigation
  nav: {
    upload: 'Upload file',
    myAccount: 'My account',
    login: 'Sign in',
    logout: 'Sign out',
    language: 'Language',
    myBooks: 'My Books',
    tags: 'Tags',
    search: 'Search',
    myProfile: 'My Profile',
    settings: 'Settings',
    collections: 'Collections',
    newCollection: 'New collection',
    manageTags: 'Manage tags',
    backToBooks: 'Back to all books',
  },

  auth: {
    title: 'Sign in',
    subtitle: 'Access your account to export all your highlights',
    signupTitle: 'Create account',
    signupSubtitle: 'Create your account to save and export all your highlights',
    email: 'Email',
    password: 'Password',
    magicLink: 'Magic Link',
    login: 'Sign in',
    signup: 'Create account',
    createAccount: 'Create account',
    emailPlaceholder: 'your@email.com',
    passwordPlaceholder: '••••••••',
    checkEmail: 'Check your email',
    sendMagicLink: 'Send Magic Link',
    sending: 'Sending...',
    close: 'Close',
    passwordRequired: 'Please enter your password',
    sessionStarted: '✅ Session started successfully!',
    signupSuccess: 'Account created! Check your email to confirm your account.',
  },

  account: {
    myBooks: 'My Books',
    loadingLibrary: 'Loading library...',
    welcome: 'Welcome',
    unlimitedExports: 'You now have unlimited exports',
    uploadNewFile: 'Upload new file',
    emptyLibrary: {
      title: 'Your library is empty',
      description: 'Upload your My Clippings.txt file to start organizing your highlights',
      uploadButton: 'Upload file',
    },
    stats: {
      books: 'Books',
      notes: 'Notes',
      highlights: 'Highlights',
    },
    yourBooks: 'Your books',
    exportAllZip: 'Export all (ZIP)',
    loginToExport: 'Login to export',
    dangerousZone: 'Dangerous zone',
    deleteBookDescription: 'This action cannot be undone',
    deleteBook: 'Delete book',
    backToBooks: 'Back to all books',
    addToCollection: 'Add to collection',
    loading: 'Loading...',
    noCollectionsYet: 'You don\'t have collections yet',
    createFirstCollection: 'Create first collection',
    newCollection: 'New collection',
    books: 'books',
    removed: 'Removed',
    removedDescription: 'Book removed from collection',
    added: 'Added',
    addedDescription: 'Book added to collection',
    errorUpdatingCollection: 'Error updating collection',
    copyNotes: 'Notes copied to clipboard',
    downloadMarkdown: 'Markdown file downloaded',
    errors: {
      loadCollectionBooks: 'Could not load collection books',
      loadTagHighlights: 'Could not load tag highlights',
      loadLibrary: 'Error loading library',
      unknown: 'Unknown error',
      deleteBook: 'Error deleting',
      export: 'Error exporting',
      update: 'Error updating',
      updateDescription: 'Could not save changes',
    },
    success: {
      bookDeleted: 'Book deleted',
      bookDeletedDescription: 'The book has been removed from your library',
      coversAdded: 'Covers have been added successfully',
      metadataUpdated: 'Metadata updated!',
    },
    filters: {
      showingCollection: 'Showing books from collection',
      showingTag: 'Showing highlights with tag',
      clearFilter: 'Clear filter',
    },
  },

  tags: {
    myTags: 'My Tags',
    createNewTag: 'Create new tag',
    tagNamePlaceholder: 'Tag name (e.g.: Important, To review...)',
    create: 'Create',
    searchTags: 'Search tags...',
    clearSearch: 'Clear tag search',
    yourTags: 'Your tags',
    noTags: 'You have no tags created',
    noTagsDescription: 'Create your first tag to organize your highlights',
    createFirstTag: 'Create first tag',
    highlightsTagged: 'highlights tagged',
    highlights: 'highlights',
    highlight: 'highlight',
    searchInHighlights: 'Search in highlights...',
    clearHighlightSearch: 'Clear search',
    exportTagHighlights: 'Export tag highlights',
    deleteTag: 'Delete tag',
    noHighlightsInTag: 'No highlights with this tag',
    noHighlightsInTagDescription: 'This tag has no associated highlights',
    backToTags: 'Back to all tags',
    createdOn: 'Created on',
    errors: {
      loadTags: 'Error loading tags',
      loadHighlights: 'Error loading highlights',
      createTag: 'Error creating tag',
      deleteTag: 'Error deleting',
      export: 'Error exporting',
      unknown: 'Unknown error',
    },
    success: {
      tagCreated: 'Tag created',
      tagDeleted: 'Tag deleted',
    },
    manageTags: 'Manage tags',
    addTag: 'Add tag',
    tag: 'tag',
    tags: 'tags',
    limitReached: 'Limit reached',
    maxTagsPerHighlight: 'Maximum 10 tags per highlight',
    tagAdded: 'Tag added',
    tagAddedDescription: 'added to highlight',
    tagRemoved: 'Tag removed',
    tagRemovedDescription: 'removed from highlight',
    couldNotAddTag: 'Could not add tag',
    couldNotRemoveTag: 'Could not remove tag',
    searchOrCreateTag: 'Search or create tag...',
    appliedTags: 'Applied tags',
    noTagsYet: 'No tags yet',
    searchOrCreateAbove: 'Search or create a tag above',
    tagsRemaining: 'tags remaining',
    tagRemaining: 'tag remaining',
  },

  search: {
    title: 'Search in your highlights',
    placeholder: 'Search by text, note, book...',
    loading: 'Loading...',
    noResults: 'Write something to search in your library',
    resultsFound: 'results found',
    results: 'results',
    result: 'result',
    clearSearch: 'Clear search',
    errors: {
      loadHighlights: 'Error loading highlights',
      unknown: 'Unknown error',
    },
  },

  profile: {
    title: 'My Profile',
    accountInfo: 'Account Information',
    memberSince: 'Member since',
    email: 'Email',
    books: 'Books',
    highlights: 'Highlights',
    change: 'Change',
    errors: {
      loadProfile: 'Error loading profile',
      unknown: 'Unknown error',
    },
  },

  settings: {
    title: 'Settings',
    language: {
      title: 'Language',
      description: 'Change the interface language',
    },
    display: {
      title: 'Highlight Display',
      description: 'Configure how your highlights are displayed',
      style: {
        label: 'Display style',
        compact: {
          title: 'Compact',
          description: 'Shows only the text',
        },
        detailed: {
          title: 'Detailed',
          description: 'Includes location and date',
        },
      },
      order: {
        label: 'Highlight order',
        byDate: {
          title: 'By date',
          description: 'Most recent first',
        },
        byLocation: {
          title: 'By location',
          description: 'Book order',
        },
      },
    },
    export: {
      title: 'Export',
      description: 'Preferences for exporting your highlights',
      content: {
        label: 'Content to include',
        personalNotes: 'Include personal notes',
        location: 'Include location',
        date: 'Include date',
      },
      style: {
        label: 'Export style',
        compact: {
          title: 'Compact',
          description: 'Everything in one line',
        },
        detailed: {
          title: 'Detailed',
          description: 'Separated information',
        },
      },
      preview: {
        label: 'Export preview',
      },
    },
    examples: {
      quijoteTitle: '📖 Don Quixote - Miguel de Cervantes',
      quijoteQuote: 'In a village of La Mancha, the name of which I have no desire to call to mind, there lived not long since one of those gentlemen...',
      quijoteNote: '💭 Note: Classic beginning of Spanish literature',
      libertadQuote: 'Liberty, Sancho, is one of the most precious gifts that heaven has bestowed upon men...',
      libertadNote: '💭 Note: Reflection on freedom',
      location: '📍 Location: 123-125',
      date: '📅 Date: March 15, 2024',
    },
  },

  modals: {
    collection: {
      title: 'New collection',
      editTitle: 'Edit collection',
      name: 'Name',
      nameRequired: 'Name is required',
      namePlaceholder: 'e.g.: Fiction, Business, Favorites...',
      description: 'Description (optional)',
      descriptionPlaceholder: 'Describe this collection...',
      icon: 'Icon',
      color: 'Color',
      preview: 'Preview:',
      previewName: 'Collection name',
      cancel: 'Cancel',
      create: 'Create',
      update: 'Update',
      close: 'Close',
      success: {
        created: 'Collection created',
        updated: 'Collection updated',
      },
      errors: {
        save: 'Error saving collection',
        unknown: 'Unknown error',
      },
    },
  },

  landing: {
    hero: {
      title: 'Export Kindle Highlights',
      subtitle: 'Extract all your Kindle notes, including books from external sources. Convert My Clippings.txt into organized and exportable highlights.',
      cta: 'Extract My Highlights Now',
      dragDrop: 'Drag your My Clippings.txt file here',
      uniqueValue: {
        title: 'Extract highlights from ANY Kindle book!',
        description: 'Amazon books, PDFs, EPUBs, MOBIs, books downloaded from the internet...',
        subtitle: 'No matter where the book comes from. If you read it on your Kindle, we can extract your highlights',
        badge: '⚡ UNIQUE ADVANTAGE',
        comparison: {
          onlyAmazon: 'Only Amazon',
          allBooks: 'ALL books',
        },
      },
    },
    tutorial: {
      title: 'How to Find Your My Clippings.txt File',
      subtitle: 'Follow these 3 simple steps to locate and extract your Kindle highlights',
      steps: {
        step1: {
          title: 'Connect your Kindle',
          description: 'Use the USB cable to connect your Kindle to your computer. The device will appear as a storage drive.',
        },
        step2: {
          title: 'Navigate to the folder',
          description: 'Open the "documents" folder in your Kindle root directory. Look for the "My Clippings.txt" file.',
        },
        step3: {
          title: 'Copy the file',
          description: 'Copy "My Clippings.txt" to your computer and upload it here. It\'s that simple!',
        },
      },
    },
    features: {
      title: 'Unique Features of Our Tool',
      items: {
        organize: {
          title: 'Extract ALL books',
          description: 'Not just Amazon books. Works with PDFs, EPUBs, MOBIs and any file you\'ve read on your Kindle.',
        },
        export: {
          title: 'Export to multiple formats',
          description: 'Download your highlights in Markdown, PDF or ZIP. Compatible with Notion, Obsidian and more.',
        },
        cloud: {
          title: 'Cloud synchronization',
          description: 'Access your highlights from any device. Your data is secure and always available.',
        },
        privacy: {
          title: 'Total privacy',
          description: 'Your notes are yours. Optional local processing and end-to-end encryption.',
        },
      },
    },
    testimonials: {
      title: 'What our users say',
      subtitle: 'Thousands of users have already extracted their Kindle highlights with our tool',
      items: {
        testimonial1: {
          name: 'Maria Gonzalez',
          role: 'Literature Student',
          content: 'Amazing tool. I was able to extract all my highlights from books I downloaded from the internet. It was impossible to organize them before.',
        },
        testimonial2: {
          name: 'Carlos Ruiz',
          role: 'Researcher',
          content: 'Finally I can export my notes from technical books that I didn\'t buy on Amazon. The tool works perfectly.',
        },
        testimonial3: {
          name: 'Ana Martin',
          role: 'Writer',
          content: 'I\'ve tried many tools but this is the only one that works with ALL my Kindle books, no matter where I got them from.',
        },
      },
    },
    stats: {
      books: 'books processed',
      highlights: 'highlights organized',
      users: 'happy users',
    },
    faq: {
      title: 'Frequently asked questions',
      items: {
        q1: {
          question: 'Does it work with books NOT bought on Amazon?',
          answer: 'Yes! This is our main advantage. It works with PDFs, EPUBs, MOBIs and any file you\'ve read on your Kindle, no matter where you got it from.',
        },
        q2: {
          question: 'Where do I find my My Clippings.txt file?',
          answer: 'Connect your Kindle to your computer. The file is in the root folder: Kindle/documents/My Clippings.txt',
        },
        q3: {
          question: 'Are my notes secure?',
          answer: 'Yes. You can process the file locally without creating an account. If you save to the cloud, your data is encrypted and protected with RLS.',
        },
        q4: {
          question: 'What export formats do you support?',
          answer: 'Currently we export to Markdown (.md), compatible with Notion, Obsidian, Roam Research and other apps.',
        },
        q5: {
          question: 'Does it support multiple languages?',
          answer: 'Yes. We automatically detect the language of your highlights and process them correctly.',
        },
      },
    },
    cta: {
      title: 'Ready to extract your highlights?',
      subtitle: 'Join thousands of users who already organize their Kindle notes with our tool',
    },
    footer: {
      madeWith: 'Made with ❤️ for readers',
      privacy: 'Privacy',
      terms: 'Terms',
    },
  },


  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
  },

  // Export limits
  exportLimits: {
    banner: {
      limitReached: {
        title: 'Limit reached',
        message: 'You have used your 2 free exports. Sign up for unlimited exports and save your library permanently.',
      },
      lastExport: {
        title: 'You have 1 free export left',
        message: 'Sign up for unlimited exports and don\'t lose your library.',
      },
      default: {
        title: 'You have 2 free exports',
        message: 'Sign up for unlimited exports and save your library.',
      },
      registerButton: 'Sign up for free',
      closeButton: 'Close',
    },
  },

  // Export
  export: {
    singleBook: {
      notes: 'notes',
      note: 'note',
      exportButton: 'Export MD',
      successTitle: 'Exported successfully!',
      successDescription: 'has been downloaded as Markdown.',
      errorTitle: 'Export error',
      errorDescription: 'Unknown error',
      limitReached: 'Limit reached',
      limitDescription: 'Sign up for unlimited exports',
      exported: 'Exported!',
      exportedDescription: 'downloaded',
      error: 'Error',
    },
    allBooks: {
      books: 'books',
      book: 'book',
      totalNotes: 'total notes',
      saveToAccount: 'Save to my account',
      exportAllZip: 'Export all (ZIP)',
      loginToExport: 'Login to export all',
      successTitle: 'Exported successfully!',
      successDescription: 'books exported in a ZIP file.',
      errorTitle: 'Export error',
      errorDescription: 'Unknown error',
    },
  },

  // Upload
  upload: {
    title: 'Upload file',
    subtitle: 'Drag and drop your My Clippings.txt file or click to select',
    dragActive: 'Drop the file here!',
    selectFile: 'Select file',
    processing: 'Processing...',
    error: 'Error processing file',
    success: 'File processed successfully',
    dragDrop: 'Drag your My Clippings.txt here',
    orClick: 'or click to select',
    processFile: 'Click "Process file" to continue',
    privacy: 'Everything happens in your browser. We don\'t upload your file.',
  },

  // Process
  process: {
    title: 'Your books',
    backToHome: 'Back to home',
    foundBooks: 'books found',
    totalHighlights: 'total highlights',
    selectBook: 'Select a book to view its highlights',
    phases: {
      reading: {
        label: '📖 Reading your Kindle file...',
        description: 'Analyzing the structure of your notes',
        hint: '📄 Processing file bytes...',
      },
      detecting: {
        label: '🌍 Detecting language...',
        description: 'Identifying the format of your notes',
        hint: '🔍 Analyzing date and location patterns...',
      },
      parsing: {
        label: '✨ Processing notes...',
        description: 'Extracting and organizing your notes',
        hint: '⚡ Extracting text and metadata...',
      },
      organizing: {
        label: '📚 Organizing library...',
        description: 'Grouping books and checking for duplicates',
        hint: '🗂️ Creating indexes and removing duplicates...',
      },
      complete: {
        label: '🎉 Complete!',
        description: 'Your library is ready',
        hint: '✅ Everything ready to view',
      },
    },
    exportSingle: 'Export this book',
    exportAll: 'Export all',
    saveToAccount: 'Save to my account',
    loginRequired: 'Login to save',
    saving: 'Saving...',
    saveSuccess: 'Saved successfully!',
    saveError: 'Error saving',
    table: {
      text: 'Highlight',
      note: 'Note',
      location: 'Location',
      page: 'Page',
      date: 'Date',
    },
  },




  // How it works
  howItWorks: {
    title: 'How it works',
    subtitle: 'Discover how Kindle Notes Organizer transforms your Kindle notes into an organized library',
    stepsTitle: 'Step by step process',
    step: 'Step',
    steps: {
      step1: {
        title: 'Upload your file',
        description: 'Drag your My Clippings.txt file from your Kindle. The system will process it automatically.',
      },
      step2: {
        title: 'Smart processing',
        description: 'Our algorithm separates your highlights by book, detects authors and organizes everything by date.',
      },
      step3: {
        title: 'Organize with tags',
        description: 'Create custom tags to categorize your highlights by theme, importance or any criteria.',
      },
      step4: {
        title: 'Search and filter',
        description: 'Find any highlight using our advanced search or filter by tags and collections.',
      },
      step5: {
        title: 'Export and share',
        description: 'Download your highlights in Markdown to use in Notion, Obsidian or any other app.',
      },
    },
    featuresTitle: 'Main features',
    features: {
      organize: {
        title: 'Automatic organization',
        description: 'Groups your highlights by book and author automatically, without manual configuration.',
      },
      tags: {
        title: 'Tag system',
        description: 'Create custom tags to organize your highlights by theme or importance.',
      },
      search: {
        title: 'Advanced search',
        description: 'Find any highlight using keywords, authors or specific filters.',
      },
      export: {
        title: 'Flexible export',
        description: 'Download your highlights in Markdown compatible with the best note-taking apps.',
      },
    },
    faqTitle: 'Frequently asked questions',
    faq: {
      q1: {
        question: 'Is it safe to upload my My Clippings.txt file?',
        answer: 'Yes, completely safe. You can process the file locally without creating an account, or save it to the cloud with end-to-end encryption.',
      },
      q2: {
        question: 'Can I use the app without creating an account?',
        answer: 'Absolutely. You can process and export your highlights without registering. The account is only needed to save to the cloud.',
      },
      q3: {
        question: 'What export formats do you support?',
        answer: 'Currently we export to Markdown (.md), which is compatible with Notion, Obsidian, Roam Research and many other applications.',
      },
      q4: {
        question: 'Are there limits on the number of highlights?',
        answer: 'No limits. You can process files with thousands of highlights without restrictions.',
      },
    },
    cta: {
      title: 'Ready to organize your notes?',
      description: 'Start now by uploading your My Clippings.txt file',
      button: 'Start now',
    },
  },

  // Privacy
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Your privacy is important to us. Here we explain how we protect your data.',
    lastUpdated: 'Last updated: December 2024',
    dataCollection: {
      title: 'Data collection',
      description: 'We only collect the data necessary to provide the service: your My Clippings.txt file and your email (optional).',
    },
    dataSecurity: {
      title: 'Data security',
      description: 'All data is encrypted in transit and at rest using industry standards.',
    },
    dataUsage: {
      title: 'Data usage',
      description: 'Your data is only used to process and organize your highlights. We never share it with third parties.',
    },
    userRights: {
      title: 'Your rights',
      description: 'You can access, modify or delete your data at any time from your account.',
    },
    sections: {
      dataCollection: {
        title: 'What data do we collect?',
        content: [
          'We only collect the data necessary to provide our services:',
          '• Your My Clippings.txt file (content of your highlights)',
          '• Your email address (only if you decide to create an account)',
          '• Basic usage information (number of books processed, etc.)',
          'We do not collect additional personally identifiable information without your explicit consent.',
        ],
      },
      dataUsage: {
        title: 'How do we use your data?',
        content: [
          'We use your data only to:',
          '• Process and organize your highlights by book and author',
          '• Allow you to create custom tags and collections',
          '• Facilitate searching and filtering of your notes',
          '• Generate export files in Markdown format',
          '• Improve our processing algorithms (anonymously)',
          'We never sell, rent or share your data with third parties.',
        ],
      },
      dataSecurity: {
        title: 'How do we protect your data?',
        content: [
          'We implement multiple layers of security:',
          '• SSL/TLS encryption for all data in transit',
          '• AES-256 encryption for stored data',
          '• Row Level Security (RLS) in our database',
          '• Access restricted to authorized personnel only',
          '• Regular and secure backups',
          '• Compliance with industry security standards',
        ],
      },
      userRights: {
        title: 'Your rights and control',
        content: [
          'You have total control over your data:',
          '• Access: You can view all your data at any time',
          '• Modification: You can edit or update your information',
          '• Deletion: You can delete your account and all your data',
          '• Portability: You can export all your data in Markdown format',
          '• Rectification: You can correct any inaccurate information',
          'To exercise any of these rights, contact us.',
        ],
      },
    },
    contact: {
      title: 'Do you have questions about privacy?',
      description: 'We are here to help you with any questions about how we protect your data.',
      button: 'Contact privacy',
    },
  },

  // Terms
  terms: {
    title: 'Terms of Service',
    subtitle: 'By using Kindle Notes Organizer, you accept these terms of service.',
    lastUpdated: 'Last updated: December 2024',
    acceptance: {
      title: 'Acceptance of terms',
      description: 'By using our service, you automatically accept these terms of service.',
    },
    restrictions: {
      title: 'Usage restrictions',
      description: 'You cannot use the service for illegal activities or that violate third-party rights.',
    },
    liability: {
      title: 'Liability limitation',
      description: 'Our service is provided "as is" without express or implied warranties.',
    },
    changes: {
      title: 'Changes to terms',
      description: 'We reserve the right to modify these terms at any time.',
    },
    sections: {
      acceptance: {
        title: '1. Acceptance of Terms',
        content: [
          'By accessing and using Kindle Notes Organizer ("the Service"), you agree to be bound by these Terms of Service ("Terms").',
          'If you do not agree with any of these terms, you should not use the Service.',
          'These terms constitute a legally binding agreement between you and Kindle Notes Organizer.',
        ],
      },
      serviceDescription: {
        title: '2. Service Description',
        content: [
          'Kindle Notes Organizer is a web tool that allows:',
          '• Processing My Clippings.txt files from Kindle devices',
          '• Organizing highlights by book, author and date',
          '• Creating custom tags and collections',
          '• Searching and filtering highlights',
          '• Exporting data in Markdown format',
          'The service is provided free of charge and may include additional features in the future.',
        ],
      },
      userObligations: {
        title: '3. User Obligations',
        content: [
          'As a user of the Service, you agree to:',
          '• Provide accurate and up-to-date information',
          '• Not use the Service for illegal or fraudulent activities',
          '• Not attempt to access unauthorized systems or data',
          '• Respect third-party intellectual property rights',
          '• Not interfere with the operation of the Service',
          '• Maintain the confidentiality of your account',
        ],
      },
      intellectualProperty: {
        title: '4. Intellectual Property',
        content: [
          'The content of your highlights belongs exclusively to you.',
          'Kindle Notes Organizer does not claim ownership of the content you process.',
          'We reserve all rights to the software, design and functionalities of the Service.',
          'You cannot copy, modify or distribute our code without authorization.',
        ],
      },
      privacy: {
        title: '5. Privacy and Data Protection',
        content: [
          'Your privacy is important to us. Please review our Privacy Policy for more details.',
          'We process your data only to provide the Service.',
          'We implement appropriate security measures to protect your information.',
          'You can delete your data at any time.',
        ],
      },
      limitations: {
        title: '6. Service Limitations',
        content: [
          'The Service is provided "as is" without warranties of any kind.',
          'We do not guarantee that the Service will be free of errors or interruptions.',
          'We are not responsible for data loss or indirect damages.',
          'We reserve the right to modify or discontinue the Service.',
        ],
      },
      termination: {
        title: '7. Termination',
        content: [
          'You can terminate your use of the Service at any time.',
          'We may suspend or terminate your access for violation of these terms.',
          'Upon termination, you can export your data before deletion.',
          'Provisions that by their nature must survive will remain in effect.',
        ],
      },
    },
    important: {
      title: 'Important Notice',
      description: 'These terms may change. We will notify you of significant changes.',
      note: 'Continued use of the Service constitutes acceptance of the modified terms.',
    },
  },
};