import { Injectable, inject, signal } from '@angular/core';
import { ProjectNoteService } from '../project-notes.service';
import { ProjectNote } from '../../models/note.model';

@Injectable({ providedIn: 'root' })
export class ProjectNotesService {
  private notesApi = inject(ProjectNoteService);

  isModalOpen = signal(false);
  activeNoteId = signal<string | null>(null);
  activeProjectId = signal<string>('');
  activeDate = signal<string>('');
  activeContent = signal<string>('');

  private _notes = signal<ProjectNote[]>([]);
  notes = this._notes.asReadonly();

  loadNotes(projectId: string) {
    this.notesApi.getNotes(projectId).subscribe((notes) => this._notes.set(notes));
  }

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
      this.notesApi.updateNote(id, { date, content }).subscribe((updated) => {
        this._notes.update((notes) => notes.map((n) => (n.id === id ? updated : n)));
        this.closeNoteModal();
      });
    } else {
      this.notesApi.createNote({ projectId, date, content }).subscribe((created) => {
        this._notes.update((notes) => [...notes, created]);
        this.closeNoteModal();
      });
    }
  }

  deleteActiveNote() {
    const id = this.activeNoteId();
    if (!id) {
      this.closeNoteModal();
      return;
    }
    this.notesApi.deleteNote(id).subscribe(() => {
      this._notes.update((notes) => notes.filter((n) => n.id !== id));
      this.closeNoteModal();
    });
  }
}
