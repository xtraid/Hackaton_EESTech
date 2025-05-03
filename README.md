# Hackaton_EESTech

# Hackaton EESTech
di Nicola Battison, Christian Faccio, Manuel Magnabosco  
Maggio 2025 

## Problema Identificato

Il mercato delle e-bike sta crescendo rapidamente, ma gli attuali sistemi di gestione energetica presentano limitazioni significative:

- **Gestione inefficiente della batteria**: Gli utenti spesso rimangono con batteria scarica prima di completare il percorso,
- **Pianificazione del percorso rigida**: Gli utenti non possono ottimizzare i loro tragitti in base alle proprie preferenze di sforzo e autonomia,  
- **Esperienza utente poco personalizzata**: Con questo sistema non ci sono limitazioni come i "5 livelli di potenza" ma il programma si occupa dell'erogazione della potenza su una scala super discreta così da permettere di avere un'esperienza basata sul sentiment scelto e che non richiede intervento da parte dell'utente,

## La Nostra Soluzione: eBike Smart Assist

Un'applicazione mobile innovativa che utilizza intelligenza artificiale per ottimizzare l'esperienza di utilizzo delle e-bike, permettendo agli utenti di:

1. **Personalizzare il livello di sforzo fisico** attraverso un controllo intuitivo 
2. **Gestire l'autonomia della batteria** in modo flessibile

## Tecnologie e Implementazione

### Architettura del Sistema

```
Utente -> Interfaccia Web -> Algoritmo di Ottimizzazione -> Sistema di Controllo e-Bike
```

### Componenti Principali

#### App Mobile
- Interface per inserimento link Google Maps
- Slider orizzontale per selezione livello di sforzo 
- Controllo percentuale batteria desiderata all'arrivo
- Schermata di suggerimenti in caso di impossibilità

#### Sistema di Ottimizzazione 
- Algoritmo che calcola la distribuzione ottimale della potenza
- Sistema di erogazione che si adatta allo stile selto
- Aggiornamento in tempo reale delle stime

## Flusso Operativo

### Input Utente
- Link del percorso Google Maps 
- Livello di sforzo desiderato (0-100%)
- Livello di sentiment desiderato (eco, city, sport)

### Elaborazione
- Analisi del percorso (pendenze, distanza, condizioni traffico)
- Ottimizzazione distribuzione energetica lungo il percorso

### Output e Controllo
- Se fattibile: modulazione potenza motore in tempo reale
  
## Sviluppi Futuri

### Espansione Funzionalità

- Suggerimenti per modifiche parametri per ottimizzare il consumo o la velocità e la fattibilità
- Opzione cambio percorso alternativo 

### Miglioramenti Tecnologici

- Calcolo fattibilità basato su parametri utente
- **Machine Learning avanzato**: Predizione più accurata basata su comportamenti storici

## Conclusione

eBike Smart Assist rappresenta un'innovazione significativa nel settore della mobilità elettrica, combinando tecnologia avanzata con un'interfaccia user-friendly per creare un'esperienza di guida personalizzata e ottimizzata. La nostra soluzione non solo risolve problemi esistenti ma apre nuove possibilità per il futuro della mobilità sostenibile urbana.