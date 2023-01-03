//authenticated user: used for authentication purposes (unlike "User")
export class AUser {
    email!: string;
    name!: string;
    password?: string
}