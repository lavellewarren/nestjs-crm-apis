export interface IInvoiceHeaderData {
  order_date: string,
  invoice_number: string,
  location_name: string,
  co_type_name: string,
  order_biller: string,
  sales_person: string,
}

export interface IInvoiceContractData {
  prop_street1: string,
  prop_street2: string,
  prop_city: string,
  prop_state: string,
  prop_zipcode: string,
  closing_date: string,
  buyer_name: string,
  buyer_email: string,
  buyer_phone: string,
  seller_name: string,
  seller_email: string,
  seller_phone: string,
  escrow_title: string,
  escrow_street1: string,
  escrow_street2: string,
  escrow_city: string,
  escrow_state: string,
  escrow_zipcode: string,
  buyer_agentname: string,
  buyer_agentemail: string,
  buyer_agentphone: string,
  seller_agentname: string,
  seller_agentemail: string,
  seller_agentphone: string,
  closing_officername: string,
  closing_officeremail: string,
  closing_officerphone: string,
  escrow_assistantname: string,
  escrow_assistantemail: string,
}

export interface IInvoiceDataTableRow {
  date: string,
  description: string,
  quantity: string,
  rate: string,
  line_total: string,
}

export interface IInvoiceResultDataRow {
  label: string,
  value: string,
}

export interface IInvoice {
  invoiceHeader: IInvoiceHeaderData,
  invoiceContractData: IInvoiceContractData,
  invoiceDataTable: IInvoiceDataTableRow[],
  invoiceResultTable: IInvoiceResultDataRow[],

}

