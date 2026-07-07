import { IUser, IPhoneNumber } from '../types/interfaces';
import { twilioClientForUser } from '../config/twilio';
import PhoneNumber from '../models/PhoneNumber';

/**
 * Two-way reconciliation between the phone_numbers table and the numbers
 * the user's connected Twilio account actually owns:
 *  - owned numbers missing from the table are imported (or revived, if
 *    their row was soft-deleted), and their inbound webhook is pointed
 *    at this API so replies flow in;
 *  - rows for numbers the account no longer owns are marked inactive.
 * Returns the fresh list, or null if the user has no connected account.
 */
export async function syncUserPhoneNumbers(user: IUser): Promise<IPhoneNumber[] | null> {
    const client = twilioClientForUser(user);
    if (!client) {
        return null;
    }

    const ownedNumbers = await client.incomingPhoneNumbers.list();
    const smsUrl = `${process.env.BASE_URL}/api/v1/sms/receive`;

    for (const owned of ownedNumbers) {
        // Twilio doesn't expose country on this resource; the app currently
        // only searches/purchases US numbers
        await PhoneNumber.restoreOrCreate(user.userId, owned.phoneNumber, 'US', owned.sid);

        if (owned.smsUrl !== smsUrl) {
            await client.incomingPhoneNumbers(owned.sid).update({ smsUrl });
        }
    }

    await PhoneNumber.syncActiveByTwilioSids(user.userId, ownedNumbers.map(n => n.sid));
    return PhoneNumber.findByUserId(user.userId);
}
