/*
   Personal Finance Tracker - Enhanced JavaScript Application
   
   Features:
   - Object-Oriented design with Transaction and FinanceTracker classes
   - Real-time balance calculations
   - Spending analytics (monthly spending, savings rate)
   - Data export and clear functionality
   - Persistent storage with localStorage
   - Responsive and interactive UI
   
   Author: Priya Rani
   Date: 2026
*/

// ========== TRANSACTION CLASS ==========
/**
 * Transaction Class
 * 
 * Represents a single financial transaction (income or expense).
 * Encapsulates all transaction data and display methods.
 * 
 * Arguments:
 *   - id: Unique transaction identifier (number)
 *   - description: Transaction description (string)
 *   - amount: Transaction amount in dollars (number)
 *   - category: Category name (string)
 *   - type: Either 'income' or 'expense' (string)
 *   - date: Transaction date in YYYY-MM-DD format (string)
 * 
 * Returns: Transaction object with properties and methods
 */
class Transaction {
    constructor(id, description, amount, category, type, date) {
        this.id = id;
        this.description = description;
        this.amount = parseFloat(amount);
        this.category = category;
        this.type = type;
        this.date = date;
    }

    /**
     * getFormattedAmount()
     * 
     * Formats amount with currency symbol and sign indicator.
     * Income shows +, expenses show -.
     * 
     * Arguments: None
     * Returns: Formatted currency string (e.g., "+$100.00" or "-$50.00")
     */
    getFormattedAmount() {
        const sign = this.type === 'income' ? '+' : '-';
        return `${sign}$${this.amount.toFixed(2)}`;
    }

    /**
     * getIcon()
     * 
     * Returns category-specific emoji icon for visual display.
     * 
     * Arguments: None
     * Returns: Emoji string
     */
    getIcon() {
        const icons = {
            'Salary': '💼',
            'Freelance': '💻',
            'Investment': '📈',
            'Bonus': '🎁',
            'Food': '🍔',
            'Transportation': '🚗',
            'Entertainment': '🎬',
            'Shopping': '🛍️',
            'Utilities': '💡',
            'Healthcare': '🏥',
            'Education': '📚',
            'Other': '❓'
        };
        return icons[this.category] || '💾';
    }

    /**
     * getFormattedDate()
     * 
     * Converts date to readable format.
     * 
     * Arguments: None
     * Returns: Formatted date string (e.g., "Jan 15, 2026")
     */
    getFormattedDate() {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(this.date).toLocaleDateString('en-US', options);
    }

    /**
     * getMonth()
     * 
     * Extracts month and year from transaction date.
     * Used for monthly spending calculations.
     * 
     * Arguments: None
     * Returns: String in format "YYYY-MM"
     */
    getMonth() {
        return this.date.substring(0, 7);
    }
}

// ========== FINANCE TRACKER CLASS ==========
/**
 * FinanceTracker Class
 * 
 * Main application controller managing all financial operations.
 * Handles data storage, calculations, filtering, and analytics.
 * 
 * Arguments: None
 * Returns: FinanceTracker object with complete functionality
 */
class FinanceTracker {
    constructor() {
        // Array holding all Transaction instances
        this.transactions = [];
        
        // Counter for unique transaction IDs
        this.nextId = 1;
        
        // Current active filter ('all', 'income', 'expense')
        this.currentFilter = 'all';
        
        // Load previously saved transactions
        this.loadFromStorage();
    }

    /**
     * addTransaction(description, amount, category, type, date)
     * 
     * Creates new Transaction object and adds to array.
     * Automatically saves to localStorage.
     * 
     * Arguments:
     *   - description: String description of transaction
     *   - amount: Numeric amount
     *   - category: Category string
     *   - type: 'income' or 'expense'
     *   - date: YYYY-MM-DD format string
     * 
     * Returns: The newly created Transaction object
     */
    addTransaction(description, amount, category, type, date) {
        const transaction = new Transaction(
            this.nextId++,
            description,
            amount,
            category,
            type,
            date
        );
        this.transactions.push(transaction);
        this.saveToStorage();
        return transaction;
    }

    /**
     * deleteTransaction(id)
     * 
     * Removes transaction by ID and updates storage.
     * 
     * Arguments:
     *   - id: Transaction ID to delete
     * 
     * Returns: Boolean success indicator
     */
    deleteTransaction(id) {
        const initialLength = this.transactions.length;
        this.transactions = this.transactions.filter(t => t.id !== id);
        if (this.transactions.length < initialLength) {
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * getTotalIncome()
     * 
     * Calculates sum of all income transactions.
     * Uses reduce() to efficiently sum amounts.
     * 
     * Arguments: None
     * Returns: Total income (number)
     */
    getTotalIncome() {
        return this.transactions.reduce((sum, transaction) => {
            return transaction.type === 'income' ? sum + transaction.amount : sum;
        }, 0);
    }

    /**
     * getTotalExpenses()
     * 
     * Calculates sum of all expense transactions.
     * Uses reduce() method for efficient computation.
     * 
     * Arguments: None
     * Returns: Total expenses (number)
     */
    getTotalExpenses() {
        return this.transactions.reduce((sum, transaction) => {
            return transaction.type === 'expense' ? sum + transaction.amount : sum;
        }, 0);
    }

    /**
     * getBalance()
     * 
     * Calculates current balance (income - expenses).
     * 
     * Arguments: None
     * Returns: Current balance (number)
     */
    getBalance() {
        return this.getTotalIncome() - this.getTotalExpenses();
    }

    /**
     * getMonthlySpent()
     * 
     * Calculates current month's expenses.
     * Filters transactions by current month.
     * 
     * Arguments: None
     * Returns: Current month expense total (number)
     */
    getMonthlySpent() {
        const today = new Date();
        const currentMonth = today.getFullYear() + '-' + 
                            String(today.getMonth() + 1).padStart(2, '0');
        
        return this.transactions.reduce((sum, transaction) => {
            if (transaction.type === 'expense' && transaction.getMonth() === currentMonth) {
                return sum + transaction.amount;
            }
            return sum;
        }, 0);
    }

    /**
     * getSavingsRate()
     * 
     * Calculates savings rate percentage.
     * Formula: (Income - Expenses) / Income * 100
     * 
     * Arguments: None
     * Returns: Savings rate percentage (0-100)
     */
    getSavingsRate() {
        const income = this.getTotalIncome();
        if (income === 0) return 0;
        return ((this.getBalance() / income) * 100).toFixed(1);
    }

    /**
     * getFilteredTransactions()
     * 
     * Returns transactions filtered by current filter setting.
     * Creates loop through array applying filter.
     * 
     * Arguments: None
     * Returns: Filtered array of Transaction objects
     */
    getFilteredTransactions() {
        if (this.currentFilter === 'all') {
            return this.transactions;
        }
        return this.transactions.filter(t => t.type === this.currentFilter);
    }

    /**
     * setFilter(filter)
     * 
     * Updates current filter setting.
     * 
     * Arguments:
     *   - filter: 'all', 'income', or 'expense'
     * 
     * Returns: None
     */
    setFilter(filter) {
        this.currentFilter = filter;
    }

    /**
     * saveToStorage()
     * 
     * Persists all data to browser localStorage as JSON.
     * Ensures data survives page refresh and browser close.
     * 
     * Arguments: None
     * Returns: None
     */
    saveToStorage() {
        localStorage.setItem('financeTrackerData', JSON.stringify({
            transactions: this.transactions,
            nextId: this.nextId
        }));
    }

    /**
     * loadFromStorage()
     * 
     * Restores previously saved data from localStorage.
     * Recreates Transaction objects from stored JSON.
     * 
     * Arguments: None
     * Returns: None
     */
    loadFromStorage() {
        const saved = localStorage.getItem('financeTrackerData');
        if (saved) {
            const data = JSON.parse(saved);
            this.nextId = data.nextId || 1;
            
            // Recreate Transaction class instances
            this.transactions = data.transactions.map(t =>
                new Transaction(t.id, t.description, t.amount, t.category, t.type, t.date)
            );
        }
    }

    /**
     * sortTransactionsByDate()
     * 
     * Sorts array in reverse chronological order (newest first).
     * 
     * Arguments: None
     * Returns: None (modifies array in place)
     */
    sortTransactionsByDate() {
        this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    /**
     * clearAllTransactions()
     * 
     * Removes all transactions and resets tracker.
     * 
     * Arguments: None
     * Returns: None
     */
    clearAllTransactions() {
        this.transactions = [];
        this.nextId = 1;
        this.saveToStorage();
    }

    /**
     * exportAsJSON()
     * 
     * Exports all data as JSON file for backup.
     * 
     * Arguments: None
     * Returns: None (triggers download)
     */
    exportAsJSON() {
        const data = {
            exportDate: new Date().toISOString(),
            transactions: this.transactions,
            summary: {
                totalIncome: this.getTotalIncome(),
                totalExpenses: this.getTotalExpenses(),
                balance: this.getBalance()
            }
        };
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-tracker-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    }
}

// ========== APPLICATION INITIALIZATION ==========
/**
 * initializeApp()
 * 
 * Main initialization function called when DOM loads.
 * Sets up tracker, event listeners, and initial UI render.
 * 
 * Arguments: None
 * Returns: None
 */
function initializeApp() {
    // Create tracker instance
    const tracker = new FinanceTracker();
    tracker.sortTransactionsByDate();

    // ========== EVENT LISTENERS ==========

    // Form submission handler
    document.getElementById('transactionForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const type = document.querySelector('input[name="type"]:checked').value;
        const date = document.getElementById('date').value;

        tracker.addTransaction(description, amount, category, type, date);
        tracker.sortTransactionsByDate();

        document.getElementById('transactionForm').reset();
        setTodayDate();
        updateAllUI();
    });

    // Filter button handlers
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            tracker.setFilter(e.target.dataset.filter);
            renderTransactions(tracker);
        });
    });

    // Export button handler
    document.getElementById('exportBtn').addEventListener('click', () => {
        tracker.exportAsJSON();
    });

    // Clear button handler
    document.getElementById('clearBtn').addEventListener('click', () => {
        if (confirm('⚠️ Are you sure? This will delete ALL transactions permanently!')) {
            tracker.clearAllTransactions();
            updateAllUI();
        }
    });

    setTodayDate();
    updateAllUI();

    /**
     * updateAllUI()
     * 
     * Updates all dashboard elements to reflect current data.
     * Called whenever data changes.
     * 
     * Arguments: None
     * Returns: None
     */
    function updateAllUI() {
        // Update balance cards
        document.getElementById('totalIncome').textContent = 
            `$${tracker.getTotalIncome().toFixed(2)}`;
        document.getElementById('totalExpenses').textContent = 
            `$${tracker.getTotalExpenses().toFixed(2)}`;
        document.getElementById('currentBalance').textContent = 
            `$${tracker.getBalance().toFixed(2)}`;

        // Update stats
        document.getElementById('totalTransactions').textContent = 
            tracker.transactions.length;
        document.getElementById('monthSpent').textContent = 
            `$${tracker.getMonthlySpent().toFixed(2)}`;
        document.getElementById('savingsRate').textContent = 
            `${tracker.getSavingsRate()}%`;

        // Render transactions
        renderTransactions(tracker);
    }
}

// ========== RENDERING FUNCTION ==========
/**
 * renderTransactions(tracker)
 * 
 * Creates HTML for each transaction using loop through array.
 * Generates dynamic DOM elements from Transaction objects.
 * 
 * Arguments:
 *   - tracker: FinanceTracker instance with transactions array
 * 
 * Returns: None (modifies DOM)
 */
function renderTransactions(tracker) {
    const container = document.getElementById('transactionsList');
    const filtered = tracker.getFilteredTransactions();

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <img src="https://via.placeholder.com/100/ddd/999?text=📝" alt="Empty" class="empty-icon">
                <p>No transactions to display. Start tracking! 👆</p>
            </div>
        `;
        return;
    }

    // Loop through filtered transactions and create HTML
    container.innerHTML = filtered.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-left">
                <div class="transaction-icon">${transaction.getIcon()}</div>
                <div class="transaction-details">
                    <div class="transaction-description">${escapeHtml(transaction.description)}</div>
                    <div class="transaction-meta">
                        <span class="transaction-meta-item">📅 ${transaction.getFormattedDate()}</span>
                        <span class="transaction-category">${transaction.category}</span>
                    </div>
                </div>
            </div>
            <div class="transaction-right">
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.getFormattedAmount()}
                </div>
                <button class="btn btn-danger" onclick="deleteTransactionHandler(${transaction.id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * deleteTransactionHandler(id)
 * 
 * Global handler for delete button clicks.
 * Manages deletion through localStorage.
 * 
 * Arguments:
 *   - id: Transaction ID to delete
 * 
 * Returns: None
 */
function deleteTransactionHandler(id) {
    if (confirm('Delete this transaction?')) {
        const saved = localStorage.getItem('financeTrackerData');
        if (saved) {
            const data = JSON.parse(saved);
            data.transactions = data.transactions.filter(t => t.id !== id);
            localStorage.setItem('financeTrackerData', JSON.stringify(data));
            location.reload();
        }
    }
}

/**
 * setTodayDate()
 * 
 * Sets date input to current date in YYYY-MM-DD format.
 * Improves user experience with sensible defaults.
 * 
 * Arguments: None
 * Returns: None
 */
function setTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('date').value = `${yyyy}-${mm}-${dd}`;
}

/**
 * escapeHtml(text)
 * 
 * Sanitizes user input to prevent XSS attacks.
 * Converts HTML special characters to entities.
 * 
 * Arguments:
 *   - text: String to escape
 * 
 * Returns: Safe HTML string
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ========== INITIALIZATION ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', initializeApp);
