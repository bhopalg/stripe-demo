import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
    async login(req, res) {
        try {
            await handleLogin(req, res, {
                authorizationParams: {
                    audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
                    scope: 'openid profile read:users read:current_user read:user_idp_tokens update:current_user_metadata',
                },
            });
        } catch (error: any) {
            res.status(error.status || 400).end(error.message);
        }
    },
});
