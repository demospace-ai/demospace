# Demospace

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `supabase start`

Runs Supabase locally. Must have Docker Desktop installed and running.

Once you've run this command, copy `.env.example` to a new file `.env.local` and use
the output from `supabase start` to fill in the environment variables.

### Adding migrations

From the root directory, run

```sh
supabase migration new {name_of_migration}
```

To apply the migration locally, run

```sh
supabase migration up
```
