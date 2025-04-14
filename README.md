```markdown
# Ibhayi Pharmacy Prescription Management System

This project is a web-based prescription management system developed for Ibhayi Pharmacy. It allows pharmacy staff to manage prescriptions, dispense medication, and track stock levels, while also enabling customers to load prescriptions and order medication for collection.

## Technologies Used

* **Backend:** Laravel (PHP Framework)
* **Frontend:** React (JavaScript Library - Laravel Starter Kit)
* **Database:** MYSQL

## Project Setup

### Prerequisites

Before you begin, ensure you have the following installed:

* **PHP:** Version 8.1 or higher (as assumed by Laravel's current requirements)
* **Composer:** PHP Dependency Manager
* **Node.js:** Version 16 or higher (includes npm - Node Package Manager)
* **MYSQL:** (Usually comes pre-installed on macOS and Linux, check your system)

### Installation

1.  **Clone the Repository:**

    ```bash
    git clone \[Your Repository URL]
    cd \[Project Directory Name]
    ```

2.  **Backend Setup (Laravel):**

    * **Install Composer Dependencies:**

        ```bash
        composer install
        ```

    * **Copy Environment File:**

        ```bash
        cp .env.example .env
        ```

    * **Configure Database Connection:**

        * Since your `.env` specifies `DB_CONNECTION=sqlite`, Laravel will use an SQLite database. Laravel automatically creates a `database/database.sqlite` file if it doesn't exist. You might need to create an empty file:

            ```bash
            touch database/database.sqlite
            ```

        * **Note:** You **do not** need to change the `DB_HOST`, `DB_PORT`, `DB_USERNAME`, or `DB_PASSWORD` in your `.env` file since you are using SQLite.

    * **Generate Application Key:**

        ```bash
        php artisan key:generate
        ```

    * **Run Database Migrations:**

        ```bash
        php artisan migrate
        ```

        * This will create the necessary tables in your `database/database.sqlite` file.

    * **Seed the Database (Optional):**

        ```bash
        php artisan db:seed
        ```

        * If you have any seeders to populate initial data (e.g., admin user, default roles), run this command.

    * **Serve the Application:**

        ```bash
        php artisan serve
        ```

        * The Laravel backend will now be running on `http://localhost:8000` (by default).

3.  **Frontend Setup (React - Laravel Starter Kit):**

    * **Install Node.js Dependencies:**

        ```bash
        npm install
        ```

    * **Run the Development Server:**

        ```bash
        npm run dev
        ```

        * The React frontend will typically run on `http://localhost:5173`. (This may vary, check your console output).

4.  **Configuration:**

    * **Backend URL in Frontend:**
        * You might need to configure the base URL of your Laravel backend in your React application (e.g., in API service files). This ensures that the frontend can communicate with the backend. Environment variables or configuration files within your React project are the standard way to handle this. Since your `APP_URL` is `http://localhost`, ensure your frontend API calls are directed to `http://localhost`.

### Running the Application

1.  **Start the Laravel backend:**

    ```bash
    php artisan serve
    ```

2.  **Start the React frontend:**

    ```bash
    npm run dev
    ```

3.  **Access the application in your browser:**

    * Backend: `http://localhost:8000` (for API endpoints)
    * Frontend: `http://localhost:5173` (or the URL shown in your terminal)

### API Documentation

\[Provide a link to your API documentation - e.g., using Swagger, Postman Collection, or a markdown file. This is crucial for frontend developers.]

### Database Schema

\[Include a visual representation or description of your database schema (ERD) or a link to the documentation. This helps understand the data structure.]

### Contributing

\[If you want others to contribute, add guidelines here. This is often not necessary for a small, closed project.]

### License

\[Specify the license under which your project is released. If it's for academic purposes, you might state "For academic use only."]

### Authors

* Siliziwe Yangapi (s217956289@mandela.ac.za)
* Nontyatyambo Nomsobo (s217464025@mandela.ac.za)
* Didintle Lecoge (s220454043@mandela.ac.za)

### Acknowledgements

\[Acknowledge any libraries, frameworks, or resources that were particularly helpful.]

**Key Improvements Based on Your `.env`:**

* **Database:** I've corrected the database setup instructions to reflect that you're using SQLite. This is important because SQLite doesn't require a separate server or host/user/password configuration.
* **`.env` Relevance:** I've made it clear which parts of the `.env` file are relevant and which are not (e.g., the MySQL settings are not used).
* **Frontend URL:** I've emphasized the need to ensure the frontend correctly points to the `APP_URL` (`http://localhost`).
* **Simplicity:** The instructions are slightly more streamlined, knowing that SQLite simplifies the database setup.

This version is much more accurate and helpful because it directly reflects your project's configuration.
