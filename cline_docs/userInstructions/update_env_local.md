# Instructions to Update Environment Configuration

To ensure the Mugshot Matcher application can correctly load the inmate data, please update your environment configuration file (`mug-matcher/.env.local` or your relevant environment setup).

**Action Required:**

1.  **Open your environment configuration file.**
    *   If you are running the application locally, this is typically `mug-matcher/.env.local`.
    *   If you are deploying to a platform like Render, you will need to update the environment variables in your service's settings on that platform.

2.  **Locate the `MUGSHOTS_CSV_PATH` variable.**

3.  **Update its value to point to the corrected CSV file:**
    ```
    MUGSHOTS_CSV_PATH=data/sorted_mugshots.csv
    ```
    *   Previously, it might have been pointing to `mugshotscripts/sorted_mugshots.csv` or another incorrect path.
    *   The `data/sorted_mugshots.csv` path assumes the application is run from the `mug-matcher` directory. The `csv-database.ts` script now has logic to try and resolve this correctly whether run from the project root or the `mug-matcher` subdirectory.

4.  **Save the changes to your environment configuration file.**

5.  **Restart your application.**
    *   If running locally, stop the development server (e.g., `Ctrl+C` in the terminal) and start it again (e.g., `npm run dev` or `pnpm dev`).
    *   If deployed, your hosting platform might automatically redeploy, or you may need to trigger a manual redeploy/restart.

After restarting, the application should attempt to load the CSV from the new path `mug-matcher/data/sorted_mugshots.csv`. Check your application's console logs for messages from `[CSV-DB]` to confirm if the data is loading correctly or if any new errors appear.
