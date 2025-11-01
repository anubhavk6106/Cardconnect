import { useState, useEffect } from 'react'
import axios from 'axios'
import './BrowseProducts.css'

/**
 * NOTE: This component uses hardcoded sample products.
 * For the new card offer system with automatic matching,
 * use ProductBrowseWithOffers.jsx instead.
 */
const BrowseProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    platform: '',
    category: '',
    priceRange: '',
    search: ''
  })
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [availableCards, setAvailableCards] = useState([])
  const [allCards, setAllCards] = useState([]) // All cards for display
  const [selectedCard, setSelectedCard] = useState('')
  const [productUrl, setProductUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // ✅ Sample product data (with real product links)
  const sampleProducts = [
    // Amazon Electronics
    {
      _id: '1',
      name: 'iPhone 15 Pro Max',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 134900,
      image: 'https://m.media-amazon.com/images/I/81dT7CUY6GL._SL1500_.jpg',
      rating: 4.5,
      productLink: 'https://www.amazon.in/dp/B0CHX8KX4M',
      availableDiscounts: [
        { bankName: 'HDFC Bank', discount: 10, maxDiscount: 5000 },
        { bankName: 'SBI', discount: 8, maxDiscount: 4000 },
        { bankName: 'ICICI Bank', discount: 7, maxDiscount: 3500 }
      ]
    },
    {
      _id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      platform: 'Flipkart',
      category: 'Electronics',
      originalPrice: 124999,
      image: 'https://m.media-amazon.com/images/I/717Q2swzhBL._AC_UF1000,1000_QL80_.jpg',
      rating: 4.6,
      productLink: 'https://www.flipkart.com/samsung-galaxy-s24-ultra',
      availableDiscounts: [
        { bankName: 'ICICI Bank', discount: 12, maxDiscount: 6000 },
        { bankName: 'Axis Bank', discount: 10, maxDiscount: 5000 },
        { bankName: 'HDFC Bank', discount: 9, maxDiscount: 4500 }
      ]
    },
    {
      _id: '3',
      name: 'Nike Air Max Shoes',
      platform: 'Myntra',
      category: 'Fashion',
      originalPrice: 8995,
      image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/23888390/2024/1/31/f69fef1d-c9ac-4f3d-b2c9-27f654d4b38e1706700097530NikeMenAirMaxSoloSneakers1.jpg',
      rating: 4.3,
      productLink: 'https://www.myntra.com/nike-air-max',
      availableDiscounts: [
        { bankName: 'HDFC Bank', discount: 15, maxDiscount: 1000 },
        { bankName: 'SBI', discount: 12, maxDiscount: 800 },
        { bankName: 'Kotak Bank', discount: 10, maxDiscount: 700 }
      ]
    },
    {
      _id: '4',
      name: 'Sony WH-1000XM5 Headphones',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 29990,
      image: 'https://m.media-amazon.com/images/I/61ULAZmt9NL.jpg',
      rating: 4.7,
      productLink: 'https://www.amazon.in/dp/B0BMF7DQVT',
      availableDiscounts: [
        { bankName: 'ICICI Bank', discount: 12, maxDiscount: 2000 },
        { bankName: 'HDFC Bank', discount: 10, maxDiscount: 1500 },
        { bankName: 'SBI', discount: 8, maxDiscount: 1200 }
      ]
    },
    {
      _id: '5',
      name: 'Adidas Running Shoes',
      platform: 'Myntra',
      category: 'Fashion',
      originalPrice: 6999,
      image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/834136da9e5b4ae0b86fdc6f61075c20_9366/Galaxy_7_Running_Shoes_Black_ID8760.jpg',
      rating: 4.4,
      productLink: 'https://www.myntra.com/adidas-running-shoes',
      availableDiscounts: [
        { bankName: 'SBI', discount: 15, maxDiscount: 900 },
        { bankName: 'Axis Bank', discount: 12, maxDiscount: 750 },
        { bankName: 'HDFC Bank', discount: 10, maxDiscount: 600 }
      ]
    },
    {
      _id: '6',
      name: 'MacBook Air M2',
      platform: 'Flipkart',
      category: 'Electronics',
      originalPrice: 114900,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxRPsd4tuHZhplmQtROpJPAGxrkxUMmh2wag&s',
      rating: 4.8,
      productLink: 'https://www.flipkart.com/apple-macbook-air-m2',
      availableDiscounts: [
        { bankName: 'HDFC Bank', discount: 10, maxDiscount: 5500 },
        { bankName: 'ICICI Bank', discount: 12, maxDiscount: 6000 },
        { bankName: 'Axis Bank', discount: 8, maxDiscount: 4000 }
      ]
    },
    {
      _id: '7',
      name: "Levi's Denim Jacket",
      platform: 'Myntra',
      category: 'Fashion',
      originalPrice: 4599,
      image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/JULY/19/0yYBMG5X_ed0d47f1898747aea1f973e6513fa67b.jpg',
      rating: 4.2,
      productLink: 'https://www.myntra.com/levis-denim-jacket',
      availableDiscounts: [
        { bankName: 'Axis Bank', discount: 12, maxDiscount: 500 },
        { bankName: 'SBI', discount: 10, maxDiscount: 400 },
        { bankName: 'Kotak Bank', discount: 8, maxDiscount: 350 }
      ]
    },
    {
      _id: '8',
      name: 'iPad Pro 12.9"',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 112900,
      image: 'https://www.cnet.com/a/img/resize/a58a109450d528dfc98de51c6e3311e61544e8b8/hub/2021/05/17/511c804c-34af-453d-9e0e-076eb3d4d777/ipad-pro-m1-2021-cnet-2021-037.jpg?auto=webp&width=1200',
      rating: 4.6,
      productLink: 'https://www.amazon.in/dp/B0BJL6N9W6',
      availableDiscounts: [
        { bankName: 'ICICI Bank', discount: 11, maxDiscount: 5500 },
        { bankName: 'HDFC Bank', discount: 10, maxDiscount: 5000 },
        { bankName: 'SBI', discount: 8, maxDiscount: 4000 }
      ]
    },
    // More Amazon Products
    {
      _id: '9',
      name: 'OnePlus 11R 5G',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 39999,
      image: 'https://m.media-amazon.com/images/I/71hNaIi+5OL._SL1500_.jpg',
      rating: 4.4,
      productLink: 'https://www.amazon.in/OnePlus-11R-5G',
      availableDiscounts: [
        { bankName: 'SBI', discount: 10, maxDiscount: 3000 },
        { bankName: 'HDFC Bank', discount: 8, maxDiscount: 2500 },
        { bankName: 'ICICI Bank', discount: 7, maxDiscount: 2000 }
      ]
    },
    {
      _id: '10',
      name: 'boAt Airdopes 141',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 1299,
      image: 'https://m.media-amazon.com/images/I/61TpmZLgZxL._SL1500_.jpg',
      rating: 4.1,
      productLink: 'https://www.amazon.in/boAt-Airdopes-141',
      availableDiscounts: [
        { bankName: 'HDFC Bank', discount: 10, maxDiscount: 100 },
        { bankName: 'ICICI Bank', discount: 8, maxDiscount: 80 },
        { bankName: 'Axis Bank', discount: 5, maxDiscount: 50 }
      ]
    },
    {
      _id: '11',
      name: 'Fire-Boltt Phoenix Smart Watch',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 4999,
      image: 'https://m.media-amazon.com/images/I/61ZuUWO7RsL._SL1500_.jpg',
      rating: 4.2,
      productLink: 'https://www.amazon.in/Fire-Boltt-Phoenix',
      availableDiscounts: [
        { bankName: 'SBI', discount: 15, maxDiscount: 500 },
        { bankName: 'HDFC Bank', discount: 12, maxDiscount: 400 },
        { bankName: 'Kotak Bank', discount: 10, maxDiscount: 350 }
      ]
    },
    {
      _id: '12',
      name: 'Redmi Note 13 Pro',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 23999,
      image: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SL1500_.jpg',
      rating: 4.3,
      productLink: 'https://www.amazon.in/Redmi-Note-13-Pro',
      availableDiscounts: [
        { bankName: 'ICICI Bank', discount: 10, maxDiscount: 2000 },
        { bankName: 'HDFC Bank', discount: 8, maxDiscount: 1500 },
        { bankName: 'SBI', discount: 7, maxDiscount: 1200 }
      ]
    },
    {
      _id: '13',
      name: 'HP 15s Laptop Intel Core i3',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 38990,
      image: 'https://m.media-amazon.com/images/I/71vvXGmdKWL._SL1500_.jpg',
      rating: 4.2,
      productLink: 'https://www.amazon.in/HP-15s-Laptop',
      availableDiscounts: [
        { bankName: 'HDFC Bank', discount: 10, maxDiscount: 3000 },
        { bankName: 'ICICI Bank', discount: 9, maxDiscount: 2500 },
        { bankName: 'Axis Bank', discount: 7, maxDiscount: 2000 }
      ]
    },
    {
      _id: '14',
      name: 'Kindle Paperwhite',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 13999,
      image: 'https://m.media-amazon.com/images/I/51QCk82iGcL._SL1000_.jpg',
      rating: 4.6,
      productLink: 'https://www.amazon.in/Kindle-Paperwhite',
      availableDiscounts: [
        { bankName: 'SBI', discount: 10, maxDiscount: 1000 },
        { bankName: 'HDFC Bank', discount: 8, maxDiscount: 800 },
        { bankName: 'ICICI Bank', discount: 7, maxDiscount: 700 }
      ]
    },
    {
      _id: '15',
      name: 'Logitech MX Master 3S Mouse',
      platform: 'Amazon',
      category: 'Electronics',
      originalPrice: 9995,
      image: 'https://m.media-amazon.com/images/I/61ni3t1ryQL._SL1500_.jpg',
      rating: 4.5,
      productLink: 'https://www.amazon.in/Logitech-MX-Master-3S',
      availableDiscounts: [
        { bankName: 'HDFC Bank', discount: 10, maxDiscount: 800 },
        { bankName: 'ICICI Bank', discount: 8, maxDiscount: 600 },
        { bankName: 'SBI', discount: 7, maxDiscount: 500 }
      ]
    },
    {
      _id: '16',
      name: 'Atomic Habits Book',
      platform: 'Amazon',
      category: 'Books',
      originalPrice: 599,
      image: 'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
      rating: 4.8,
      productLink: 'https://www.amazon.in/Atomic-Habits-James-Clear',
      availableDiscounts: [
        { bankName: 'SBI', discount: 10, maxDiscount: 50 },
        { bankName: 'HDFC Bank', discount: 8, maxDiscount: 40 },
        { bankName: 'Axis Bank', discount: 5, maxDiscount: 30 }
      ]
    },
    // Flipkart Products
    {
      _id: '17',
      name: 'realme 11 Pro',
      platform: 'Flipkart',
      category: 'Electronics',
      originalPrice: 25999,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/p/x/5/-original-imagtc4hqr4jystz.jpeg',
      rating: 4.4,
      productLink: 'https://www.flipkart.com/realme-11-pro',
      availableDiscounts: [
        { bankName: 'Axis Bank', discount: 12, maxDiscount: 2500 },
        { bankName: 'ICICI Bank', discount: 10, maxDiscount: 2000 },
        { bankName: 'HDFC Bank', discount: 8, maxDiscount: 1500 }
      ]
    },
    {
      _id: '18',
      name: 'Mi LED Smart TV 5A 43 inch',
      platform: 'Flipkart',
      category: 'Electronics',
      originalPrice: 25999,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/television/h/i/h/-original-imah2zr7gfrj2fxq.jpeg',
      rating: 4.3,
      productLink: 'https://www.flipkart.com/mi-tv-5a',
      availableDiscounts: [
        { bankName: 'ICICI Bank', discount: 10, maxDiscount: 2000 },
        { bankName: 'HDFC Bank', discount: 9, maxDiscount: 1800 },
        { bankName: 'Axis Bank', discount: 7, maxDiscount: 1500 }
      ]
    },
    {
      _id: '19',
      name: 'Noise ColorFit Pro 4 Smart Watch',
      platform: 'Flipkart',
      category: 'Electronics',
      originalPrice: 3499,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/l/2/g/-original-imagzvduxh7fqprj.jpeg',
      rating: 4.2,
      productLink: 'https://www.flipkart.com/noise-colorfit-pro-4',
      availableDiscounts: [
        { bankName: 'Axis Bank', discount: 15, maxDiscount: 400 },
        { bankName: 'HDFC Bank', discount: 12, maxDiscount: 350 },
        { bankName: 'SBI', discount: 10, maxDiscount: 300 }
      ]
    },
    {
      _id: '20',
      name: 'Asus TUF Gaming Laptop',
      platform: 'Flipkart',
      category: 'Electronics',
      originalPrice: 64990,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/d/k/r/-original-imah2z6yhyfdhfzf.jpeg',
      rating: 4.5,
      productLink: 'https://www.flipkart.com/asus-tuf-gaming',
      availableDiscounts: [
        { bankName: 'ICICI Bank', discount: 10, maxDiscount: 5000 },
        { bankName: 'HDFC Bank', discount: 8, maxDiscount: 4000 },
        { bankName: 'Axis Bank', discount: 7, maxDiscount: 3500 }
      ]
    },
    {
      _id: '21',
      name: 'Canon EOS 1500D DSLR Camera',
      platform: 'Flipkart',
      category: 'Electronics',
      originalPrice: 31990,
      image: 'https://rukminim2.flixcart.com/image/416/416/jfbfde80/dslr-camera/g/y/7/d-eos-1500-canon-original-imaf3t5h9yuyc5zu.jpeg',
      rating: 4.6,
      productLink: 'https://www.flipkart.com/canon-eos-1500d',
      availableDiscounts: [
        { bankName: 'HDFC Bank', discount: 10, maxDiscount: 2500 },
        { bankName: 'ICICI Bank', discount: 9, maxDiscount: 2200 },
        { bankName: 'Axis Bank', discount: 7, maxDiscount: 2000 }
      ]
    },
    {
      _id: '22',
      name: 'Zebronics Gaming Keyboard',
      platform: 'Flipkart',
      category: 'Electronics',
      originalPrice: 1299,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/keyboard/gaming-keyboard/a/k/f/max-pro-usb-wired-keyboard-zebronics-original-imah28yhg6zcjrhj.jpeg',
      rating: 4.1,
      productLink: 'https://www.flipkart.com/zebronics-gaming-keyboard',
      availableDiscounts: [
        { bankName: 'Axis Bank', discount: 10, maxDiscount: 100 },
        { bankName: 'HDFC Bank', discount: 8, maxDiscount: 80 },
        { bankName: 'SBI', discount: 7, maxDiscount: 70 }
      ]
    },
    {
      _id: '23',
      name: 'Philips Air Fryer',
      platform: 'Flipkart',
      category: 'Home',
      originalPrice: 8999,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/air-fryer/g/f/k/-original-imah2yz4y3zxhegz.jpeg',
      rating: 4.4,
      productLink: 'https://www.flipkart.com/philips-air-fryer',
      availableDiscounts: [
        { bankName: 'ICICI Bank', discount: 10, maxDiscount: 700 },
        { bankName: 'HDFC Bank', discount: 8, maxDiscount: 600 },
        { bankName: 'Axis Bank', discount: 7, maxDiscount: 500 }
      ]
    },
    {
      _id: '24',
      name: 'Prestige Induction Cooktop',
      platform: 'Flipkart',
      category: 'Home',
      originalPrice: 2199,
      image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/induction-cook-top/p/a/h/-original-imagzhghezfvzxfh.jpeg',
      rating: 4.3,
      productLink: 'https://www.flipkart.com/prestige-induction',
      availableDiscounts: [
        { bankName: 'HDFC Bank', discount: 10, maxDiscount: 200 },
        { bankName: 'SBI', discount: 8, maxDiscount: 150 },
        { bankName: 'Axis Bank', discount: 7, maxDiscount: 130 }
      ]
    }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch all cards to show discounts
      const { data: cardsData } = await axios.get('/api/cards')
      setAllCards(cardsData)
      
      // Set sample products
      setProducts(sampleProducts)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setProducts(sampleProducts)
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const filterByPrice = (price, range) => {
    switch (range) {
      case 'under5k': return price < 5000
      case '5k-20k': return price >= 5000 && price < 20000
      case '20k-50k': return price >= 20000 && price < 50000
      case 'above50k': return price >= 50000
      default: return true
    }
  }

  const filteredProducts = products.filter(product => {
    return (
      (!filters.platform || product.platform === filters.platform) &&
      (!filters.category || product.category === filters.category) &&
      (!filters.search || product.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.priceRange || filterByPrice(product.originalPrice, filters.priceRange))
    )
  })

  const getBestDiscount = (discounts) => {
    if (!discounts || discounts.length === 0) return { discount: 0, maxDiscount: 0 }
    const best = discounts.reduce((max, curr) => 
      curr.discount > max.discount ? curr : max
    )
    return best
  }

  // Get cards that offer discounts for this product's platform
  const getCardsForProduct = (productPlatform) => {
    return allCards.filter(card => 
      card.availableDiscounts && 
      card.availableDiscounts.some(d => d.platform === productPlatform)
    ).map(card => {
      const discount = card.availableDiscounts.find(d => d.platform === productPlatform)
      return {
        ...card,
        applicableDiscount: discount
      }
    })
  }

  const handleRequestTransaction = async (product) => {
    setSelectedProduct(product)
    setProductUrl('')
    setSelectedCard('')
    
    // Fetch cards and filter to show only those with discounts for this product's platform
    try {
      const { data } = await axios.get('/api/cards')
      // Filter to only show cards that have discounts for this product's platform
      const cardsWithDiscountsForPlatform = data.filter(card => 
        card.isAvailable && 
        card.availableDiscounts && 
        card.availableDiscounts.some(d => d.platform === product.platform)
      )
      
      if (cardsWithDiscountsForPlatform.length === 0) {
        alert(`No cards available with discounts for ${product.platform}. Please check back later.`)
        return
      }
      
      setAvailableCards(cardsWithDiscountsForPlatform)
      setShowRequestModal(true)
    } catch (error) {
      console.error('Error fetching cards:', error)
      alert('Failed to load available cards. Please try again.')
    }
  }

  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    
    if (!selectedCard) {
      alert('Please select a card')
      return
    }
    
    if (!productUrl) {
      alert('Please enter the product URL')
      return
    }

    setSubmitting(true)
    try {
      await axios.post('/api/transactions', {
        cardId: selectedCard,
        product: {
          name: selectedProduct.name,
          platform: selectedProduct.platform,
          url: productUrl,
          originalPrice: selectedProduct.originalPrice
        }
      })
      alert('Transaction request sent successfully! The card owner will review your request.')
      setShowRequestModal(false)
      setSelectedProduct(null)
      setProductUrl('')
      setSelectedCard('')
    } catch (error) {
      console.error('Error creating transaction:', error)
      alert(error.response?.data?.message || 'Failed to create transaction request')
    } finally {
      setSubmitting(false)
    }
  }

  const closeModal = () => {
    setShowRequestModal(false)
    setSelectedProduct(null)
    setProductUrl('')
    setSelectedCard('')
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
                  <strong>Available Card Discounts:</strong>
                  {!product.availableDiscounts || product.availableDiscounts.length === 0 ? (
                    <p className="no-discounts">No discounts available for this product</p>
                  ) : (
                    <div className="discount-list">
                      {product.availableDiscounts.map((discount, idx) => (
                        <div key={idx} className="discount-tag">
                          <span className="card-bank">{discount.bankName}</span>
                          <span className="discount-percent">{discount.discount}% OFF</span>
                          <span className="discount-max">(Max: ₹{discount.maxDiscount})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ✅ Buttons Section */}
                <div className="product-buttons">
                  <a
                    href={product.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-full"
                  >
                    View on {product.platform}
                  </a>

                <button 
                  className="btn btn-primary btn-full"
                  onClick={() => handleRequestTransaction(product)}
                >
                  Request Transaction
                </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transaction Request Modal */}
      {showRequestModal && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            
            <h2>Request Transaction</h2>
            <div className="modal-product-info">
              <h3>{selectedProduct.name}</h3>
              <p className="modal-platform">{selectedProduct.platform}</p>
              <p className="modal-price">₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</p>
            </div>

            <form onSubmit={handleSubmitRequest}>
              <div className="form-group">
                <label>Select Card *</label>
                <select 
                  value={selectedCard} 
                  onChange={(e) => setSelectedCard(e.target.value)}
                  required
                >
                  <option value="">-- Choose a card --</option>
                  {availableCards.length === 0 ? (
                    <option disabled>No cards available</option>
                  ) : (
                    availableCards.map(card => {
                      const discount = card.availableDiscounts?.find(d => d.platform === selectedProduct.platform)
                      return (
                        <option key={card._id} value={card._id}>
                          {card.bankName} {card.cardNetwork} {card.cardType} •••• {card.lastFourDigits} - {discount?.discountPercentage}% OFF (Max: ₹{discount?.maxDiscount}) - Owner: {card.owner?.name}
                        </option>
                      )
                    })
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Product URL *</label>
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder={`Enter ${selectedProduct.platform} product URL`}
                  required
                />
                <small>Paste the exact product link from {selectedProduct.platform}</small>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting || availableCards.length === 0}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrowseProducts
