import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { AppMetadata, ManagementClient, User, UserMetadata } from 'auth0';

const userHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<User<AppMetadata, UserMetadata> | { message: string }>
) => {
    try {
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
            scope: 'openid profile read:users read:current_user read:user_idp_tokens',
        });

        const user = await currentUserManagementClient.getUser({ id });
        res.status(200).json(user);
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
};

export default withApiAuthRequired(userHandler);
