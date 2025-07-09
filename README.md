# Canvas Template Manager

A single-page application (SPA) for managing canvas templates, built as a test assignment. The application allows users to authenticate, view, create, edit, and delete templates via a REST API.

**Live Demo:** [**https://obuhhh.github.io/test-assignment-aiscreen/**](https://obuhhh.github.io/test-assignment-aiscreen/)

---

## Features

* **User Authentication:** Secure login page to access the main dashboard.
* **Template Dashboard:** Displays all available templates in a responsive grid layout.
* **CRUD Operations:**
    * **Create:** Add new templates through a modal form with image upload.
    * **Read:** View a list of templates and detailed information on a separate page.
    * **Update:** Edit template details, including name, description, dimensions, tags, and preview image.
    * **Delete:** Remove templates with a confirmation prompt.
* **Filtering:** Filter templates by tags for easier navigation.
* **Searching:** Search templates by input.
* **Routing:** Utilizes Vue Router for seamless navigation between the login, dashboard, and edit pages.
* **State Management:** Centralized state management with Pinia for a predictable and maintainable data flow.

## Tech Stack

* **Framework:** [Vue 3](https://vuejs.org/) (with Composition API and `<script setup>`)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Routing:** [Vue Router](https://router.vuejs.org/)
* **State Management:** [Pinia](https://pinia.vuejs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [Node.js](https://nodejs.org/) (version 18.x or higher is recommended)
* [npm](https://www.npmjs.com/) or another package manager

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/obuhhh/test-assignment-aiscreen.git](https://github.com/obuhhh/test-assignment-aiscreen.git)
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd test-assignment-aiscreen
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Test Credentials

You can use the following credentials to log in and test the application:

* **Email:** `hello@aiscreen.io`
* **Password:** `Demo!1234`

---

## Available Scripts

* `npm run dev`: Runs the app in development mode.
* `npm run build`: Builds the app for production to the `dist` folder.
* `npm run preview`: Serves the production build locally for preview.
* `npm run deploy`: Deploys the `dist` folder to the `gh-pages` branch.
