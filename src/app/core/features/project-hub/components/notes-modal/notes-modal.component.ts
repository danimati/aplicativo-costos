// src/app/shared/notes-modal/notes-modal.component.ts
import { Component, inject } from '@angular/core';
import { ProjectNotesService } from '../../../../services/ui/project-notes.service';

@Component({
  selector: 'app-notes-modal',
  templateUrl: './notes-modal.component.html',
  styleUrl: './notes-modal.component.css',
})
export class NotesModalComponent {
  public state = inject(ProjectNotesService);

  formatMarkdown(text: string): string {
    if (!text.trim())
      return '<p class="empty-preview">No hay contenido. Escribe algo a la izquierda.</p>';

    const escape = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const inline = (line: string) =>
      escape(line)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    const out: string[] = [];
    let list: { tag: 'ul' | 'ol'; items: string[] } | null = null;
    const flush = () => {
      if (!list) return;
      out.push(`<${list.tag}>${list.items.map((i) => `<li>${i}</li>`).join('')}</${list.tag}>`);
      list = null;
    };

    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (!line) {
        flush();
        continue;
      }

      const h = line.match(/^(#{1,3})\s+(.*)/);
      if (h) {
        flush();
        out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);
        continue;
      }

      const check = line.match(/^-\s+\[( |x|X)\]\s+(.*)/);
      if (check) {
        if (list?.tag !== 'ul') {
          flush();
          list = { tag: 'ul', items: [] };
        }
        const checked = check[1].toLowerCase() === 'x';
        list.items.push(
          `<label class="md-check"><input type="checkbox" disabled ${checked ? 'checked' : ''}/> ${inline(check[2])}</label>`,
        );
        continue;
      }

      const bullet = line.match(/^[-*]\s+(.*)/);
      if (bullet) {
        if (list?.tag !== 'ul') {
          flush();
          list = { tag: 'ul', items: [] };
        }
        list.items.push(inline(bullet[1]));
        continue;
      }

      const numbered = line.match(/^\d+\.\s+(.*)/);
      if (numbered) {
        if (list?.tag !== 'ol') {
          flush();
          list = { tag: 'ol', items: [] };
        }
        list.items.push(inline(numbered[1]));
        continue;
      }

      const quote = line.match(/^>\s+(.*)/);
      if (quote) {
        flush();
        out.push(`<blockquote>${inline(quote[1])}</blockquote>`);
        continue;
      }

      flush();
      out.push(`<p>${inline(line)}</p>`);
    }
    flush();
    return out.join('');
  }
}
