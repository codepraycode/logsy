# Logsy

Logsy is a lightweight and user-friendly staff clock-in/clock-out system designed to simplify attendance tracking for teams and small businesses. With clean interfaces and accurate time logging, Logsy helps employers monitor work hours, reduce time fraud, and generate useful reports with ease.

---

## Setup and Installation

### Prerequisites

- Node.js (v18+ recommended)
- [pnpm](https://pnpm.io/) package manager (optional but recommended)
- DuckDB (used as embedded database)

---

### 1. Clone the repository

```bash
git clone <repository-url>
cd logsy
````

---

### 2. Install dependencies

Using pnpm (recommended):

```bash
pnpm install
```

Or with npm:

```bash
npm install
```

---

### 3. Setting up DuckDB

Logsy uses DuckDB as the embedded database. The DuckDB Node.js bindings sometimes require rebuilding to ensure native modules work correctly, especially when switching Node.js versions or environments.

#### Important: Rebuild DuckDB native modules

After installing dependencies or changing Node.js versions, run:

```bash
npm rebuild duckdb
```

Or with pnpm:

```bash
pnpm rebuild duckdb
```

This step is essential to avoid native module errors like:

```
Error: Cannot find module 'duckdb.node'
```

---

### 4. Database initialization

The database file `logsy.duckdb` will be created automatically on the first run if it doesn't exist. The `logs` table is created with the following schema:

```sql
CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY,
  name TEXT,
  type TEXT,
  timestamp TEXT,
  photoPath TEXT
)
```

> **Note:** DuckDB does not support `AUTOINCREMENT`. Instead, declaring `id` as `INTEGER PRIMARY KEY` enables auto-incrementing behavior.

---

### 5. Running the server

Start the server with hot reload support using `nodemon` (recommended):

```bash
npx nodemon src/server/index.js
```

Or directly with Node.js:

```bash
node src/server/index.js
```

The server runs on port `3020` by default.

---

### 6. Development notes

* The server exposes REST API endpoints under `/api`, including:

  * `/api/status` — Server health status
  * `/api/clock` — POST endpoint to log clock-in/out with optional photo upload
  * `/api/logs` — GET endpoint to fetch logs with optional date filters (`from`, `to`)
* File uploads are saved in the `uploads` directory (make sure it exists and is writable).
* Example queries use prepared statements with parameters to avoid SQL injection.

---

### Troubleshooting

* If you encounter errors related to DuckDB native modules, run the rebuild step again:

```bash
pnpm rebuild duckdb
```

or

```bash
npm rebuild duckdb
```

* Make sure your Node.js version matches the native modules installed (using [nvm](https://github.com/nvm-sh/nvm) helps manage this).
* Verify that the `uploads` directory exists and is writable to avoid issues with file uploads.

---

### Additional Tips

* Use environment variables or configuration files to customize the database file path or server port in production.
* For production, consider using a process manager like [`pm2`](https://pm2.keymetrics.io/) for running the Node.js server.
* You can improve developer experience with hot reload by using [`nodemon`](https://nodemon.io/).

---

Feel free to open issues or contribute to improve Logsy!

---

*© 2025 Logsy — Built with ❤️*
