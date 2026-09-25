import { Injectable, signal } from '@angular/core';
import { ProjectNote } from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class ProjectNotesService {
  isModalOpen = signal(false);
  activeNoteId = signal<string | null>(null); // null = nota nueva
  activeProjectId = signal<string>('');
  activeDate = signal<string>('');
  activeContent = signal<string>('');

  private _notes = signal<ProjectNote[]>([
    {
      id: 'n1',
      projectId: 'PRY-2024-089',
      date: '2026-09-22',
      content:
        '# Corte de Costos\n- Revisar BOM\n- [ ] Aprobar gastos **extraordinarios**\n- [x] Enviar borrador',
    },
  ]);
  notes = this._notes.asReadonly();

  noteFor(projectId: string, date: string): ProjectNote | undefined {
    return this._notes().find((n) => n.projectId === projectId && n.date === date);
  }

  openNoteModal(date: string, projectId: string) {
    const existing = this.noteFor(projectId, date);
    this.activeNoteId.set(existing?.id ?? null);
    this.activeProjectId.set(projectId);
    this.activeDate.set(date);
    this.activeContent.set(existing?.content ?? '');
    this.isModalOpen.set(true);
  }

  closeNoteModal() {
    this.isModalOpen.set(false);
  }
  updateContent(content: string) {
    this.activeContent.set(content);
  }
  updateActiveDate(date: string) {
    this.activeDate.set(date);
  }

  saveNote() {
    const id = this.activeNoteId();
    const projectId = this.activeProjectId();
    const date = this.activeDate();
    const content = this.activeContent();

    if (!content.trim()) {
      this.deleteActiveNote();
      return;
    }

    if (id) {
      // Actualiza la nota existente, incluyendo si cambió de fecha
      this._notes.update((notes) => notes.map((n) => (n.id === id ? { ...n, date, content } : n)));
    } else {
      this._notes.update((notes) => [...notes, { id: 'n' + Date.now(), projectId, date, content }]);
    }
    this.closeNoteModal();
  }

  deleteActiveNote() {
    const id = this.activeNoteId();
    if (id) this._notes.update((notes) => notes.filter((n) => n.id !== id));
    this.closeNoteModal();
  }
}
