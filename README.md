
# Andd Baay Django Backend

This is the backend server for the Andd Baay agricultural platform, built with Django and Django REST Framework.

## Local Setup

### Prerequisites
- Python 3.8+
- PostgreSQL
- `pip` and `venv`

### 1. Clone the repository and set up a virtual environment
```bash
git clone <your-repo-url>
cd andd-baay-backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### 2. Install Dependencies
```bash
pip install django djangorestframework psycopg2-binary djangorestframework-simplejwt django-cors-headers
```

### 3. Configure Database
1. Create a PostgreSQL database for the project.
2. Open `andd_baay_project/settings.py` and update the `DATABASES` setting with your credentials.

### 4. Run Migrations
Apply the database schema:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create a Superuser
This will be your admin account for the Django Admin dashboard.
```bash
python manage.py createsuperuser
```

### 6. (Optional) Seed the Database
To populate the database with initial data, you can create and run a custom management command.

### 7. Run the Development Server
```bash
python manage.py runserver
```
The backend API will be available at `http://127.0.0.1:8000/api/`.
