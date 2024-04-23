export interface IUser {
    userId: number;
    username: string;
    email: string;
    createdAt?: Date;
    lastLogin?: Date;
    passwordHash: string;
    deletedAt?: Date;
    tierId: number;
    role: string;
}

export interface IPhoneNumber {
    phoneNumberId: number;
    userId: number;
    phoneNumber: string;
    country: string;
    isActive: boolean;
    purchasedAt?: Date;
    deletedAt?: Date;
    twilioSid: string;
}

export interface IContact {
    contactId: number;
    userId: number;
    name: string;
    phoneNumber: string;
    createdAt?: Date;
    deletedAt?: Date;
}

export interface ICampaign {
    campaignId: number;
    userId: number;
    phoneNumberId: number;
    name: string;
    status: string;
    createdAt?: Date;
    deletedAt?: Date;
    description?: string;
}

export interface ISubscriptionTier {
    tierId: number;
    tierName: string;
    description?: string;
    price: number;
}

export interface IMessage {
    messageId?: number;
    campaignId: number;
    contactId: number;
    messageContent: string;
    sentAt?: Date;
    status?: string;
    deletedAt?: Date;
    twilioSid?: string;
}

export interface IResponse {
    responseId?: number;
    messageId: number;
    responseContent: string;
    receivedAt?: Date;
    deletedAt?: Date;
}

export interface ICampaignCategory {
    categoryId: number;
    campaignId: number;
    categoryLabel: string;
    createdAt: Date;
    deletedAt?: Date;
}

export interface IResponseCategorization {
    categorizationId: number;
    responseId: number;
    deletedAt?: Date;
    categoryId: number;
}

export interface UserUpdates {
    username?: string;
    email?: string;
    passwordHash?: string;
    tierId?: number;
}

export interface ContactUpdates {
    name?: string;
    phoneNumber?: string;
}

export interface CampaignUpdates {
    name?: string;
    description?: string;
    status?: string;
    phoneNumber?: string;
}