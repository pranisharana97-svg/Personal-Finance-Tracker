/*
   Personal Finance Tracker - JavaScript Application
   
   This application uses Object-Oriented Programming with a Transaction class
   to manage personal finance data. Users can add income and expense transactions,
   filter them, and see real-time balance calculations.
   
   Author: Priya Rani
   Date: 2026
*/

// ========== TRANSACTION CLASS ==========
/**
 * Transaction Class
 * 
 * Represents a single financial transaction (income or expense).
 * This class encapsulates all transaction data and methods.
 * 
 * Arguments:
 *   - id: Unique identifier for the transaction (number)
 *   - description: What the transaction is for (string)
 *   - amount: How much money (number)
 *   - category: Category of the transaction (string)
 *   - type: Either 'income' or 'expense' (string)
 *   - date: When the transaction occurred (string in YYYY-MM-DD format)
 * 
 * Returns: Transaction object with properties and methods
 */
class Transaction {
    constructor(id, description, amount, category, type, date) {
        this.id = id;
        this.description = description;
        this.amount = parseFloat(amount);
        this.category = category;
        this.type = type; // 'income' or 'expense'
        this.date = date;
    }

    /**
     * getFormattedAmount()
     * 
     * Formats the transaction amount as a currency string.
     * For expenses, it adds a minus sign.
     * 
     * Arguments: None
     * Returns: Formatted amount string (e.g., "+$100.00" or "-$50.00")
     */
    getFormattedAmount() {
        const sign = this.type === 'income' ? '+' : '-';
        return `${sign}$${this.amount.toFixed(2)}`;
    }

    /**
     * getIcon()
     * 
     * Returns an emoji icon based on the transaction category.
     * This icon is displayed in the UI for visual identification.
     * 
     * Arguments: None
     * Returns: Emoji string representing the category
     */
    getIcon() {
        const icons = {
            'Salary': '💼',
            'Freelance': '💻',
            'Investment': '📈',
            'Other Income': '💰',
            'Food': '🍔',
            'Transportation': '🚗',
            'Entertainment': '🎬',
            'Utilities': '💡',
            'Healthcare': '🏥',
            'Shopping': '🛍️',
            'Education': '📚',
            'Other Expense': '❌'
        };
        return icons[this.category] || '💾';
    }

    /**
     * getFormattedDate()
     * 
     * Converts the date string into a more readable format.
     * 
     * Arguments: None
     * Returns: Formatted date string (e.g., "Jan 15, 2026")
     */
    getFormattedDate() {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(this.date).toLocaleDateString('en-US', options);
    }
}

// ========== FINANCE TRACKER CLASS ==========
/**
 * FinanceTracker Class
 * 
 * Main application class that manages all financial data and operations.
 * This class handles storing transactions, calculating totals, filtering,
 * and updating the UI.
 * 
 * Arguments: None
 * Returns: FinanceTracker object with all methods
 */
class FinanceTracker {
    constructor() {
        // Array to hold all Transaction instances
        this.transactions = [];
        
        // Counter to generate unique IDs for transactions
        this.nextId = 1;
        
        // Current filter being applied ('all', 'income', or 'expense')
        this.currentFilter = 'all';
        
        // Load any existing transactions from browser's localStorage
        this.loadFromStorage();
    }

    /**
     * addTransaction(description, amount, category, type, date)
     * 
     * Creates a new Transaction object and adds it to the transactions array.
     * Also saves to localStorage for persistence.
     * 
     * Arguments:
     *   - description: String describing the transaction
     *   - amount: Number representing the amount
     *   - category: String category name
     *   - type: String ('income' or 'expense')
     *   - date: String in YYYY-MM-DD format
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
     * Removes a transaction from the array by its ID.
     * Updates localStorage after deletion.
     * 
     * Arguments:
     *   - id: Unique identifier of transaction to delete
     * 
     * Returns: Boolean indicating if deletion was successful
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
     * Calculates the sum of all income transactions.
     * Uses array reduce method to sum amounts where type is 'income'.
     * 
     * Arguments: None
     * Returns: Number representing total income
     */
    getTotalIncome() {
        return this.transactions.reduce((sum, transaction) => {
            return transaction.type === 'income' ? sum + transaction.amount : sum;
        }, 0);
    }

    /**
     * getTotalExpenses()
     * 
     * Calculates the sum of all expense transactions.
     * Uses array reduce method to sum amounts where type is 'expense'.
     * 
     * Arguments: None
     * Returns: Number representing total expenses
     */
    getTotalExpenses() {
        return this.transactions.reduce((sum, transaction) => {
            return transaction.type === 'expense' ? sum + transaction.amount : sum;
        }, 0);
    }

    /**
     * getBalance()
     * 
     * Calculates current balance by subtracting total expenses from total income.
     * 
     * Arguments: None
     * Returns: Number representing current balance
     */
    getBalance() {
        return this.getTotalIncome() - this.getTotalExpenses();
    }

    /**
     * getFilteredTransactions()
     * 
     * Returns transactions filtered by the current filter setting.
     * Used to display only certain types of transactions based on user selection.
     * 
     * Arguments: None
     * Returns: Array of Transaction objects matching the current filter
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
     * Changes the current filter and triggers a UI update.
     * 
     * Arguments:
     *   - filter: String ('all', 'income', or 'expense')
     * 
     * Returns: None
     */
    setFilter(filter) {
        this.currentFilter = filter;
    }

    /**
     * saveToStorage()
     * 
     * Saves all transactions to browser's localStorage as JSON.
     * This allows data to persist even after browser is closed.
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
     * Loads transactions from localStorage if they exist.
     * Called during initialization to restore previous data.
     * 
     * Arguments: None
     * Returns: None
     */
    loadFromStorage() {
        const saved = localStorage.getItem('financeTrackerData');
        if (saved) {
            const data = JSON.parse(saved);
            this.nextId = data.nextId || 1;
            
            // Recreate Transaction objects from saved data
            // This is important because JSON doesn't store class methods
            this.transactions = data.transactions.map(t =>
                new Transaction(t.id, t.description, t.amount, t.category, t.type, t.date)
            );
        }
    }

    /**
     * sortTransactionsByDate()
     * 
     * Sorts transactions in reverse chronological order (newest first).
     * 
     * Arguments: None
     * Returns: None (modifies array in place)
     */
    sortTransactionsByDate() {
        this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

// ========== UI CONTROLLER ==========
/**
 * initializeApp()
 * 
 * Sets up the entire application when the page loads.
 * Initializes the FinanceTracker, sets up event listeners,
 * and renders initial UI.
 * 
 * Arguments: None
 * Returns: None
 */
function initializeApp() {
    // Create the main application object
    const tracker = new FinanceTracker();

    // Sort transactions before rendering
    tracker.sortTransactionsByDate();

    // ========== EVENT LISTENERS ==========

    // Handle form submission - when user clicks "Add Transaction" button
    document.getElementById('transactionForm').addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload

        // Get form values from input fields
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const type = document.querySelector('input[name="type"]:checked').value;
        const date = document.getElementById('date').value;

        // Add the transaction to our tracker
        tracker.addTransaction(description, amount, category, type, date);

        // Re-sort transactions after adding
        tracker.sortTransactionsByDate();

        // Reset form fields to empty
        document.getElementById('transactionForm').reset();

        // Set date input to today (better UX)
        setTodayDate();

        // Update all UI displays
        updateAllUI();
    });

    // Handle filter button clicks
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            e.target.classList.add('active');
            
            // Update tracker filter
            tracker.setFilter(e.target.dataset.filter);
            
            // Refresh transaction display
            renderTransactions(tracker);
        });
    });

    // Set today's date as default in the date input
    setTodayDate();

    // Initial render of the UI
    updateAllUI();

    // ========== HELPER FUNCTION: updateAllUI ==========
    /**
     * updateAllUI()
     * 
     * Updates all UI elements to reflect current data.
     * This is called whenever data changes to keep display in sync.
     * 
     * Arguments: None (uses tracker from parent scope)
     * Returns: None
     */
    function updateAllUI() {
        // Update balance totals at top of page
        document.getElementById('totalIncome').textContent = 
            `$${tracker.getTotalIncome().toFixed(2)}`;
        document.getElementById('totalExpenses').textContent = 
            `$${tracker.getTotalExpenses().toFixed(2)}`;
        document.getElementById('currentBalance').textContent = 
            `$${tracker.getBalance().toFixed(2)}`;

        // Update the list of transactions
        renderTransactions(tracker);
    }
}

// ========== RENDERING FUNCTION ==========
/**
 * renderTransactions(tracker)
 * 
 * Creates HTML for each transaction and inserts into the DOM.
 * This is a loop that renders each transaction instance from the array.
 * 
 * Arguments:
 *   - tracker: The FinanceTracker instance containing transaction data
 * 
 * Returns: None (modifies DOM)
 */
function renderTransactions(tracker) {
    const container = document.getElementById('transactionsList');
    
    // Get filtered transactions based on current filter
    const filtered = tracker.getFilteredTransactions();

    // Check if there are any transactions to display
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No transactions yet. Add one to get started! 👆</p></div>';
        return;
    }

    // Loop through each filtered transaction and create HTML
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
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * deleteTransactionHandler(id)
 * 
 * Global function to handle deletion when delete button is clicked.
 * This bridges the gap between inline onclick handlers and our tracker object.
 * 
 * Arguments:
 *   - id: Transaction ID to delete
 * 
 * Returns: None
 */
function deleteTransactionHandler(id) {
    // Get tracker from our current app state
    // Since tracker is in initializeApp closure, we need a workaround
    // We'll get all transactions and recreate the app state
    if (confirm('Are you sure you want to delete this transaction?')) {
        // Access localStorage directly
        const saved = localStorage.getItem('financeTrackerData');
        if (saved) {
            const data = JSON.parse(saved);
            data.transactions = data.transactions.filter(t => t.id !== id);
            localStorage.setItem('financeTrackerData', JSON.stringify(data));
            
            // Reinitialize the entire app to reflect changes
            location.reload();
        }
    }
}

/**
 * setTodayDate()
 * 
 * Sets the date input field to today's date in YYYY-MM-DD format.
 * Provides better UX by defaulting to current date.
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
 * Escapes HTML special characters to prevent XSS attacks.
 * Converts user input so it displays as text, not as HTML.
 * 
 * Arguments:
 *   - text: String to escape
 * 
 * Returns: Escaped string safe for HTML
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

// ========== INITIALIZATION ==========
// Wait for the HTML document to fully load before running JavaScript
document.addEventListener('DOMContentLoaded', initializeApp);
