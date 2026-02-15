from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .routers import product, cart
import os


from fastapi.middleware.cors import CORSMiddleware

from . import model 
from .database import engine

# creates the tables in your .db file if they don't exist
model.Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Products API",
    description="A simple backend for managing products, carts, and images.",
    version="1.0.0",
)


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://products-bbby.onrender.com",
        "https://chieng-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
UPLOAD_DIR = os.path.join(STATIC_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)




# Mount the static directory
# This makes files in /static accessible at http://localhost:8000/static
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


app.include_router(product.router)
app.include_router(cart.router)
