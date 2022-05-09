import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailTemplate, useSendEmail } from 'src/shared/aws-ses.utils';
import { ContactRequestDto } from './dto/contact-request.dto';

@Injectable()
export class ContactService {
  constructor(private configService: ConfigService) {}

  public async autoReplyContactRequest(customer: ContactRequestDto) {
    const awsSesConfig = this.configService.get('awsSes');
    const sendEmail = useSendEmail(awsSesConfig);

    //
    // Send automated reply to customer
    //
    const data = {
      name: customer.name,
    };
    sendEmail({
      receiver: customer.email,
      template: EmailTemplate.CONTACT_US_CONFRIM,
      data: JSON.stringify(data),
    });

    //
    // Send notification to customer agency
    //
    const agency = this.configService.get('customerAgency');
    const notifyData = {
      name: customer.name,
      email: customer.email,
      phone_number: customer.phone,
      message: customer.message,
    };
    sendEmail({
      receiver: agency,
      template: EmailTemplate.CONTACT_AGENCY_NOTIFY,
      data: JSON.stringify(notifyData),
    });
  }
}
