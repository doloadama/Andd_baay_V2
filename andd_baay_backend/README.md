# Andd Baay Django Backend

This is the backend server for the Andd Baay agricultural platform, built with Django and Django REST Framework.

## Local Setup

### Prerequisites
- Python 3.8+
- PostgreSQL
- `pip` and `venv`

### 1. Clone the repository and set up a virtual environment
```bash
# Clone the repository (not provided, assume this is done)
# cd andd-baay-backend
python -m venv venv
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install django djangorestframework psycopg2-binary django-cors-headers djangorestframework-simplejwt
```

### 3. Configure Database
1.  In PostgreSQL, create a new database. For example, `CREATE DATABASE andd_baay_db;`.
2.  Open `andd_baay_backend/settings.py` and update the `DATABASES` dictionary with your PostgreSQL username, password, and the database name you just created.

### 4. Run Migrations
This command creates the tables in your database based on the models defined in `farmers/models.py`.
```bash
python manage.py makemigrations farmers
python manage.py migrate
```

### 5. Create a Superuser
This will be your admin account for the Django Admin dashboard, which you can access to manage your data.
```bash
python manage.py createsuperuser
```
Follow the prompts to create your admin user.

### 6. Run the Development Server
```bash
python manage.py runserver
```
The backend API will now be available at `http://127.0.0.1:8000/`.
- **API endpoints** are at `http://127.0.0.1:8000/api/`
- **Admin panel** is at `http://127.0.0.1:8000/admin/`
- **Login** at `http://127.0.0.1:8000/api/token/`
