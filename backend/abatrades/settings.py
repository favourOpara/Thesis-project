from dotenv import load_dotenv
from pathlib import Path
import os
import dj_database_url

if os.path.exists('.env'):
    load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# CRITICAL: Set DEBUG and ALLOWED_HOSTS early, before any Django imports
DEBUG = True
ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-3lw7520nzk4a4&6gf$=^iphhhpyuj$a5(+avs6#ghx%y@9v8-!'

# Payment & Platform
PAYSTACK_SECRET_KEY = os.environ.get("PAYSTACK_SECRET_KEY", "")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

# Local file storage for testing (Cloudinary disabled)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Force reload default storage to pick up our settings
# Temporarily commented out - causing settings load issues
# from django.core.files.storage import storages
# from django.core.files import storage

# Clear the cached default storage and force reload
# if hasattr(storage, '_default_storage'):
#     storage._default_storage = None

# Explicitly set the default storage
# from cloudinary_storage.storage import MediaCloudinaryStorage
# storage.default_storage = MediaCloudinaryStorage()

# STATIC FILES (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

# Application definition
INSTALLED_APPS = [
    # 'cloudinary_storage',  # Disabled for local testing
    # 'cloudinary',  # Disabled for local testing

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',

    'accounts',
    'products',
    'cart',
    'orders',
    'subscriptions',
    'inquiries',
    'recommendations',

    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'rest_framework.authtoken',
]

SITE_ID = 1

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = False

CORS_ALLOW_ALL_ORIGINS = False  # More secure - specify allowed origins
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Frontend dev server
    "http://localhost:3000",  # Alternative port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://mine-production-1f69.up.railway.app",  # Production frontend
]
CORS_ALLOW_CREDENTIALS = True  # Required for HttpOnly cookies

# Cookie settings for security
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = not DEBUG  # HTTPS only in production

# CSRF settings
CSRF_COOKIE_HTTPONLY = False  # Frontend needs to read CSRF token
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = not DEBUG
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://mine-production-1f69.up.railway.app",  # Production frontend
]

ROOT_URLCONF = 'abatrades.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'abatrades.wsgi.application'

# Database
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}"
    )
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
    {'NAME': 'accounts.validators.CustomPasswordValidator',},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'accounts.authentication.JWTCookieAuthentication',  # Read JWT from HttpOnly cookies
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # Fallback to header auth
    ],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated'],
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
    "BLACKLIST_AFTER_ROTATION": True,
}

AUTH_USER_MODEL = "accounts.CustomUser"

ACCOUNT_USER_MODEL_USERNAME_FIELD = None  # Disable username handling by allauth
ACCOUNT_AUTHENTICATION_METHOD = "email"   # Authenticate using email
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False

# Authentication backends
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

# Google OAuth credentials
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': '199766904815-fppnog3lkofrudpd9jquqndg9a0rj18k.apps.googleusercontent.com',
            'secret': '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',
            'key': ''
        }
    }
}

# dj-rest-auth settings
REST_USE_JWT = True

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'loggers': {
        'django.security.csrf': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}