class FinancialService {
  constructor() {
    this.taxRates = {
      federal: 0.21, // 21% federal corporate tax
      state: 0.08,   // 8% state tax (varies by state)
      sales: 0.0825  // 8.25% sales tax (varies by location)
    };
  }

  // Calculate profit margin
  calculateProfitMargin(sellingPrice, costPrice) {
    if (costPrice === 0) return 0;
    const profit = sellingPrice - costPrice;
    return ((profit / sellingPrice) * 100).toFixed(2);
  }

  // Calculate markup percentage
  calculateMarkup(sellingPrice, costPrice) {
    if (costPrice === 0) return 0;
    const markup = sellingPrice - costPrice;
    return ((markup / costPrice) * 100).toFixed(2);
  }

  // Calculate total cost including taxes
  calculateTotalCost(baseCost, includeStateTax = true, includeFederalTax = false) {
    let totalCost = baseCost;
    
    if (includeStateTax) {
      totalCost += baseCost * this.taxRates.state;
    }
    
    if (includeFederalTax) {
      totalCost += baseCost * this.taxRates.federal;
    }
    
    return parseFloat(totalCost.toFixed(2));
  }

  // Calculate sales tax
  calculateSalesTax(amount, taxRate = null) {
    const rate = taxRate || this.taxRates.sales;
    return parseFloat((amount * rate).toFixed(2));
  }

  // Generate invoice
  generateInvoice(invoiceData) {
    const {
      invoiceNumber,
      customerInfo,
      items,
      issueDate = new Date(),
      dueDate,
      taxRate = this.taxRates.sales,
      discountRate = 0
    } = invoiceData;

    // Calculate line totals
    const processedItems = items.map(item => {
      const lineTotal = item.quantity * item.unitPrice;
      return {
        ...item,
        lineTotal
      };
    });

    // Calculate subtotals
    const subtotal = processedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const discountAmount = subtotal * (discountRate / 100);
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = this.calculateSalesTax(taxableAmount, taxRate);
    const total = taxableAmount + taxAmount;

    return {
      invoiceNumber,
      customerInfo,
      items: processedItems,
      issueDate,
      dueDate,
      calculations: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        discountRate,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        taxRate,
        taxAmount,
        total: parseFloat(total.toFixed(2))
      }
    };
  }

  // Generate purchase order
  generatePurchaseOrder(poData) {
    const {
      poNumber,
      vendorInfo,
      items,
      orderDate = new Date(),
      expectedDelivery,
      terms = 'Net 30'
    } = poData;

    const processedItems = items.map(item => {
      const lineTotal = item.quantity * item.unitCost;
      return {
        ...item,
        lineTotal
      };
    });

    const total = processedItems.reduce((sum, item) => sum + item.lineTotal, 0);

    return {
      poNumber,
      vendorInfo,
      items: processedItems,
      orderDate,
      expectedDelivery,
      terms,
      total: parseFloat(total.toFixed(2))
    };
  }

  // Calculate inventory valuation
  calculateInventoryValuation(inventory) {
    return inventory.reduce((totals, item) => {
      const costValue = item.quantity * (item.costPrice || item.price * 0.7); // Assume 30% markup if no cost
      const retailValue = item.quantity * item.price;
      const profitPotential = retailValue - costValue;

      return {
        totalCostValue: totals.totalCostValue + costValue,
        totalRetailValue: totals.totalRetailValue + retailValue,
        totalProfitPotential: totals.totalProfitPotential + profitPotential,
        itemCount: totals.itemCount + 1,
        totalQuantity: totals.totalQuantity + item.quantity
      };
    }, {
      totalCostValue: 0,
      totalRetailValue: 0,
      totalProfitPotential: 0,
      itemCount: 0,
      totalQuantity: 0
    });
  }

  // Generate cost analysis report
  generateCostAnalysis(inventory) {
    const valuation = this.calculateInventoryValuation(inventory);
    const avgProfitMargin = valuation.totalRetailValue > 0 ? 
      ((valuation.totalProfitPotential / valuation.totalRetailValue) * 100).toFixed(2) : 0;

    // Category analysis
    const categoryAnalysis = inventory.reduce((categories, item) => {
      const category = item.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = {
          itemCount: 0,
          totalQuantity: 0,
          costValue: 0,
          retailValue: 0
        };
      }

      const costValue = item.quantity * (item.costPrice || item.price * 0.7);
      const retailValue = item.quantity * item.price;

      categories[category].itemCount++;
      categories[category].totalQuantity += item.quantity;
      categories[category].costValue += costValue;
      categories[category].retailValue += retailValue;

      return categories;
    }, {});

    // Add profit margins to categories
    Object.keys(categoryAnalysis).forEach(category => {
      const cat = categoryAnalysis[category];
      cat.profitMargin = cat.retailValue > 0 ? 
        (((cat.retailValue - cat.costValue) / cat.retailValue) * 100).toFixed(2) : 0;
    });

    return {
      overall: {
        ...valuation,
        avgProfitMargin
      },
      categories: categoryAnalysis,
      recommendations: this.generateRecommendations(valuation, categoryAnalysis)
    };
  }

  // Generate business recommendations
  generateRecommendations(valuation, categoryAnalysis) {
    const recommendations = [];

    // Low profit margin warning
    if (parseFloat(valuation.totalProfitPotential / valuation.totalRetailValue * 100) < 20) {
      recommendations.push({
        type: 'warning',
        title: 'Low Profit Margins',
        description: 'Overall profit margin is below 20%. Consider reviewing pricing strategy.',
        action: 'Review pricing for low-margin items'
      });
    }

    // High-value category identification
    const sortedCategories = Object.entries(categoryAnalysis)
      .sort(([,a], [,b]) => b.retailValue - a.retailValue);
    
    if (sortedCategories.length > 0) {
      const topCategory = sortedCategories[0];
      recommendations.push({
        type: 'success',
        title: 'Top Performing Category',
        description: `${topCategory[0]} represents your highest value category`,
        action: 'Consider expanding this category'
      });
    }

    // Inventory optimization
    if (valuation.totalQuantity > valuation.itemCount * 50) {
      recommendations.push({
        type: 'info',
        title: 'High Inventory Levels',
        description: 'Inventory quantity is high relative to item diversity',
        action: 'Consider inventory optimization strategies'
      });
    }

    return recommendations;
  }

  // Calculate break-even analysis
  calculateBreakEven(fixedCosts, variableCostPerUnit, pricePerUnit) {
    const contributionMargin = pricePerUnit - variableCostPerUnit;
    if (contributionMargin <= 0) {
      return {
        breakEvenUnits: Infinity,
        breakEvenRevenue: Infinity,
        error: 'Price must be higher than variable cost'
      };
    }

    const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
    const breakEvenRevenue = breakEvenUnits * pricePerUnit;

    return {
      breakEvenUnits,
      breakEvenRevenue: parseFloat(breakEvenRevenue.toFixed(2)),
      contributionMargin: parseFloat(contributionMargin.toFixed(2)),
      contributionMarginPercentage: parseFloat(((contributionMargin / pricePerUnit) * 100).toFixed(2))
    };
  }

  // Tax calculation utilities
  calculateYearEndTaxes(revenue, expenses, inventory) {
    const grossProfit = revenue - expenses;
    const inventoryValue = this.calculateInventoryValuation(inventory).totalCostValue;
    
    // Simplified tax calculation
    const federalTax = grossProfit * this.taxRates.federal;
    const stateTax = grossProfit * this.taxRates.state;
    const totalTax = federalTax + stateTax;

    return {
      grossProfit: parseFloat(grossProfit.toFixed(2)),
      inventoryValue: parseFloat(inventoryValue.toFixed(2)),
      federalTax: parseFloat(federalTax.toFixed(2)),
      stateTax: parseFloat(stateTax.toFixed(2)),
      totalTax: parseFloat(totalTax.toFixed(2)),
      netIncome: parseFloat((grossProfit - totalTax).toFixed(2))
    };
  }

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Format percentage
  formatPercentage(value) {
    return `${parseFloat(value).toFixed(2)}%`;
  }
}

export default new FinancialService();