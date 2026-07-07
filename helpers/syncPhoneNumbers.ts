import { IUser, IPhoneNumber } from '../types/interfaces';
import { twilioClientForUser } from '../config/twilio';
import PhoneNumber from '../models/PhoneNumber';

/**
 * Reconciles the phone_numbers table with the numbers the user's connected
 * Twilio account actually owns, so the app never offers a From number that
 * would fail at send time. Returns the fresh list, or null if the user has
 * no connected Twilio account.
 */
export async function syncUserPhoneNumbers(user: IUser): Promise<IPhoneNumber[] | null> {
    const client = twilioClientForUser(user);
    if (!client) {
        return null;
    }
    const ownedNumbers = await client.incomingPhoneNumbers.list();
    await PhoneNumber.syncActiveByTwilioSids(user.userId, ownedNumbers.map(n => n.sid));
    return PhoneNumber.findByUserId(user.userId);
}
