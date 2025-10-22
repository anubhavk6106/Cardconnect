import { useState, useEffect } from 'react'
import axios from 'axios'
import './BrowseProducts.css'

const BrowseProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    platform: '',
    category: '',
    priceRange: '',
    search: ''
  })

  // Sample product data (in real app, this would come from API)
  const sampleProducts = [
    {
      _id: '1',
      name: 'iPhone 15 Pro Max',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 134900,
      image: 'https://via.placeholder.com/300x300?text=iPhone+15',
      rating: 4.5,
      availableDiscounts: [
        { bankName: 'HDFC', discount: 10 },
        { bankName: 'SBI', discount: 8 }
      ]
    },
    {
      _id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      platform: 'Flipkart',
      category: 'Electronics',
      originalPrice: 124999,
      image: 'https://via.placeholder.com/300x300?text=Galaxy+S24',
      rating: 4.6,
      availableDiscounts: [
        { bankName: 'ICICI', discount: 12 },
        { bankName: 'Axis', discount: 7 }
      ]
    },
    {
      _id: '3',
      name: 'Nike Air Max Shoes',
      platform: 'Myntra',
      category: 'Fashion',
      originalPrice: 8995,
      image: 'https://via.placeholder.com/300x300?text=Nike+Shoes',
      rating: 4.3,
      availableDiscounts: [
        { bankName: 'HDFC', discount: 15 },
        { bankName: 'SBI', discount: 10 }
      ]
    },
    {
      _id: '4',
      name: 'Sony WH-1000XM5 Headphones',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 29990,
      image: 'https://via.placeholder.com/300x300?text=Sony+Headphones',
      rating: 4.7,
      availableDiscounts: [
        { bankName: 'ICICI', discount: 10 },
        { bankName: 'HDFC', discount: 12 }
      ]
    },
    {
      _id: '5',
      name: 'Adidas Running Shoes',
      platform: 'Myntra',
      category: 'Fashion',
      originalPrice: 6999,
      image: 'https://via.placeholder.com/300x300?text=Adidas+Shoes',
      rating: 4.4,
      availableDiscounts: [
        { bankName: 'SBI', discount: 15 },
        { bankName: 'Axis', discount: 8 }
      ]
    },
    {
      _id: '6',
      name: 'MacBook Air M2',
      platform: 'Flipkart',
      category: 'Electronics',
      originalPrice: 114900,
      image: 'https://via.placeholder.com/300x300?text=MacBook+Air',
      rating: 4.8,
      availableDiscounts: [
        { bankName: 'HDFC', discount: 8 },
        { bankName: 'ICICI', discount: 10 }
      ]
    },
    {
      _id: '7',
      name: 'Levi\'s Denim Jacket',
      platform: 'Myntra',
      category: 'Fashion',
      originalPrice: 4599,
      image: 'https://via.placeholder.com/300x300?text=Levis+Jacket',
      rating: 4.2,
      availableDiscounts: [
        { bankName: 'Axis', discount: 12 },
        { bankName: 'SBI', discount: 10 }
      ]
    },
    {
      _id: '8',
      name: 'iPad Pro 12.9"',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 112900,
      image: 'https://via.placeholder.com/300x300?text=iPad+Pro',
      rating: 4.6,
      availableDiscounts: [
        { bankName: 'ICICI', discount: 10 },
        { bankName: 'HDFC', discount: 9 }
      ]
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(sampleProducts)
      setLoading(false)
    }, 500)
  }, [])

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const filteredProducts = products.filter(product => {
    return (
      (!filters.platform || product.platform === filters.platform) &&
      (!filters.category || product.category === filters.category) &&
      (!filters.search || product.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.priceRange || filterByPrice(product.originalPrice, filters.priceRange))
    )
  })

  const filterByPrice = (price, range) => {
    switch(range) {
      case 'under5k': return price < 5000
      case '5k-20k': return price >= 5000 && price < 20000
      case '20k-50k': return price >= 20000 && price < 50000
      case 'above50k': return price >= 50000
      default: return true
    }
  }

  const getBestDiscount = (discounts) => {
    if (!discounts || discounts.length === 0) return 0
    return Math.max(...discounts.map(d => d.discount))
  }

  if (loading) return <div className="loading">Loading products...</div>

  return (
    <div className="browse-products-page">
      <div className="page-header">
        <h1>Browse Products</h1>
        <p>Find products and see which bank cards offer the best discounts</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select name="platform" value={filters.platform} onChange={handleFilterChange}>
            <option value="">All Platforms</option>
            <option value="Amazon">Amazon</option>
            <option value="Flipkart">Flipkart</option>
            <option value="Myntra">Myntra</option>
          </select>
        </div>

        <div className="filter-group">
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home & Kitchen</option>
            <option value="Books">Books</option>
          </select>
        </div>

        <div className="filter-group">
          <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange}>
            <option value="">All Prices</option>
            <option value="under5k">Under ₹5,000</option>
            <option value="5k-20k">₹5,000 - ₹20,000</option>
            <option value="20k-50k">₹20,000 - ₹50,000</option>
            <option value="above50k">Above ₹50,000</option>
          </select>
        </div>

        <button 
          className="btn-clear-filters"
          onClick={() => setFilters({ platform: '', category: '', priceRange: '', search: '' })}
        >
          Clear Filters
        </button>
      </div>

      <div className="products-count">
        Showing {filteredProducts.length} product(s)
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found matching your filters.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <span className="platform-badge">{product.platform}</span>
                {getBestDiscount(product.availableDiscounts) > 0 && (
                  <span className="discount-badge">
                    Up to {getBestDiscount(product.availableDiscounts)}% OFF
                  </span>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-category">{product.category}</div>
                
                <div className="product-rating">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                  <span>{product.rating}</span>
                </div>

                <div className="product-price">
                  <span className="price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                </div>

                <div className="available-discounts">
                  <strong>Available Bank Discounts:</strong>
                  <div className="discount-list">
                    {product.availableDiscounts.map((discount, idx) => (
                      <div key={idx} className="discount-tag">
                        {discount.bankName}: {discount.discount}% OFF
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary btn-full">
                  View Cards for This Product
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BrowseProducts
