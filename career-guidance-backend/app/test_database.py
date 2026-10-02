from app.database.mongodb import careers_collection

careers = careers_collection.find()

for career in careers:
    print(career)
