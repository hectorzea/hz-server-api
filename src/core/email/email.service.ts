import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import { render } from "@react-email/components";
import * as React from "react";
import RegisterUser from "emails/RegisterUser";

@Injectable()
export class EmailService {
  private resend: Resend;
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendRegisterEmail(user: string) {
    try {
      const htmlString = await render(
        React.createElement(RegisterUser, { user })
      );

      await this.resend.emails.send({
        from: "HZ Server <onboarding@resend.dev>", // Cambia por tu dominio
        to: [process.env.RESEND_EMAIL_SENDER!],
        subject: "You have registered an user",
        html: htmlString
      });
    } catch (error) {
      console.error("Error sending email", error);
    }
  }
}
