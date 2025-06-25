from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.order import OrderDB
from app.models.cart import CartDB
from app.models.inventory import InventoryDB
from app.models.delivery import DeliveryDB
from app.schemas.dashboard import DashboardSummary

router = APIRouter()
@router.get("/dashboard", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_orders = db.query(OrderDB).count()
    total_inventory_items = db.query(InventoryDB).count()
    total_carts = db.query(CartDB).count()
    total_deliveries = db.query(DeliveryDB).count()

    recent_orders = db.query(OrderDB).order_by(OrderDB.created_at.desc()).limit(5).all()
    recent_inventory = db.query(InventoryDB).order_by(InventoryDB.created_at.desc()).limit(5).all()
    recent_deliveries = db.query(DeliveryDB).order_by(DeliveryDB.created_at.desc()).limit(5).all()

    return {
        "total_orders": total_orders,
        "total_inventory_items": total_inventory_items,
        "total_carts": total_carts,
        "total_deliveries": total_deliveries,
        "recent_orders": recent_orders,
        "recent_inventory": recent_inventory,
        "recent_deliveries": recent_deliveries,
    }
