import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				twoFactorSecret: secret
			}
		})
	}

	async turnOnTwoFactorAuthentication(userId: number) {
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				twoFactorAuth: true
			}
		})
	}

	async setName(user: User, body: any) {
		try {
			const userUpdated = await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					name: body.name
				}
			})
			return userUpdated
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new ForbiddenException("That username is already taken")
				}
			}
			throw error
		}
	}

	async findById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			}
		})

		if (!user) {
			throw new NotFoundException("This user doesn't exist")
		}

		delete user.hash
		delete user.twoFactorSecret

		return user
	}

	async findByName(name: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				name
			}
		})

		if (!user) {
			throw new NotFoundException("This user doesn't exist")
		}

		delete user.hash
		delete user.twoFactorSecret

		return user
	}
}