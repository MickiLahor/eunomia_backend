import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendMailDto {
    // @IsString()
    // @IsNotEmpty()
    // username: string;

    // @IsString()
    // @IsNotEmpty()
    // password: string;

    // @IsString()
    // @IsNotEmpty()
    // domain: string;

    @IsArray()
    @IsNotEmpty()
    emails: string[];

    @IsString()
    @IsOptional()
    body: string;

    @IsString()
    @IsOptional()
    subject: string;

    // @IsString()
    // @IsNotEmpty()
    // secret: string;

    @IsArray()
    @IsOptional()
    attachments: [];
}