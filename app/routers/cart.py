from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)


@router.post("/{cart_id}/items", response_model=schemas.Cart)
def add_item_to_cart(cart_id: int, item: schemas.CartItemCreate, db: Session = Depends(get_db)):
    return crud.add_to_cart(db=db, cart_id=cart_id, item=item)


@router.get("/{cart_id}", response_model=schemas.Cart)
def read_cart(cart_id: int, db: Session = Depends(get_db)):
    return crud.get_cart(db=db, cart_id=cart_id)

#  Remove a specific product from a specific cart
@router.delete("/{cart_id}/items/{product_id}", response_model=schemas.Cart)
def remove_item_from_cart(cart_id: int, product_id: int, db: Session = Depends(get_db)):
    updated_cart = crud.delete_cart_item(db=db, cart_id=cart_id, product_id=product_id)
    return updated_cart

# List all carts (Useful for dev/testing)
@router.get("/", response_model=List[schemas.Cart])
def list_all_carts(db: Session = Depends(get_db)):
    return db.query(crud.model.Cart).all()
