import * as passport from 'passport';

export class UserProfile {
    sub: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    profile?: string;
    picture?: string;
    website?: string;
    email?: string;
    email_verified?: boolean;
    gender?: 'male' | 'female' | string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    phone_number?: string;
    phone_number_verified?: boolean;
    address ?: {
        formatted?: string
        street_address?: string
        locality?: string
        region?: string
        postal_code?: string
        country?: string
    };
    updated_at?: number;

    // support for profile[key]
    [key: string]: any


    constructor(data: any) {
        this.sub = data.sub;

        Object.keys(data).forEach(key => {
            this[key] = data[key];
        });
    }

}

export class PassportUserProfile implements passport.Profile {
    provider: string;
    id: string;
    displayName: string;
    username?: string;
    name: {
        givenName: string,
        middleName?: string,
        familyName: string
    };
    emails: Array<{ value: string; type?: string }>;
    photos: Array<{ value: string }>;
    locale?: string;
    nickname?: string;
    gender?: string;

    _raw: string;
    _json: any;


    constructor(data: any, raw: string) {
        this.provider = 'authsider';

        this.id = data.sub;
        this.displayName = data.name;
        this.username = data.username;

        this.name = {
            givenName: data.given_name,
            middleName: data.middle_name,
            familyName: data.family_name,
        };

        if (data.email) {
            this.emails = [{
                value: data.email
            }];
        } else {
            this.emails = [];
        }

        if (data.picture) {
            this.photos = [{ value: data.picture }];
        } else {
            this.photos = [];
        }

        this.locale = data.locale;
        this.nickname = data.nickname;
        this.gender = data.gender;

        this._json = data;
        this._raw = raw;
    }

}
