import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactRequestDto } from './dto/contact-request.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactSerivce: ContactService) {}
  @Post()
  public async contactRequest(@Body() contactRequest: ContactRequestDto) {
    return this.contactSerivce.autoReplyContactRequest(contactRequest);
  }
}
