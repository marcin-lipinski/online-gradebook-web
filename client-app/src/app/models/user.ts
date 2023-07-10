export interface User {
    id: string;
    name: string;
    surname: string;
    login: string;
    token: string;
    userType: number;
    userTypeText: string;
}

export interface UserFormValues {
    login: string;
    password: string;
}
