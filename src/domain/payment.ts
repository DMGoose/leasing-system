import { Money } from "./lease";

type Payment = {
 id: string;
 leaseId: string;
 paidAt: string;
 amount: Money;
};

export {Payment}