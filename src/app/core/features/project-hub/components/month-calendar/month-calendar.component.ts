import { Component, input, inject, signal, computed, output } from '@angular/core';
import { Project } from '../../../../models/project.model';
import { ProjectNotesService } from '../../../../services/ui/project-notes.service';


interface DayCell {
  date: Date;
  iso: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
}
interface BarSegment {
  id: string;
  projectId: string;
  projectName: string;
  startCol: number;
  endCol: number;
  lane: number;
  accent: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
}
interface NoteChip {
  id: string;
  projectId: string;
  col: number;
  preview: string;
}

const MAX_LANES = 3;

@Component({
  selector: 'app-month-calendar',
  templateUrl: './month-calendar.component.html',
  styleUrl: './month-calendar.component.css',
})
export class MonthCalendarComponent {
  private notesSvc = inject(ProjectNotesService);
  projects = input.required<Project[]>();
  projectSelected = output<string>();

  readonly MAX_LANES = MAX_LANES;

  viewDate = signal(this.startOfMonth(new Date()));

  private startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  monthLabel = computed(() =>
    this.viewDate().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }),
  );

  // Semanas completas (domingo→sábado) que tocan el mes visible
  weeks = computed<DayCell[][]>(() => {
    const view = this.viewDate();
    const monthStart = this.startOfMonth(view);
    const monthEnd = new Date(view.getFullYear(), view.getMonth() + 1, 0);
    const today = new Date();

    const gridStart = new Date(monthStart);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay()); // retrocede al domingo

    const gridEnd = new Date(monthEnd);
    gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay())); // avanza al sábado

    const cells: DayCell[] = [];
    for (let d = new Date(gridStart); d <= gridEnd; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      cells.push({
        date,
        iso: this.toISO(date),
        day: date.getDate(),
        inMonth: date.getMonth() === view.getMonth(),
        isToday: this.sameDay(date, today),
      });
    }

    const weeks: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  });

  private toISO(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  private sameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  prevMonth() {
    this.viewDate.update((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  nextMonth() {
    this.viewDate.update((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  // Segmentos de barra por semana, con asignación de "lanes" para que las que se traslapan no se pisen
  segmentsFor(weekIndex: number): BarSegment[] {
    const week = this.weeks()[weekIndex];
    const weekStart = week[0].date;
    const weekEnd = week[6].date;

    const raw = this.projects()
      .map((p, i) => {
        const start = new Date(p.startDate + 'T00:00:00');
        const end = new Date(p.endDate + 'T00:00:00');
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
        if (end < weekStart || start > weekEnd) return null;

        const startCol = start < weekStart ? 0 : start.getDay();
        const endCol = end > weekEnd ? 6 : end.getDay();

        return {
          id: p.id + '-' + weekIndex,
          projectId: p.id,
          projectName: p.name,
          startCol,
          endCol,
          accent: i % 3,
          continuesBefore: start < weekStart,
          continuesAfter: end > weekEnd,
        };
      })
      .filter((s): s is Omit<BarSegment, 'lane'> => s !== null)
      .sort((a, b) => a.startCol - b.startCol);

    const laneEnds: number[] = [];
    const withLanes: BarSegment[] = [];
    for (const seg of raw) {
      let lane = laneEnds.findIndex((end) => end < seg.startCol);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(seg.endCol);
      } else {
        laneEnds[lane] = seg.endCol;
      }
      withLanes.push({ ...seg, lane });
    }

    return withLanes.filter((s) => s.lane < MAX_LANES);
  }

  overflowFor(weekIndex: number): number {
    const week = this.weeks()[weekIndex];
    const weekStart = week[0].date;
    const weekEnd = week[6].date;
    const total = this.projects().filter((p) => {
      const start = new Date(p.startDate + 'T00:00:00');
      const end = new Date(p.endDate + 'T00:00:00');
      return (
        !isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= weekStart && start <= weekEnd
      );
    }).length;
    return Math.max(0, total - MAX_LANES);
  }

  notesFor(weekIndex: number): NoteChip[] {
    const week = this.weeks()[weekIndex];
    const isoSet = new Map(week.map((c, i) => [c.iso, i]));
    return this.notesSvc
      .notes()
      .filter((n) => isoSet.has(n.date))
      .map((n) => ({
        id: n.id,
        projectId: n.projectId,
        col: isoSet.get(n.date)!,
        preview: this.stripMarkdown(n.content).slice(0, 22),
      }));
  }

  openNote(note: NoteChip) {
    this.notesSvc.openNoteModal(
      this.notesSvc.notes().find((n) => n.id === note.id)!.date,
      note.projectId,
    );
  }

  private stripMarkdown(content: string): string {
    return content
      .replace(/^#{1,3}\s+/gm, '')
      .replace(/[*_`>[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim();
  }
}
