import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { VerifiedCallback } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

const Strategy = require('passport-42').Strategy

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'oauth2') {
	constructor(config: ConfigService) {
		super({
			clientID: config.get('42_UID'),
			clientSecret: config.get('42_SECRET'),
			callbackURL: config.get('42_URL')
		})
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done:VerifiedCallback) {
		const user = {
			id: profile.id,
			name: profile.username
		}

		done(null, user)
	}
}