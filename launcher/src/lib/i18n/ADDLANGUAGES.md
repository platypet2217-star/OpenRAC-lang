
# Add Languages

In the file src/lib/i18n/i18n.ts, you must import the language by adding it to the list

```sh
import en from './en.json';
import es from './es.json'; // 1. Import the Spanish file

// 2. Add it to the list of available translations
const translations: Record<string, any> = { en, es // Add language here}; 

```

It should also be possible to select this in the src/pages/Settings.svelte file

```sh
<select class="form-control dropdown-select" 
    value={i18n.currentLocale} 
    onchange={(e) => i18n.currentLocale = e.target.value}
    >
    <option value="en">English</option>
    <option value="es">Español</option> <!-- New option -->
</select>
```

All that remains is to add the translations to the JSON file; if it does not exist, you must create one and translate the content src/lib/i18n/es.json
