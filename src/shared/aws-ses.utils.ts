import * as AWS from 'aws-sdk';
import configuration from '../config/configuration';

export enum EmailTemplate {
  CONTACT_US_CONFRIM = 'contact_us_confirm',
  CONTACT_AGENCY_NOTIFY = 'contact_agency_notify',
  REALESTATE_INVOICE_ADMIN_EMAIL = 'invoice_email_admin_template',
  REALESTATE_INVOICE_CLIENT_EMAIL = 'invoice_email_client_template',
  REALESTATE_DAILY_REPORT_EMAIL = 'daily_report_template',
  NOTIFY_TRANSACTION = 'notify_transaction',
}

const useSendEmail = (config: any) => {
  const AWS_SES = new AWS.SES(config);

  return ({ receiver, template, data }) => {
    const params = {
      Source: configuration().awsSes.source,
      Template: template,
      Destination: {
        ToAddresses: [receiver],
      },
      TemplateData: data,
    };
    return AWS_SES.sendTemplatedEmail(params).promise();
  };
};

export { useSendEmail };
