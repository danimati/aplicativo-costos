import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

const md = new MarkdownIt({ breaks: true, linkify: true });

@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value?.trim()) {
      return this.sanitizer.bypassSecurityTrustHtml('<p class="empty-preview">Sin contenido.</p>');
    }
    const clean = DOMPurify.sanitize(md.render(value));
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}
