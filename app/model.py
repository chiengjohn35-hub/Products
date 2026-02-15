from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base

class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)  # Fixed: SQLAlchemy uses 'Float' with a capital 'F'
    image_url = Column(String, nullable=True)

    # Useful for seeing which carts contain this product
    cart_items = relationship("CartItem", back_populates="product")


class Cart(Base):
    __tablename__ = 'carts'

    id = Column(Integer, primary_key=True, index=True)

    # Establishes a one-to-many relationship with CartItem
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = 'cart_items'

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey('carts.id'))
    product_id = Column(Integer, ForeignKey('products.id'))
    quantity = Column(Integer, default=1)

    # Bi-directional links
    cart = relationship("Cart", back_populates="items")
    product = relationship("Product", back_populates="cart_items")
