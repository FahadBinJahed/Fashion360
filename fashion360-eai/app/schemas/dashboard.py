from pydantic import BaseModel
from typing import List
from app.schemas.order import Order
from app.schemas.inventory import Inventory
from app.schemas.delivery import Delivery

class DashboardSummary(BaseModel):
    total_orders: int
    total_inventory_items: int
    total_carts: int
    total_deliveries: int
    recent_orders: List[Order]
    recent_inventory: List[Inventory]
    recent_deliveries: List[Delivery]
