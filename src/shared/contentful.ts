import { ContentfulClientApi, createClient } from 'contentful';

export const useContentfulDeliveryClient = (config: any) => {
  const deliveryClient = createClient({
    application: 'Website',
    space: config.spaceId,
    accessToken: config.deliveryToken,
    removeUnresolved: true,
  });

  return deliveryClient;
};

export type Coupon = {
  code: string;
  type: 'Fixed' | 'Percent';
  amount: number;
  expirationDate: Date;
  products: Array<'Real Estate' | 'Home Owner'>;
};

/**
 * Get coupons
 */
export const useGetCoupons = (client: ContentfulClientApi) => {
  return () =>
    client
      .getEntries({
        content_type: 'coupons',
      })
      .then((response) => {
        const items = response.items;
        return items.map((item) => item.fields);
      });
};
