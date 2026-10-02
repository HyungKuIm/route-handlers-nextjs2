export type Role = "USER" | "ADMIN";

export type Member = {
    id: number;
    username: string;
    role: Role;
};
