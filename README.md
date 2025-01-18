# Adease CLI

A CLI tool for generating database schemas and CRUD operations for Next.js applications.

## Installation

```bash
pnpm add adease
```

## Features

- Database schema generation with support for:
  - Drizzle (PostgreSQL and SQLite)
  - Prisma
  - Firebase
- Type-safe schema definitions
- Repository pattern implementation
- Automatic form generation
- Server-side actions

## Usage

### Initialize Project

```bash
adease init
```

This will prompt you for:
- Database selection (Drizzle, Prisma, or Firebase)
- Base directory configuration
- Admin routes setup

### Generate Schema and CRUD Operations

```bash
adease create <tableName> [fields...]
```

Example:
```bash
adease create users name:string email:string role:string
```

Supported field types:
- string
- number
- boolean
- date
- float
- bigint (Prisma only)

## Configuration

Configuration is stored in `adease.json`:

```json
{
  "baseDir": "src",
  "adminDir": "admin",
  "database": {
    "type": "drizzle|prisma|firebase",
    "engine": "postgresql|sqlite"
  }
}
```

## Project Structure

The tool generates:

- Database schema definitions
- Repository layer for data access
- Form components for data input
- Server actions for data operations

## License

MIT
