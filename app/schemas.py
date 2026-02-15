from pydantic import BaseModel, ConfigDict
from typing import List, Optional

# --- PRODUCT SCHEMAS ---
class ProductBase(BaseModel):
    name: str
    price: float
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass  # Used for POST /products

class Product(ProductBase):
    id: int
    model_config = ConfigDict(from_attributes=True) # Enables ORM compatibility

# --- CART ITEM SCHEMAS ---
class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass  # Used when adding to cart

class CartItem(CartItemBase):
    id: int
    cart_id: int
    product: Product  # Nested product details in response
    model_config = ConfigDict(from_attributes=True)

# --- CART SCHEMAS ---
class CartBase(BaseModel):
    pass

class CartCreate(CartBase):
    pass

class Cart(CartBase):
    id: int
    items: List[CartItem] = []  # Shows all items inside the cart
    model_config = ConfigDict(from_attributes=True)
