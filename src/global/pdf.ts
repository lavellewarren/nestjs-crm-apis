import * as fs from 'fs'
import { IInvoice } from 'src/real_estate_order/interface/invoice_interface';
import { processString } from './util'
const PDFDocument = require("pdfkit-table");
export class PDFInvoiceGenerator {

  public headerData: any;
  public contract: any;
  public invoiceData: any;
  public invoiceResultTable: any;

  public l = 15;
  public x1 = 50;
  public x2 = 250;
  public x3 = 450;


  constructor(invoice: IInvoice) {
    this.headerData = invoice.invoiceHeader;
    this.contract = invoice.invoiceContractData;
    this.invoiceData = invoice.invoiceDataTable;
    this.invoiceResultTable = invoice.invoiceResultTable;
  }

  async createInvoice() {
    let token = 'AHW' + this.headerData.invoice_number + '_' + require('crypto').randomBytes(10).toString('hex');
    const path = 'public/invoice/' + token + '.pdf';
    let doc = new PDFDocument({ margin: 50 });
    this.generateHeader(doc, this.headerData);
    this.generateContractPart(doc, this.contract, 200);
    this.generateInvoiceTable(doc, this.invoiceData, this.invoiceResultTable, 410);
    this.generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));


    const pdfBuffer: Buffer = await new Promise(resolve => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
        margin: 50
      })

      // customize PDF document
      this.generateHeader(doc, this.headerData);
      this.generateContractPart(doc, this.contract, 200);
      this.generateInvoiceTable(doc, this.invoiceData, this.invoiceResultTable, 410);
      this.generateFooter(doc);

      doc.end();
      doc.pipe(fs.createWriteStream(path));

      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
    })
    return { buffer: pdfBuffer, filename: token };


  }

  generateHeader(doc, headerData) {
    doc.image('src/global/logo.jpg', 50, 45, { width: 150 })
      .fillColor('#444444')
      .fontSize(10)
      .text(`Date: ${headerData.order_date}`, 200, 65, { align: 'right' })
      .text(`INVOICE / CONTRACT AHW${headerData.invoice_number}`, 200, 80, { align: 'right' })
      .text(`Property in ${headerData.location_name}`, 200, 105, { align: 'right' })
      .text(`${headerData.co_type_name}`, 200, 120, { align: 'right' })
      .text(`Billed To: ${headerData.order_biller}`, 200, 140, { align: 'right' })
      .text(headerData.sales_person == "" || headerData.sales_person === null ? "" : `Sales Person: ${headerData.sales_person}`, 200, 155, { align: 'right' })
      .moveDown();
  }

  generateFooter(doc) {
    doc.fontSize(10)
      .text('Acclaimed Home Warranty, LLC P.O Box 9720, Salt Lake City, UT 84109 Phone 801-610-1556 Fax 801-783-5333', 50, doc.page.height - 70, { align: 'center', lineBreak: false })
      .text('www.acclaimedhw.com', 250, doc.page.height - 50, { align: 'center', lineBreak: false });
  }

  generateContractPart(doc, contract, yStart) {
    let y = yStart, _h = 20;
    doc.font('Helvetica-Bold')
      .text('Property Address', this.x1, y)
      .font('Helvetica')
      .text(`${contract.prop_street1} ${contract.prop_street2 ? contract.prop_street2 : ""} `, 200, y)
      .text(`${contract.prop_city} ${contract.prop_state} ${contract.prop_zipcode} `, 200, y + this.l)
      .text(contract.closing_date == "" || contract.closing_date == null ? "" : `Estimated Close Date / Settlement Date:`, this.x2, y, { align: 'right' })
      .text(contract.closing_date == "" || contract.closing_date == null ? "" : contract.closing_date, this.x2, y + this.l, { align: 'right' })
      .moveDown();

    y = 240;
    doc.font('Helvetica-Bold')
      .text('Buyer:', 50, y)
      .text('Seller:', 250, y)
      .text('Escrow:', 450, y)
      .font('Helvetica')
      .text(contract.buyer_name, this.x1, y + _h)
      .text(contract.buyer_email, this.x1, y + _h + this.l)
      .text(contract.buyer_phone, this.x1, y + _h + (this.l * 2))
      .text(contract.seller_name, this.x2, y + _h)
      .text(contract.seller_email, this.x2, y + _h + this.l)
      .text(contract.seller_phone, this.x2, y + _h + (this.l * 2))
      .text(contract.escrow_title, this.x3, y + _h)
      .text(processString(contract.escrow_street1) + " " + processString(contract.escrow_street2), this.x3, y + _h + this.l)
      .text(processString(contract.escrow_city) + " " + processString(contract.escrow_state) + " " + processString(contract.escrow_zipcode), this.x3, y + _h + (this.l * 2) + 10)
      .moveDown();

    y += _h * 3 + (this.l * 2)
    doc.font('Helvetica-Bold')
      .text('Buyer Agent:', this.x1, y)
      .text('Seller Agent:', this.x2, y)
      .text('Closing Officer:', this.x3, y)
      .text(processString(contract.escrow_assistantname) == "" ? '' : 'Escrow Assistant:', this.x3, y + _h + this.l * 3)
      .font('Helvetica')
      .text(contract.buyer_agentname, this.x1, y + _h)
      .text(contract.buyer_agentemail, this.x1, y + _h + this.l)
      .text(contract.buyer_agentphone, this.x1, y + _h + this.l * 2)
      .text(contract.seller_agentname, this.x2, y + _h)
      .text(contract.seller_agentemail, this.x2, y + _h + this.l)
      .text(contract.seller_agentphone, this.x2, y + _h + this.l * 2)
      .text(processString(contract.closing_officername), this.x3, y + _h)
      .text(processString(contract.closing_officeremail), this.x3, y + _h + this.l)
      .text(processString(contract.closing_officerphone), this.x3, y + _h + this.l * 2)
      .text(processString(contract.escrow_assistantname), this.x3, y + _h + this.l * 4)
      .text(processString(contract.escrow_assistantemail), this.x3, y + _h + this.l * 5)
      .moveDown();
  }

  generateInvoiceTable(doc, datas, resultData, yStart) {
    let y = yStart + 40;

    const table = {
      headers: [
        { label: "Date", property: 'date', renderer: null },
        { label: "Description", property: 'description', renderer: null },
        { label: "Quantity", property: 'quantity', renderer: null },
        { label: "Rate", property: 'rate', renderer: null },
        { label: "Line Total", property: 'line_total', renderer: null }
      ],
      // complex data
      datas: datas
    };

    doc.text('', 50, y);
    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font("Helvetica").fontSize(8);
        indexColumn === 0 && doc.addBackground(rectRow, 'green', 0.15);
      },
    });


    const tableResult = {
      headers: [
        { label: "", property: 'label', width: 100, renderer: null },
        { label: "", property: 'value', width: 105, renderer: null },
      ],
      // complex data
      datas: resultData
    };
    doc.text("", 357)
    doc.table(tableResult, {
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font("Helvetica").fontSize(8);
      },
    });
    doc.text("", 50)
    doc.fontSize(11)
      .text('Make all checks payable to Acclaimed Home Warranty, LLC', { align: 'center' })
      .font('Helvetica-Bold')
      .text('Thank you for your business!', { align: 'center' });
  }

}
