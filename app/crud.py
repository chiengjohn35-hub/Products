from sqlalchemy.orm import Session
from fastapi import HTTPException
from . import model , schemas

def add_product(product: schemas.ProductCreate, db: Session):
    db_product = model.Product(
        name=product.name,
        price=product.price,
        quantity=product.quantity,
        image_url=product.image_url,
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)  
    return db_product

def list_product(db: Session, skip: int = 0, limit: int = 100):
    # Query all products with pagination support
    return db.query(model.Product).offset(skip).limit(limit).all()


def add_to_cart(db: Session, cart_id: int, item: schemas.CartItemCreate):
    # 1. check if  the product exists
    db_product = db.query(model.Product).filter(model.Product.id == item.product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # 2. Check if the cart exists or create new cart
    db_cart = db.query(model.Cart).filter(model.Cart.id == cart_id).first()
    if not db_cart:
        db_cart = model.Cart()
        db.add(db_cart)
        db.commit()
        db.refresh(db_cart)

    # 3. Check if this product is already in the cart
    existing_item = db.query(model.CartItem).filter(
        model.CartItem.cart_id == db_cart.id,
        model.CartItem.product_id == item.product_id
    ).first()

    if existing_item:
        # Increase quantity if it exists
        existing_item.quantity += item.quantity
    else:
        # Create new cart item if it doesn't
        new_item = model.CartItem(
            cart_id=db_cart.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(new_item)

    db.commit()
    db.refresh(db_cart)
    return db_cart

def get_cart(db: Session, cart_id: int):
    db_cart = db.query(model.Cart).filter(model.Cart.id == cart_id).first()
    if not db_cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    return db_cart


def delete_cart_item(db: Session, cart_id: int, product_id: int):
    # 1. Find the item in the specific cart
    db_item = db.query(model.CartItem).filter(
        model.CartItem.cart_id == cart_id,
        model.CartItem.product_id == product_id
    ).first()

    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    # 2. Remove the entry entirely
    db.delete(db_item)
    db.commit()
    
    # 3. Return the updated cart state
    return db.query(model.Cart).filter(model.Cart.id == cart_id).first()
