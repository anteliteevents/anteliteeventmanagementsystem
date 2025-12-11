"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const invoice_model_1 = __importDefault(require("../models/invoice.model"));
class PaymentsController {
    async listTransactions(req, res) {
        try {
            const transactions = await transaction_model_1.default.findAll();
            const response = {
                success: true,
                data: transactions
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching transactions:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'TRANSACTIONS_FETCH_FAILED',
                    message: error.message || 'Failed to fetch transactions'
                }
            });
        }
    }
    async listInvoices(req, res) {
        try {
            const invoices = await invoice_model_1.default.findAll();
            const response = {
                success: true,
                data: invoices
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching invoices:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INVOICES_FETCH_FAILED',
                    message: error.message || 'Failed to fetch invoices'
                }
            });
        }
    }
}
exports.default = new PaymentsController();
//# sourceMappingURL=payments.controller.js.map