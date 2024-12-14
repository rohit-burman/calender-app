# Calendar App

This is a simple calendar application built with React, Vite, and Tailwind CSS. It allows users to view a calendar, add events, and manage a list of events.

## Features

-   **Calendar View**: Displays a monthly calendar view where users can navigate between months.
-   **Event Management**:
    -   Add new events with a title, description, and date.
    -   View a list of upcoming events.
-   **UI Components**: Utilizes modern UI components from the `@shadcn/ui` library.
-   **Styling**: Styled with Tailwind CSS for a responsive and visually appealing design.

## Running the App Locally

To run the app locally, follow these steps:

1. **Install Dependencies**:

    Make sure you have Node.js and npm installed. Then, navigate to the project directory in your terminal and run:

    ```bash
    npm install
    ```

2. **Start the Development Server**:

    Run the following command to start the development server:

    ```bash
    npm run dev
    ```

    This will start the app in development mode. Open your web browser and go to `http://localhost:5173` (or the port indicated in your terminal) to view the app.

## Building for Production

To build the app for production, run:

```bash
npm run build
```

This will create an optimized build of the app in the `dist` directory.

## Linting

To run ESLint and check for code quality issues, use:

```bash
npm run lint
```

## Previewing the Production Build

To preview the production build locally, run:

```bash
npm run preview
```

This will serve the built app from the `dist` directory.
