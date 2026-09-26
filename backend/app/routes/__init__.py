from app.routes.auth import router as auth_router
from app.routes.prediction import router as prediction_router
from app.routes.history import router as history_router
from app.routes.analytics import router as analytics_router
from app.routes.profile import router as profile_router

__all__ = [
    "auth_router",
    "prediction_router",
    "history_router",
    "analytics_router",
    "profile_router"
]
