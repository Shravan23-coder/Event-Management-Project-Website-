# LUMINAE Events Portal — Setup Guide
Complete step-by-step instructions from folder setup to database.
## MANDATORY PR CHANGES MADE..........
## ✨ Update
Added minor UI improvements and enhancements.
---

## PROJECT STRUCTURE

```
EventPortal/
│
├── index.html          ← Homepage
├── events.html         ← Events listing page
├── register.html       ← Registration form page
├── db_setup.sql        ← Run this to create your database
│
├── css/
│   ├── style.css       ← Main styles (layout, components)
│   └── animations.css  ← All animation classes
│
├── js/
│   ├── main.js         ← Cursor, loader, scroll effects, counters
│   ├── validation.js   ← Form validation (JS)
│   └── events.js       ← Events filter logic
│
└── php/
    └── register.php    ← Backend: validates + saves to MySQL
```

---

## STEP 1 — SOFTWARE REQUIRED

Install these if you don't already have them:

| Software | Download |
|----------|----------|
| XAMPP (Apache + PHP + MySQL) | https://www.apachefriends.org |
| VS Code (recommended editor) | https://code.visualstudio.com |
| A modern browser (Chrome) | Already installed |

---

## STEP 2 — PLACE FILES

1. Open XAMPP and start **Apache** and **MySQL**.
2. Navigate to your XAMPP folder:
   - Windows: `C:\xampp\htdocs\`
   - Mac/Linux: `/Applications/XAMPP/htdocs/`
3. Create a folder named `EventPortal` inside `htdocs`.
4. Place ALL project files inside `htdocs/EventPortal/`.

Your structure should look like:
```
C:\xampp\htdocs\EventPortal\
    index.html
    events.html
    register.html
    db_setup.sql
    css\
    js\
    php\
```

---

## STEP 3 — CREATE THE DATABASE

### Option A — phpMyAdmin (Easiest)
1. Open your browser → go to: `http://localhost/phpmyadmin`
2. Click **"SQL"** tab at the top.
3. Open the file `db_setup.sql` in any text editor.
4. Copy ALL the SQL content.
5. Paste it into the phpMyAdmin SQL box.
6. Click **"Go"**.
7. You should see the `luminae_db` database and `registrations` table created.

### Option B — MySQL Command Line
```bash
mysql -u root -p
# (press Enter if no password)
source C:/xampp/htdocs/EventPortal/db_setup.sql
```

---

## STEP 4 — CONFIGURE DATABASE IN PHP

Open `php/register.php` and update these lines (around line 12–15):

```php
define('DB_HOST', 'localhost');   // Usually stays 'localhost'
define('DB_USER', 'root');        // Your MySQL username (default: root)
define('DB_PASS', '');            // Your MySQL password (default: empty)
define('DB_NAME', 'luminae_db'); // Keep this as luminae_db
```

---

## STEP 5 — OPEN THE WEBSITE

Open your browser and go to:

```
http://localhost/EventPortal/index.html
```

**Pages:**
- Homepage:    `http://localhost/EventPortal/index.html`
- Events:      `http://localhost/EventPortal/events.html`
- Register:    `http://localhost/EventPortal/register.html`

---

## STEP 6 — TEST REGISTRATION

1. Go to `http://localhost/EventPortal/register.html`
2. Fill in the form and submit.
3. Check your database:
   - Open phpMyAdmin → `luminae_db` → `registrations`
   - You should see your entry!

---

## FEATURES OVERVIEW

### Frontend
- Custom animated cursor
- Page loader with progress bar
- Smooth scroll-triggered animations
- Parallax floating elements
- Animated counter numbers
- Marquee scrolling text
- 3D card tilt on hover
- Event filter (All / Corporate / Exhibition / Conference / Activation)

### JavaScript Validation (validation.js)
- Real-time validation on blur
- Checks: required, min/max length, regex pattern, future dates
- Visual error/success states on each field
- Character counter on textarea
- Form shake animation on failed submit
- Loading spinner on submit button

### Backend (PHP + MySQL)
- Server-side validation (double validation after JS)
- Prepared statements (prevents SQL injection)
- Sanitizes all user input (XSS protection)
- Returns JSON responses
- Optional email notification (commented out, easy to enable)

---

## DATABASE TABLE STRUCTURE

```sql
registrations
├── id           INT AUTO_INCREMENT PRIMARY KEY
├── full_name    VARCHAR(100)
├── email        VARCHAR(150)
├── phone        VARCHAR(20)
├── company      VARCHAR(150)   (optional)
├── event_type   VARCHAR(50)
├── event_date   DATE
├── attendees    VARCHAR(20)
├── city         VARCHAR(100)
├── message      TEXT
├── status       ENUM('pending','confirmed','cancelled')
├── created_at   DATETIME
└── updated_at   DATETIME
```

---

## COMMON ISSUES

| Issue | Fix |
|-------|-----|
| Blank page / 404 | Make sure XAMPP Apache is running and files are in `htdocs/EventPortal/` |
| Form submits but no DB entry | Check `php/register.php` DB credentials |
| "Database connection failed" | Make sure MySQL is started in XAMPP |
| Fonts not loading | You need an internet connection (Google Fonts) |
| Cursor not visible | Custom cursor only works on desktop/laptop |

---

## TECHNOLOGIES USED

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3 (CSS Variables, Flexbox, Grid) |
| Animations | CSS Keyframes + JavaScript IntersectionObserver |
| Validation | Vanilla JavaScript (ES6+) |
| Backend | PHP 7.4+ |
| Database | MySQL via MySQLi (Prepared Statements) |
| Fonts | Google Fonts (Cormorant Garamond, Syne, DM Sans) |

---

*Built for academic submission — Luminae Events Portal*
