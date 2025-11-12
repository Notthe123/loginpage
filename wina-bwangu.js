/**
 * Wina Bwangu FinTech Dashboard - Transaction Management System
 * @description Manages mobile money transactions across multiple booths and services
 */

// =========================
// CONSTANTS
// =========================
const CONFIG = {
  TAX_RATE: 0.05, // 5% tax rate
  TAX_THRESHOLD: 1000, // K1000 threshold for tax visualization
  TRANSACTION_ID_PREFIX: 'TXN-',
  MIN_AMOUNT: 1,
  ANIMATION_DELAY: 600,
};

const COLORS = {
  SUCCESS: '#059669',
  ERROR: '#dc2626',
  INFO: '#2563eb',
};

// =========================
// INITIALIZATION
// =========================
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const elements = {
    boothSelect: document.getElementById("boothSelect"),
    serviceSelect: document.getElementById("serviceSelect"),
    form: document.getElementById("transForm"),
    generatedId: document.getElementById("generatedId"),
    taxBar: document.getElementById("taxBar"),
    taxBarFill: document.getElementById("taxBarFill"),
    taxAmount: document.getElementById("taxAmount"),
    locationDisplay: document.getElementById("locationDisplay"),
    revenueDisplay: document.getElementById("revenueDisplay"),
    amountInput: document.getElementById("amountInput"),
  };
  
  // Validate all required DOM elements exist
  if (!validateElements(elements)) {
    console.error('Critical DOM elements are missing!');
    return;
  }

  // =========================
  // DATA MODELS
  // =========================
  const boothLocations = {
    Wina1: "Lusaka CPD",
    Wina2: "Libala",
    Wina3: "Kabwata",
    Wina4: "Mandevu",
    Wina5: "Woodlands",
    Wina6: "Matero East"
  };

  const servicesPerBooth = {
    Wina1: ["Airtel Money", "MTN Money", "Zamtel Money", "Zanaco", "FNB"],
    Wina2: ["Airtel Money", "MTN Money", "Zamtel Money", "FNB"],
    Wina3: ["Airtel Money", "MTN Money", "Zamtel Money", "Zanaco", "FNB"],
    Wina4: ["Airtel Money", "MTN Money", "Zamtel Money"],
    Wina5: ["Airtel Money", "MTN Money", "Zanaco", "FNB"],
    Wina6: ["Airtel Money", "MTN Money", "Zamtel Money"]
  };

  const serviceLimits = {
    "Airtel Money": 350000,
    "MTN Money": 160000,
    "Zamtel Money": 70000,
    "Zanaco": 80000,
    "FNB": 80000
  };

  // =========================
  // UTILITY FUNCTIONS
  // =========================
  
  /**
   * Validates that all required DOM elements exist
   * @param {Object} elements - Object containing DOM element references
   * @returns {boolean}
   */
  function validateElements(elements) {
    return Object.values(elements).every(el => el !== null);
  }
  
  /**
   * Maps service name to its CSS color class
   * @param {string} service - Service name
   * @returns {string} CSS class name
   */
  function getServiceColorClass(service) {
    const serviceMap = {
      "Airtel Money": "service-airtel",
      "MTN Money": "service-mtn",
      "Zamtel Money": "service-zamtel",
      "Zanaco": "service-zanaco",
      "FNB": "service-fnb"
    };
    return serviceMap[service] || "";
  }
  
  /**
   * Generates a unique transaction ID
   * @returns {string}
   */
  function generateTransactionId() {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `${CONFIG.TRANSACTION_ID_PREFIX}${randomNum}`;
  }
  
  /**
   * Calculates tax based on amount
   * @param {number} amount - Transaction amount
   * @returns {number} Tax amount
   */
  function calculateTax(amount) {
    return amount * CONFIG.TAX_RATE;
  }
  
  /**
   * Formats currency display
   * @param {number} amount - Amount to format
   * @returns {string}
   */
  function formatCurrency(amount) {
    return `K${amount.toFixed(2)}`;
  }
  
  /**
   * Sanitizes and validates numeric input
   * @param {string} value - Input value
   * @returns {number|null}
   */
  function sanitizeAmount(value) {
    const amount = parseFloat(value);
    return (isNaN(amount) || amount <= 0) ? null : amount;
  }

  // Transaction data storage
  let transactions = [];
  let boothRevenues = {
    Wina1: 0, Wina2: 0, Wina3: 0, Wina4: 0, Wina5: 0, Wina6: 0
  };
  let serviceTotals = {
    "Airtel Money": 0,
    "MTN Money": 0,
    "Zamtel Money": 0,
    "Zanaco": 0,
    "FNB": 0
  };
  let serviceTaxRevenue = {
    "Airtel Money": 0,
    "MTN Money": 0,
    "Zamtel Money": 0,
    "Zanaco": 0,
    "FNB": 0
  };
  let serviceFrequencies = {};

  async function loadTransactions() {
    try {
      // Load from localStorage instead of backend
      const stored = localStorage.getItem('winaBwanguTransactions');
      const data = stored ? JSON.parse(stored) : [];
      
      // Reset aggregates
      transactions = [];
      boothRevenues = { Wina1: 0, Wina2: 0, Wina3: 0, Wina4: 0, Wina5: 0, Wina6: 0 };
      serviceTotals = { "Airtel Money": 0, "MTN Money": 0, "Zamtel Money": 0, "Zanaco": 0, "FNB": 0 };
      serviceTaxRevenue = { "Airtel Money": 0, "MTN Money": 0, "Zamtel Money": 0, "Zanaco": 0, "FNB": 0 };
      serviceFrequencies = {};
      
      for (const r of data) {
        const id = r.id;
        const booth = r.booth;
        const service = r.service;
        const amount = Number(r.amount) || 0;
        const tax = Number(r.tax) || 0;
        transactions.push({ id, booth, service, amount, tax });
        if (boothRevenues[booth] !== undefined) boothRevenues[booth] += amount;
        if (serviceTotals[service] !== undefined) serviceTotals[service] += amount;
        if (serviceTaxRevenue[service] !== undefined) serviceTaxRevenue[service] += tax;
        const key = `${booth}-${service}`;
        serviceFrequencies[key] = (serviceFrequencies[key] || 0) + 1;
      }
      updateDashboard();
    } catch (_) {
      // fail silently; UI still works client-side
    }
  }

  // Booth selection handler
  elements.boothSelect.addEventListener("change", () => {
    const selectedBooth = elements.boothSelect.value;
    elements.serviceSelect.innerHTML = "<option value=''>Choose Service</option>";
    elements.serviceSelect.className = "";
    elements.serviceSelect.style.fontWeight = "normal";
    elements.revenueDisplay.textContent = "";

    if (selectedBooth && servicesPerBooth[selectedBooth]) {
      // Display booth location
      elements.locationDisplay.textContent = `Location: ${boothLocations[selectedBooth]}`;
      elements.locationDisplay.style.fontWeight = "bold";
      elements.locationDisplay.style.color = COLORS.INFO;

      // Populate services for the selected booth
      servicesPerBooth[selectedBooth].forEach(service => {
        const option = document.createElement("option");
        option.value = service;
        option.textContent = service;
        const colorClass = getServiceColorClass(service);
        option.className = colorClass;
        elements.serviceSelect.appendChild(option);
      });
      elements.serviceSelect.disabled = false;
    } else {
      elements.locationDisplay.textContent = "";
      elements.serviceSelect.disabled = true;
    }
  });

  // Service selection handler
  elements.serviceSelect.addEventListener("change", () => {
    const selectedService = elements.serviceSelect.value;
    const selectedBooth = elements.boothSelect.value;
    
    // Apply color to the select element based on service
    if (selectedService) {
      const colorClass = getServiceColorClass(selectedService);
      elements.serviceSelect.className = colorClass;
      elements.serviceSelect.style.fontWeight = "600";
    } else {
      elements.serviceSelect.className = "";
      elements.serviceSelect.style.fontWeight = "normal";
    }
    
    if (selectedService && selectedBooth) {
      const currentRevenue = boothRevenues[selectedBooth];
      const serviceTotal = serviceTotals[selectedService] || 0;
      const serviceLimit = serviceLimits[selectedService];
      const remaining = serviceLimit - serviceTotal;
      
      elements.revenueDisplay.innerHTML = `
        <strong>Current Booth Revenue:</strong> ${formatCurrency(currentRevenue)}<br>
        <strong>${selectedService} Limit:</strong> K${serviceLimit.toLocaleString()}<br>
        <strong>Used:</strong> ${formatCurrency(serviceTotal)}<br>
        <strong style="color: ${remaining < 0 ? COLORS.ERROR : COLORS.SUCCESS}">Remaining:</strong> 
        <strong style="color: ${remaining < 0 ? COLORS.ERROR : COLORS.SUCCESS}">${formatCurrency(remaining)}</strong>
      `;
      elements.revenueDisplay.style.fontWeight = "normal";
      elements.revenueDisplay.style.color = "#000";
    }
  });

  // Form submission handler
  elements.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const booth = elements.boothSelect.value;
    const service = elements.serviceSelect.value;
    const amount = sanitizeAmount(elements.amountInput.value);

    if (!booth || !service || amount === null) {
      alert("⚠️ Please complete all fields with valid values!");
      return;
    }

    // Check monthly limit for the service
    const currentTotal = serviceTotals[service] || 0;
    const limit = serviceLimits[service];
    const remaining = limit - currentTotal;
    
    if (amount > remaining) {
      alert(
        `❌ Transaction REJECTED!\n\n` +
        `Service: ${service}\n` +
        `Monthly Limit: K${limit.toLocaleString()}\n` +
        `Already Used: ${formatCurrency(currentTotal)}\n` +
        `Remaining: ${formatCurrency(remaining)}\n\n` +
        `Your transaction amount (${formatCurrency(amount)}) exceeds the remaining limit.\n` +
        `Maximum allowed: ${formatCurrency(remaining)}`
      );
      return;
    }

    // Create transaction and save to localStorage
    const id = generateTransactionId();
    const tax = calculateTax(amount);
    
    try {
      // Get existing transactions
      const stored = localStorage.getItem('winaBwanguTransactions');
      const storedTransactions = stored ? JSON.parse(stored) : [];
      
      // Add new transaction
      storedTransactions.push({
        id,
        booth,
        service,
        amount,
        tax,
        location: boothLocations[booth],
        timestamp: new Date().toISOString()
      });
      
      // Save back to localStorage
      localStorage.setItem('winaBwanguTransactions', JSON.stringify(storedTransactions));
    } catch (_) {
      alert('Failed to save transaction. Please try again.');
      return;
    }

    elements.generatedId.textContent = id;
    elements.generatedId.style.color = COLORS.SUCCESS;
    elements.generatedId.style.fontWeight = "bold";

    // Calculate tax display percentage
    const taxPercent = Math.min((tax / CONFIG.TAX_THRESHOLD) * 100, 100);
    
    // Display tax bar with ARIA update
    elements.taxBar.style.display = "block";
    elements.taxBarFill.style.width = `${taxPercent}%`;
    elements.taxBarFill.parentElement.setAttribute('aria-valuenow', taxPercent.toFixed(0));
    elements.taxAmount.textContent = `Tax: ${formatCurrency(tax)} (${taxPercent.toFixed(1)}% of K${CONFIG.TAX_THRESHOLD} threshold)`;

    // Update transaction data
    transactions.push({ id, booth, service, amount, tax });
    boothRevenues[booth] += amount;
    serviceTotals[service] = (serviceTotals[service] || 0) + amount;
    serviceTaxRevenue[service] = (serviceTaxRevenue[service] || 0) + tax;
    
    const key = `${booth}-${service}`;
    serviceFrequencies[key] = (serviceFrequencies[key] || 0) + 1;

    // Update dashboard
    updateDashboard();

    // Reset form
    elements.form.reset();
    elements.serviceSelect.disabled = true;
    elements.serviceSelect.className = "";
    elements.serviceSelect.style.fontWeight = "normal";
    elements.locationDisplay.textContent = "";
    elements.revenueDisplay.textContent = "";
    
    alert(`✅ Transaction ${id} submitted successfully!\nAmount: ${formatCurrency(amount)}\nTax: ${formatCurrency(tax)}`);
    // Refresh from backend to ensure consistency
    loadTransactions();
  });

  // Update dashboard tables
  function updateDashboard() {
    // Update cumulative totals table
    const cumTableBody = document.querySelector("#cumTable tbody");
    cumTableBody.innerHTML = "";

    Object.keys(serviceLimits).forEach(service => {
      const total = serviceTotals[service] || 0;
      const taxRevenue = serviceTaxRevenue[service] || 0;
      const limit = serviceLimits[service];
      const remaining = limit - total;
      
      const row = cumTableBody.insertRow();
      const colorClass = getServiceColorClass(service);
      row.innerHTML = `
        <td class="${colorClass}">${service}</td>
        <td>K${limit.toLocaleString()}</td>
        <td>K${total.toFixed(2)}</td>
        <td style="color: ${remaining < 0 ? 'red' : 'green'}">K${remaining.toFixed(2)}</td>
        <td style="color: #dc2626; font-weight: bold">K${taxRevenue.toFixed(2)}</td>
      `;
    });

    // Update booth revenues table
    const revenueTableBody = document.querySelector("#revenueTable tbody");
    revenueTableBody.innerHTML = "";
    
    Object.keys(boothRevenues).forEach(booth => {
      const row = revenueTableBody.insertRow();
      row.innerHTML = `
        <td>${booth}</td>
        <td>${boothLocations[booth]}</td>
        <td>K${boothRevenues[booth].toFixed(2)}</td>
      `;
    });

    // Update service frequency table
    const freqTableBody = document.querySelector("#freqTable tbody");
    freqTableBody.innerHTML = "";
    
    Object.keys(serviceFrequencies).forEach(key => {
      const [booth, service] = key.split("-");
      const row = freqTableBody.insertRow();
      const colorClass = getServiceColorClass(service);
      row.innerHTML = `
        <td>${booth}</td>
        <td class="${colorClass}">${service}</td>
        <td>${serviceFrequencies[key]}</td>
      `;
    });

    // Update chart
    updateChart();
  }

  // Update or create chart
  function updateChart() {
    const totalRevenue = Object.values(boothRevenues).reduce((sum, val) => sum + val, 0);
    const totalTax = Object.values(serviceTaxRevenue).reduce((sum, val) => sum + val, 0);
    
    const canvas = document.getElementById("revenuepie");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    // Destroy existing chart if it exists
    if (window.revenueChart) {
      window.revenueChart.destroy();
    }
    
    window.revenueChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Total Revenue", "Tax Revenue"],
        datasets: [{
          data: [totalRevenue, totalTax],
          backgroundColor: ["#059669", "#dc2626"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Revenue vs Tax Breakdown"
          },
          legend: {
            position: "bottom"
          }
        }
      }
    });
  }

  // Initialize by loading any existing backend transactions
  loadTransactions();
});
