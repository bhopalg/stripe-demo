export interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    stripeCustomerId?: string;
}

export interface CreateUserDto {
    firstName?: string;
    lastName?: string;
    email: string;
    stripeCustomerId?: string;
}
