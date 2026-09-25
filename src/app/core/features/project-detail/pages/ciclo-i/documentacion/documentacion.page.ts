import { Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MarkdownPipe } from '../../../../../shared/pipes/markdown.pipe';
import { ProjectDocumentService } from '../../../../../services/project-document.service';
import { ProjectDocument } from '../../../../../models/project.model';
import { NotesModalComponent } from '../../../../project-hub/components/notes-modal/notes-modal.component';
import { ProjectNotesService } from '../../../../../services/ui/project-notes.service';


@Component({
  selector: 'app-project-documentacion',
  standalone: true,
  imports: [DatePipe, MarkdownPipe, NotesModalComponent],
  templateUrl: './documentacion.page.html',
  styleUrl: './documentacion.page.css',
})
export class DocumentacionPage {
  private route = inject(ActivatedRoute);
  private docsSvc = inject(ProjectDocumentService);
  public notesSvc = inject(ProjectNotesService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  documents = signal<ProjectDocument[]>([]);
  selectedId = signal<string | null>(null);
  draftTitle = signal('');
  draftContent = signal('');
  isPreview = signal(true);

  selectedDocument = computed(
    () => this.documents().find((d) => d.id === this.selectedId()) ?? null,
  );
  isFileDocument = computed(() => this.selectedDocument()?.kind === 'file');

  // Notas del proyecto (independientes de los documentos, no se mezclan)
  projectNotes = computed(() =>
    this.notesSvc.notes().filter((n) => n.projectId === this.projectId()),
  );

  constructor() {
    effect(() => {
      const id = this.projectId();
      if (!id) return;
      this.docsSvc.getDocuments(id).subscribe((docs) => this.documents.set(docs));
      this.notesSvc.loadNotes(id);
    });
  }

  selectDocument(id: string) {
    const doc = this.documents().find((d) => d.id === id);
    if (!doc) return;
    this.selectedId.set(doc.id);
    this.draftTitle.set(doc.title);
    this.draftContent.set(doc.kind === 'markdown' ? doc.content : '');
    this.isPreview.set(true);
  }

  newDocument() {
    this.selectedId.set(null);
    this.draftTitle.set('');
    this.draftContent.set('');
    this.isPreview.set(false);
  }

  updateTitle(v: string) {
    this.draftTitle.set(v);
  }
  updateContent(v: string) {
    this.draftContent.set(v);
  }

  save() {
    const projectId = this.projectId();
    const id = this.selectedId();
    const title = this.draftTitle().trim() || 'Sin título';
    const content = this.draftContent();
    const updatedAt = new Date().toISOString();

    if (id) {
      this.docsSvc.updateDocument(id, { title, content, updatedAt }).subscribe((updated) => {
        this.documents.update((docs) => docs.map((d) => (d.id === id ? updated : d)));
      });
    } else {
      this.docsSvc
        .createDocument({ projectId, title, content, kind: 'markdown', updatedAt })
        .subscribe((created) => {
          this.documents.update((docs) => [...docs, created]);
          this.selectedId.set(created.id);
        });
    }
  }

  // Subida de Word/Excel: se guarda como documento tipo 'file', no editable como markdown
  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const projectId = this.projectId();
    const fileUrl = URL.createObjectURL(file); // temporal: reemplazar por URL real cuando haya endpoint de upload
    const title = file.name.replace(/\.[^.]+$/, '');

    this.docsSvc
      .createDocument({
        projectId,
        title,
        kind: 'file',
        content: '',
        fileName: file.name,
        fileUrl,
        mimeType: file.type,
        updatedAt: new Date().toISOString(),
      })
      .subscribe((created) => {
        this.documents.update((docs) => [...docs, created]);
        this.selectDocument(created.id);
      });

    input.value = ''; // permite volver a subir el mismo archivo si hace falta
  }

  remove(id: string, ev: Event) {
    ev.stopPropagation();
    this.docsSvc.deleteDocument(id).subscribe(() => {
      this.documents.update((docs) => docs.filter((d) => d.id !== id));
      if (this.selectedId() === id) this.newDocument();
    });
  }

  // Notas: no viven en el calendario, así que cualquier nota nueva de esta página va a "hoy"
  addQuickNote() {
    const today = new Date().toISOString().slice(0, 10);
    this.notesSvc.openNoteModal(today, this.projectId());
  }

  openNote(date: string) {
    this.notesSvc.openNoteModal(date, this.projectId());
  }

  fileLabel(mime?: string): string {
    if (!mime) return 'ARCHIVO';
    if (mime.includes('word')) return 'WORD';
    if (mime.includes('sheet') || mime.includes('excel')) return 'EXCEL';
    if (mime.includes('pdf')) return 'PDF';
    return 'ARCHIVO';
  }
}
