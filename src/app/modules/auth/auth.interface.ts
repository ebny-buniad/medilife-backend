export interface ISignUpPatientPayload {
    name: string,
    email: string,
    password: string
}

export interface ILoginUserPayload {
    email: string,
    password: string
}

export interface IChangePassword {
    newPassword: string,
    currentPassword: string
}
