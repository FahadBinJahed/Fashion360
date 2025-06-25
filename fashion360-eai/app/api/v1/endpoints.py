from fastapi import APIRouter
from app.api.v1 import inventory, products, categories, orders, users, deliveries,carts,payments,staff_auth,dashboard

router = APIRouter()

router.include_router(inventory.router, prefix="/inventory", tags=["Inventory Endpoints"])
router.include_router(products.router, prefix="/products", tags=["Products Endpoints"])
router.include_router(categories.router, prefix="/categories", tags=["Categories Endpoints"])
router.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders Endpoints"])
router.include_router(users.router, prefix="/api/v1/users", tags=["Users Endpoints"])
router.include_router(deliveries.router, prefix="/deliveries", tags=["Deliveries Endpoints"])
router.include_router(carts.router, prefix="/carts", tags=["Carts Endpoints"])
router.include_router(payments.router, prefix="/payments", tags=["Payments Endpoints"])
router.include_router(staff_auth.router, prefix="/staff", tags=["Staff Auth Endpoints"])
router.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])