# TeamSync - Chytrá aplikace pro fotbalovou kabinu ⚽

Kompletně přepracovaná mobilní a webová aplikace pro amatérský fotbalový tým se třemi rolemi: **Trenér (👔)**, **Kapitán (©️)** a **Hráč (👟)**.

---

## 📱 Jak otevřít a vyzkoušet aplikaci

Aplikace je připravena k okamžitému spuštění přímo v prohlížeči:
👉 **[teamsync/public/index.html](file:///C:/Users/Temin/.gemini/antigravity/scratch/teamsync/public/index.html)**

Stačí soubor otevřít v Google Chrome, Safari nebo Edge (na mobilu i počítači).

---

## 🛠️ Nové funkce a vyřešené problémy:

### 1. 🎨 Kompletní redesign vzhledu (Modern Athletic UI)
- Moderní tmavý sportovní design (Dark Theme) s fontem **Plus Jakarta Sans** a jemným efektem glassmorphismu.
- Autentický fotbalový trávník s pruhy po sečení (`pitch-stripes`), přesnými vápny, středovým kruhem a puntíky.
- Propracované dresy s čísly, kapitánskou páskou (C) a odlišením brankáře.
- Optimalizováno pro ovládání jednou rukou v šatně.

### 2. 👔 Trenér: Plně funkční přidávání tréninků a zápasů
- Tlačítko **„+ Přidat akci“** v záhlaví kalendáře (dostupné pro roli Trenéra).
- Přepínač mezi **🏃 Tréninkem** a **🏆 Zápasem**.
- Nastavení data, času srazu v šatně (`meetTime`), začátku/výkopu, místa konání i taktických poznámek.
- Nová akce se okamžitě zařadí do kalendáře a hráči se k ní mohou vyjádřit.

### 3. ⚽ Intuitivní skládání sestavy (Lineup Builder)
- **Výběr formace:** Trenér může zvolit rozestavení **4-3-3**, **4-4-2** nebo **3-5-2**.
- **Kliknutí na jakoukoliv pozici na hřišti:** Otevře přehledný výběr hráčů se zvýrazněním těch, kteří účast potvrdili (`✓ Potvrzeno`).
- **Kouzelná hůlka „Auto-sestava“:** Jedním klikem trenérovi automaticky naplní základní jedenáctku z hráčů, kteří potvrdili účast, a zbytek pošle na lavičku!
- **Střídačka (Lavička náhradníků):** Snadné zařazování a vyřazování náhradníků jedním kliknutím.
- **Zveřejnění sestavy:** Tlačítko pro zveřejnění oficiální sestavy celému týmu.

### 4. 🛡️ Správa a přepínání více týmů
- Kliknutím na logo/název týmu v záhlaví se otevře nabídka týmů.
- Tlačítko **„+ Vytvořit nový tým...“** umožňuje:
  - Zadat název nového klubu (např. *SK Dynamo Braník*)
  - Vybrat soutěž/ligu
  - Zvolit klubové logo (⚽, 🦁, 🦅, 🔥, ⚡) a barvu dresů
  - Vygenerovat unikátní zvací kód týmu (např. `DYN-42`)

### 5. 👥 Přidávání nových hráčů na soupisku
- V záložce **Kabina** je k dispozici tlačítko **„+ Hráč“** pro rychlé zapsání nového spoluhráče (jméno, přezdívka, číslo dresu, pozice, role a telefon).

### 6. 💰 Pokutová pokladna a sazebník
- Kapitán může jedním klikem pokutovat hráče nebo otevřít **Sazebník pokut** a přidat novou položku.
- Veřejná **Zeď dlužníků** s královskou korunkou 👑 pro největšího hříšníka.
- Tlačítko **„Zaplaceno ✓“** pro okamžité vyrovnání dluhu.
