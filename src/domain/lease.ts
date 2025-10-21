type Money = number;

type Lease = LeaseInput & {
 id: string;
 createdAt: string;
 schedule: Installment[];
 totals: { totalPayments: Money; totalInterest: Money; totalFees: Money };
};

type LeaseInput = {
 companyId: string;
 itemId: string;
 price: Money;
 termMonths: number;
 nominalRatePct: number;
 startDate: string; // ISO date
 upfrontFee: Money;
 monthlyFee: Money;
};

type Installment = {
 period: number;
 dueDate: string;
 payment: Money;
 interest: Money;
 principal: Money;
 fee: Money;
 balanceAfter: Money;
};

export {Money, LeaseInput, Installment, Lease}

