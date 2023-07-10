import { makeAutoObservable, runInAction } from 'mobx';
import agents from '../api/agent';
import { Order } from '../models/order';

export type product = {
    name: string;
    unitPrice: string;
    quantity: string;
};

export interface IOrder {
    customerIp: string;
    description: string;
    totalAmount: string;
    buyer: {
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        language: string;
    };
    products: product[];
}

export default class PaymentStore {
    loading: boolean = false;
    loadingOrders: boolean = false;
    orders: Order[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    prepereOrderObject = () => {
        this.loading = true;
        const order: IOrder = {
            customerIp: '',
            description: '',
            totalAmount: '',
            buyer: {
                email: '',
                phone: '',
                firstName: '',
                lastName: '',
                language: 'pl',
            },
            products: [],
        };
        return order;
    };

    proceedPayment = async (order: IOrder, parentId: string) => {
        try {
            const paymentLink = await agents.PayU.pay(order, parentId);
            runInAction(() => (window.location.href = paymentLink));
        } catch (error) {
            console.log(error);
            this.loading = false;
            throw error;
        }
    };

    loadParentOrders = async (parentId: string) => {
        this.loadingOrders = true;
        try {
            const orders = await agents.PayU.list(parentId);
            runInAction(() =>{ 
                this.orders = orders;
                this.loadingOrders = false;
            });
        } catch (error) {
            console.log(error);
            this.loadingOrders = false;
            throw error;
        }
    };
}
