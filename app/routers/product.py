from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..database import get_db
from ..model import Product
import os, uuid

router = APIRouter(prefix="/products", tags=["Products"])




BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # app/routers/
APP_DIR = os.path.dirname(BASE_DIR)                    # app/
STATIC_DIR = os.path.join(APP_DIR, "static")
UPLOAD_DIR = os.path.join(STATIC_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)



@router.post("/upload", response_model=schemas.Product)
async def create_product_with_image(
    name: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    ext = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Save file correctly
    with open(file_path, "wb") as f:
        f.write(await image.read())

    # Correct URL for frontend
    image_url = f"/static/uploads/{filename}"

    product = Product(name=name, price=price, image_url=image_url)
    db.add(product)
    db.commit()
    db.refresh(product)

    return product



@router.post("/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.add_product(product=product, db=db)

@router.get("/", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud.list_product(db, skip=skip, limit=limit)
    return products


@router.post("/seed")
def seed_products(db: Session = Depends(get_db)):
    sample_products = [
        {"name": "Sneakers Shoe", "price": 1299, "image_url": "/static/sample/shoe1.jpg"},
        {"name": "Sandals ", "price": 299, "image_url": "/static/sample/shoe2.jpg"},
        {"name": "boots shoe", "price": 199, "image_url": "/static/sample/shoe3.jpg"},

    ]

    for p in sample_products:
        product = Product(**p)
        db.add(product)

    db.commit()
    return {"message": "Seeded successfully"}
