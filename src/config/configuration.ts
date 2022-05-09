import { getMetadataArgsStorage } from 'typeorm';

export default () => {
  const isProd = process.env.NODE_ENV === 'production';
  const isDev = process.env.NODE_ENV === 'development';
  const isStaging = process.env.NODE_ENV === 'staging';

  return {
    isProd,
    isDev,
    isStaging,
    port: parseInt(process.env.APP_PORT, 10) || 3100,
    domain: process.env.APP_DOMAIN,
    webAppDomain: process.env.WEB_APP_DOMAIN,
    auth: {
      secret: process.env.AUTH_SECRET,
      expiresIn: +process.env.AUTH_EXPIRES_IN || 30 * 24 * 60 * 60, // 30 days
    },
    typeorm: {
      type: 'postgres',
      host: process.env.TYPEORM_HOST || 'localhost',
      port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      logging: isDev ? ['query', 'error'] : ['error'],
      logger: 'advanced-console',
      entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
      synchronize: false,
      autoLoadEntities: true,
    },
    awsSes: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      source: process.env.SOURCE,
      region: process.env.SES_REGION,
    },
    adminEmails: process.env.ADMIN_EMAIL.split(','),

    authorizeNet: {
      apiLoginKey: process.env.API_LOGIN_KEY,
      transactionKey: process.env.TRANSACTION_KEY,
    },
    contentful: {
      application: process.env.CONTENTFUL_APPLICATION,
      spaceId: process.env.CONTENTFUL_SPACE_ID,
      deliveryToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
    },
    customerAgency: process.env.CUSTOMER_AGENCY,
  };
};
