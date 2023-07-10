import { product } from "../stores/paymentStore";

export interface Order {
    orderCreateDate: string,
    totalAmount: string,
    products: product[],
    status: string
}