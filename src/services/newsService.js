class NewsService {
  constructor() {
    this.apiKey = '4a33d36e763449a0bf5e019191c0d05d';
    this.baseURL = 'https://newsapi.org/v2';
  }

  // Get top business headlines
  async getTopHeadlines(category = 'business', country = 'us', pageSize = 20) {
    try {
      const response = await fetch(
        `${this.baseURL}/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&apiKey=${this.apiKey}`
      );

      if (!response.ok) {
        console.warn(`NewsAPI error: ${response.status} - Using fallback data`);
        return this.getFallbackNews();
      }

      const data = await response.json();
      
      if (data.status !== 'ok') {
        console.warn(`NewsAPI response error: ${data.message || 'Failed to fetch news'} - Using fallback data`);
        return this.getFallbackNews();
      }

      return {
        success: true,
        data: data.articles,
        totalResults: data.totalResults
      };
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      return this.getFallbackNews();
    }
  }

  // Search for specific news
  async searchNews(query, sortBy = 'publishedAt', pageSize = 20, page = 1) {
    try {
      const response = await fetch(
        `${this.baseURL}/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&pageSize=${pageSize}&page=${page}&apiKey=${this.apiKey}`
      );

      if (!response.ok) {
        console.warn(`NewsAPI error: ${response.status} - Using fallback data`);
        return this.getFallbackNews();
      }

      const data = await response.json();
      
      if (data.status !== 'ok') {
        console.warn(`NewsAPI response error: ${data.message || 'Failed to search news'} - Using fallback data`);
        return this.getFallbackNews();
      }

      return {
        success: true,
        data: data.articles,
        totalResults: data.totalResults
      };
    } catch (error) {
      console.error('Error searching news:', error);
      return this.getFallbackNews();
    }
  }

  // Get inventory/business related news
  async getInventoryNews() {
    try {
      const queries = [
        'inventory management',
        'supply chain',
        'business technology',
        'warehouse automation'
      ];

      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      return await this.searchNews(randomQuery, 'publishedAt', 15);
    } catch (error) {
      console.error('Error fetching inventory news:', error);
      return this.getFallbackNews();
    }
  }

  // Get technology news
  async getTechnologyNews() {
    try {
      return await this.getTopHeadlines('technology', 'us', 15);
    } catch (error) {
      console.error('Error fetching technology news:', error);
      return this.getFallbackNews();
    }
  }

  // Format news article for display
  formatArticle(article) {
    return {
      id: article.url,
      title: article.title,
      description: article.description,
      content: article.content,
      author: article.author,
      source: article.source.name,
      publishedAt: new Date(article.publishedAt),
      url: article.url,
      urlToImage: article.urlToImage,
      category: this.categorizeArticle(article)
    };
  }

  // Categorize article based on content
  categorizeArticle(article) {
    const text = (article.title + ' ' + (article.description || '')).toLowerCase();
    
    if (text.includes('inventory') || text.includes('supply chain') || text.includes('warehouse')) {
      return 'inventory';
    } else if (text.includes('technology') || text.includes('ai') || text.includes('software')) {
      return 'technology';
    } else if (text.includes('business') || text.includes('market') || text.includes('finance')) {
      return 'business';
    } else {
      return 'general';
    }
  }

  // Get fallback news data
  getFallbackNews() {
    return {
      success: true,
      data: [
        {
          id: 'fallback-1',
          title: 'Smart Inventory Management: The Future of Business Operations',
          description: 'Advanced inventory management systems are revolutionizing how businesses track, manage, and optimize their stock levels.',
          author: 'Tech Business Weekly',
          source: 'Business Insider',
          publishedAt: new Date(),
          url: '#',
          urlToImage: 'https://images.pexels.com/photos/6169662/pexels-photo-6169662.jpeg',
          category: 'inventory'
        },
        {
          id: 'fallback-2',
          title: 'AI-Powered Analytics Transform Supply Chain Management',
          description: 'Artificial intelligence is enabling predictive analytics and automated decision-making in modern supply chains.',
          author: 'Innovation Today',
          source: 'Tech News',
          publishedAt: new Date(Date.now() - 3600000),
          url: '#',
          urlToImage: 'https://images.pexels.com/photos/8485617/pexels-photo-8485617.jpeg',
          category: 'technology'
        },
        {
          id: 'fallback-3',
          title: 'Digital Transformation Drives Business Growth in 2024',
          description: 'Companies embracing digital transformation are seeing significant improvements in efficiency and profitability.',
          author: 'Business Tech',
          source: 'Forbes',
          publishedAt: new Date(Date.now() - 7200000),
          url: '#',
          urlToImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
          category: 'business'
        }
      ]
    };
  }
}

export default new NewsService();