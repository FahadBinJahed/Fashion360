from app.db.session import SessionLocal, Base
from app.models.inventory import InventoryDB
from sqlalchemy import text

def test_mysql_connection():
    db = SessionLocal()
    try:
        # Test raw connection
        result = db.execute(text("SELECT VERSION()"))
        print("MySQL version:", result.fetchone())
        
        # Test ORM mapping
        items = db.query(InventoryDB).limit(5).all()
        print("Found", len(items), "inventory items")
        
        return True
    except Exception as e:
        print("Connection failed:", e)
        return False
    finally:
        db.close()

if __name__ == "__main__":
    if test_mysql_connection():
        print("✅ MySQL connection successful!")
    else:
        print("❌ MySQL connection failed")
