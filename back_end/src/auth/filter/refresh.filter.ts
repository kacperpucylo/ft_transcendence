import { ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";

@Catch(UnauthorizedException)
export class RefreshFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const status = exception.getStatus()
		response
			.status(status)
			.json({
				statusCode: status,
				message: "Refreshing token failed"
			})
	}
}