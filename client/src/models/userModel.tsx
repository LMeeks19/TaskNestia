import { UserRole } from "../enums/userRoleEnum"

interface UserModel {
    id: number
    username: string
    role: UserRole
    createdAt: Date
}

export default UserModel