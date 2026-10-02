import os

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=10000
)

db = client[DATABASE_NAME]

users_collection = db["users"]
careers_collection = db["careers"]
recommendations_collection = db["recommendations"]


def test_database_connection():
    try:
        client.admin.command("ping")
        print("MongoDB connected successfully!")
        return True

    except Exception as error:
        print("MongoDB connection failed!")
        print(error)
        return False
