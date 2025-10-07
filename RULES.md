# RULES (No-negociables)

1. **PRIVACIDAD**: Nunca subas el archivo My Clippings.txt al servidor por defecto.

2. **PARSEO EN CLIENTE** con Web Worker. El main thread nunca se bloquea > 16ms de forma sostenida.

3. **DEDUPE**: Un highlight es único por HASH(bookId + location|page + textNormalizado).

4. **GATING**: Sin login, solo exportar 1 libro por sesión. Con login, export masivo.

5. **UX**: Siempre feedback visible (progreso, totales, errores). Nada de estados silenciosos.

6. **ERRORES**: Catch y mensajes claros. No stacktraces al usuario.

7. **I18N PARSER**: Soporte mínimo ES/EN (strings MyClippings). Extensible a PT/DE/FR.

8. **SEGURIDAD**: RLS ON en Supabase. No almacenar raw file; solo datos parseados si el usuario decide "Guardar en mi cuenta".

9. **PERF**: Para archivos >5MB usar streaming/worker y paginación de UI. Memoria < 200MB.

10. **TESTS**: El parser debe pasar casos multi-idioma, ubicaciones, páginas, notas y separadores "==========".

