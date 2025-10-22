import { useState, useEffect } from 'react'
import axios from 'axios'

const ProductBrowseEnhanced = () => {
  const [cards, setCards] = useState([])
  const [filterOptions, setFilterOptions] = useState({})
  const [filters, setFilters] = useState({
    platform: '',
    bankName: '',
    cardType: '',
    cardNetwork: '',
    minDiscount: '',
    minRating: '',
    sortBy: 'rating',
    order: 'desc'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  })
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchFilterOptions()
    searchCards()
  }, [])

  useEffect(() => {
    searchCards()
  }, [filters, pagination.currentPage])

  const fetchFilterOptions = async () => {
    try {
      const { data } = await axios.get('/api/search/filters')
      setFilterOptions(data)
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  const searchCards = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...filters,
        page: pagination.currentPage
      })
      
      // Remove empty params
      for (let [key, value] of [...params.entries()]) {
        if (!value) params.delete(key)
      }

      const { data } = await axios.get(`/api/search/cards?${params}`)
      setCards(data.cards)
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        hasMore: data.hasMore
      })
      setLoading(false)
    } catch (error) {
      console.error('Error searching cards:', error)
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
    setPagination({ ...pagination, currentPage: 1 })
  }

  const clearFilters = () => {
    setFilters({
      platform: '',
      bankName: '',
      cardType: '',
      cardNetwork: '',
      minDiscount: '',
      minRating: '',
      sortBy: 'rating',
      order: 'desc'
    })
  }

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, currentPage: newPage })
    window.scrollTo(0, 0)
  }

  return (
    <div className="page-container">
      <div className="search-header">
        <h1>Search Cards & Discounts</h1>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Platform</label>
              <select name="platform" value={filters.platform} onChange={handleFilterChange}>
                <option value="">All Platforms</option>
                {filterOptions.platforms?.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Bank</label>
              <select name="bankName" value={filters.bankName} onChange={handleFilterChange}>
                <option value="">All Banks</option>
                {filterOptions.banks?.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Card Type</label>
              <select name="cardType" value={filters.cardType} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Network</label>
              <select name="cardNetwork" value={filters.cardNetwork} onChange={handleFilterChange}>
                <option value="">All Networks</option>
                {filterOptions.networks?.map(network => (
                  <option key={network} value={network}>{network}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Min Discount %</label>
              <input
                type="number"
                name="minDiscount"
                value={filters.minDiscount}
                onChange={handleFilterChange}
                placeholder="e.g. 10"
                min="0"
                max="100"
              />
            </div>

            <div className="filter-group">
              <label>Min Rating</label>
              <input
                type="number"
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                placeholder="e.g. 4"
                min="0"
                max="5"
                step="0.1"
              />
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                <option value="rating">Rating</option>
                <option value="transactions">Most Transactions</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select name="order" value={filters.order} onChange={handleFilterChange}>
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn-primary" onClick={searchCards}>
              Apply Filters
            </button>
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear All
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading cards...</div>
      ) : (
        <>
          <div className="search-results-header">
            <p>Found {cards.length} cards</p>
          </div>

          {cards.length === 0 ? (
            <div className="no-results">
              <h3>No cards found</h3>
              <p>Try adjusting your filters</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="card-grid">
                {cards.map(card => (
                  <div key={card._id} className="card-item">
                    <div className="card-header">
                      <h3>{card.bankName}</h3>
                      <span className="card-type">{card.cardType}</span>
                    </div>
                    <p className="card-network">{card.cardNetwork} •••• {card.lastFourDigits}</p>
                    <div className="card-owner">
                      <strong>Owner:</strong> {card.owner?.name} 
                      <span className="rating">★ {card.rating}/5</span>
                    </div>
                    <div className="discounts">
                      <strong>Available Discounts:</strong>
                      {card.availableDiscounts.map((discount, idx) => (
                        <div key={idx} className="discount-item">
                          {discount.platform}: {discount.discountPercentage}% off (Max: ₹{discount.maxDiscount})
                        </div>
                      ))}
                    </div>
                    <div className="card-stats">
                      <small>{card.totalTransactions} transactions • {card.currentUsage}/{card.usageLimit} used this month</small>
                    </div>
                  </div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  <span className="page-info">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasMore}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ProductBrowseEnhanced
