export type CartItem = {
    dogId: number;
    kind: string;
    image: string;
    price: number;
    quantity: number;
    amount: number;
};

export type Cart = {
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
};
