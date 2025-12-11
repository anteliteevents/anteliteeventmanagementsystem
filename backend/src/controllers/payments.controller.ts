import { Request, Response } from 'express';
import transactionModel from '../models/transaction.model';
import invoiceModel from '../models/invoice.model';
import { ApiResponse } from '../types';

class PaymentsController {
  async listTransactions(req: Request, res: Response): Promise<void> {
    try {
      const transactions = await transactionModel.findAll();
      const response: ApiResponse = {
        success: true,
        data: transactions
      };
      res.json(response);
    } catch (error: any) {
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

  async listInvoices(req: Request, res: Response): Promise<void> {
    try {
      const invoices = await invoiceModel.findAll();
      const response: ApiResponse = {
        success: true,
        data: invoices
      };
      res.json(response);
    } catch (error: any) {
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

export default new PaymentsController();

