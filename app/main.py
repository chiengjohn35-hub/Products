from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .routers import product, cart
import os


from fastapi.middleware.cors import CORSMiddleware

from . import model 
from .database import engine

# This creates the tables in your .db file if they don't exist
model.Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Products API",
    description="A simple backend for managing products, carts, and images.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://products-bbby.onrender.com",
        "https://john-products.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Create the directory if it doesn't exist to prevent errors on startup
if not os.path.exists("static"):
    os.makedirs("static")

# Mount the static directory
# This makes files in /static accessible at http://localhost:8000/static
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(product.router)
app.include_router(cart.router)
