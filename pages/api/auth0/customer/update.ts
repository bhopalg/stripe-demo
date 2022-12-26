import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { ManagementClient } from 'auth0';

const userHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<
        { [key: string]: string | number | boolean } | { message: string }
    >
) => {
    try {
        const { body } = req;
        const params = body;

        const session = await getSession(req, res);

        if (session === null || session === undefined) {
            res.status(401).json({ message: 'Unauthorized' });
        }

        const id = session?.user.sub;
        const accessToken = session?.accessToken;
        const baseUrl = process.env.AUTH0_ISSUER_BASE_URL ?? '';

        const currentUserManagementClient = new ManagementClient({
            token: accessToken,
            domain: baseUrl.replace('https://', ''),
            scope: 'openid profile read:current_user update:current_user_metadata',
        });

        await currentUserManagementClient.updateUserMetadata({ id }, params);

        res.status(200).json(params);
    } catch (e: any) {
        console.log(e);
        res.status(400).json({ message: e.message });
    }
};

export default withApiAuthRequired(userHandler);
