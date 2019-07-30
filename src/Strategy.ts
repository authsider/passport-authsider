import { Request } from 'express';
import { OutgoingHttpHeaders } from 'http';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { ConfigurationError, UserProfileFetchError } from './errors';
import { PassportUserProfile, UserProfile } from './profiles';

export class Strategy extends OAuth2Strategy {

    private readonly options: InternalOptions;


    /**
     * `Strategy` constructor.
     *
     * @param {Object} options
     * @param {Function} verify
     * @api public
     */
    constructor(options: StrategyOptions, verify: VerifyFunction) {
        // runtime props check
        ['domain', 'clientID', 'clientSecret', 'callbackURL'].forEach(key => {
            if (!options[key]) {
                throw new ConfigurationError(key);
            }
        });

        const opts: InternalOptions = {
            authorizationURL: `https://${options.domain}/authorize`,
            tokenURL: `https://${options.domain}/oauth/token`,
            userInfoURL: `https://${options.domain}/userinfo`,
            ...options,
        };

        if (opts.state === undefined) {
            opts.state = true;
        }

        if (opts.oidcCompliantProfile === undefined) {
            opts.oidcCompliantProfile = false;
        }

        super(opts, verify);
        this.name = 'authsider';
        this.options = opts;
    }


    authenticate(req: Request, options?: AuthenticateOptions): void {
        if (req.query && req.query.error) {
            return this.fail(req.query.error);
        }

        super.authenticate(req, options);
    };

    // noinspection JSMethodCanBeStatic
    authorizationParams(options: AuthorizationOptions) {
        options = options || {};

        const params: AuthorizationOptions = {};
        if (options.connection) {
            params.connection = options.connection;
        }

        if (options.audience) {
            params.audience = options.audience;
        }

        if (options.prompt) {
            params.prompt = options.prompt;
        }

        return params;
    };

    /**
     * Retrieve user profile from Authsider.
     *
     * This function will build a normalized Passport-profile or an OIDC-compliant profile based on the options
     * provided when creating the strategy instance.
     *
     * @param {String} accessToken
     * @param {Function} done
     * @api protected
     */
    userProfile(accessToken: string, done: (err?: Error | null, profile?: UserProfile | PassportUserProfile | null) => void) {
        this._oauth2.get(this.options.userInfoURL, accessToken, (err, body) => {
            if (err) {
                return done(new UserProfileFetchError(err.statusCode, err.data));
            }

            if (!body) {
                return done(new UserProfileFetchError(0, null));
            }

            try {
                const json = JSON.parse(body.toString());
                const profile = this.options.oidcCompliantProfile
                    ? new UserProfile(json)
                    : new PassportUserProfile(json, body.toString());

                done(null, profile);
            } catch (e) {
                done(e);
            }
        });
    };

}


interface StrategyBaseOptions {
    domain: string
    clientID: string
    clientSecret: string
    callbackURL: string
    audience?: string
    customHeaders?: OutgoingHttpHeaders
    scopeSeparator?: string
    state?: boolean
    oidcCompliantProfile?: boolean

    // support for options[key]
    readonly [key: string]: unknown
}

export interface StrategyOptions extends StrategyBaseOptions {
    passReqToCallback?: false;
}

export interface StrategyOptionsWithRequest extends StrategyBaseOptions {
    passReqToCallback: true;
}

interface InternalOptions extends StrategyBaseOptions {
    authorizationURL: string
    tokenURL: string
    userInfoURL: string
}


export interface AuthenticateOptions {

}

export interface AuthorizationOptions {
    connection?: string
    audience?: string
    prompt?: string
}

export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    extraParams: unknown,
    profile: UserProfile | PassportUserProfile,
    done: (error: any, user?: any, info?: any) => void
) => void;
