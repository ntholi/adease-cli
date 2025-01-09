# adease

A CLI tool for generating Next.js admin panels with TypeScript support.

## Installation

```sh
npm install adease
```

## Features

- Generates complete admin panel CRUD ui
- Supports multiple databases:
  - Prisma
  - Drizzle (PostgreSQL and SQLite)
  - Firebase
- TypeScript support
- Built-in authentication
- Mantine UI components
- Server actions for data handling
- Automatic form generation
- List/detail view layouts

## Usage

### Initialize Project

First, initialize the admin panel in your Next.js project:

```sh
adease init
```

This will:

- Set up required base components
- Configure admin routes
- Create authentication setup
- Install UI components

### Generate CRUD Interface

Generate a complete CRUD interface for a model:

```sh
adease create
```

This will prompt you for:

- Model name
- Fields and their types
- Database selection
- Primary key type

## Project Structure

The tool generates:

- `/app/admin/[model]` - Routes and pages
- `/components/adease` - Reusable UI components
- `/server/[model]` - Server actions and repository
- `/db/schema` - Database schema definitions

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

## Stack

- Next.js
- TypeScript
- Mantine UI
- React Query
- Next-Auth
- Database of choice (Prisma/Drizzle/Firebase)

## License

MIT
