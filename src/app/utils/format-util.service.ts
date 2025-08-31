import { inject, Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FormatUtilService {
  private readonly sanitizer = inject(DomSanitizer);

  public formatAndSanitize(markdown: string | null | undefined): SafeHtml {
    if (!markdown) return this.sanitizer.bypassSecurityTrustHtml('');
    markdown = markdown.replaceAll('\n', '<br>');
    markdown = this.sanitizer.sanitize(SecurityContext.HTML, markdown) ?? '';
    markdown = markdown.replaceAll(/\*\*\*(.*?)\*\*\*/g, '<b><i>$1</i></b>');
    markdown = markdown.replaceAll(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    markdown = markdown.replaceAll(/\*(.*?)\*/g, '<i>$1</i>');
    return this.sanitizer.bypassSecurityTrustHtml(markdown);
  }
}
