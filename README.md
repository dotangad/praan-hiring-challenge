# Praan Hiring Challenge

This project is a monorepo, and uses PNPM workspaces to manage apps.

## Frontend

The frontend (`apps/frontend`) is a Vite React app and uses -

- React Router for routing
- Chakra UI for components
- Chart.js and React Chartjs 2 for drawing charts
- React Query to fetch data
- React Hook Form for managing forms
- Jotai for global state

### How to run locally

```sh
cd apps/frontend

# Fill out .env
cp .env.example .env

# Install packages
pnpm install
pnpm run dev
```

## Backend

The backend (`apps/backend`) is built with Express and MongoDB. I used Prisma for type-safe database access, and Zod for validating request data.

### How to run locally

```sh
cd apps/backend

# Fill out .env
cp .env.example .env

# Install packages
pmpm install
pnpm run start
```

### Notes

- I used Passport.js to authenticate and register users, and JWTs for API authentication.
- File upload uses the `multer` package. Parsing and validating the uploaded CSV was the hardest part of building the backend. Before saving to the database, I check the file extension, mimetype and CSV headers. The code also validates each row before saving it to the database. This row validation involves parsing the non-standard date format in the data, I used a regex for this but it could also be done by splicing the string. Code for this route is in `apps/backend/src/controllers/BulkUploadController.ts`.
- Using Prisma for database access was a great choice. Since this is a monorepo, I could easily share the types generated by Prisma and use them on the frontend.
