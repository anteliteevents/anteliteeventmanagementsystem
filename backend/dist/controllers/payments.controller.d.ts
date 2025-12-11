import { Request, Response } from 'express';
declare class PaymentsController {
    listTransactions(req: Request, res: Response): Promise<void>;
    listInvoices(req: Request, res: Response): Promise<void>;
}
declare const _default: PaymentsController;
export default _default;
//# sourceMappingURL=payments.controller.d.ts.map