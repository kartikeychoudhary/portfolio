import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ChartData, ChartOptions } from 'chart.js';

import { ContactDto } from '../../../../core/models/contact.model';
import { BlogDto } from '../../../../core/models/blog.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  contacts: ContactDto[] = [];
  blogs: BlogDto[] = [];
  isLoading = false;

  /** AG Grid column definitions for the contacts table */
  contactColumnDefs: ColDef[] = [
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'email', headerName: 'Email', sortable: true, filter: true },
    { field: 'subject', headerName: 'Subject', sortable: true, filter: true },
    {
      field: 'read',
      headerName: 'Read',
      sortable: true,
      cellRenderer: (params: { value: boolean }) => (params.value ? 'Yes' : 'No'),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      sortable: true,
      valueFormatter: (params: { value: string }) =>
        params.value ? new Date(params.value).toLocaleDateString() : '',
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  /** Chart.js data for blog analytics bar chart */
  blogChartData: ChartData<'bar'> = {
    labels: ['Published', 'Drafts'],
    datasets: [
      {
        label: 'Blog Posts',
        data: [0, 0],
        backgroundColor: ['#4f46e5', '#9ca3af'],
      },
    ],
  };

  blogChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Blog Post Analytics' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  // ── Computed stats ──────────────────────────────────────────

  get totalContacts(): number {
    return this.contacts.length;
  }

  get unreadContacts(): number {
    return this.contacts.filter((c) => !c.read).length;
  }

  get totalBlogs(): number {
    return this.blogs.length;
  }

  get publishedBlogs(): number {
    return this.blogs.filter((b) => b.published).length;
  }

  // ── Lifecycle ───────────────────────────────────────────────

  ngOnInit(): void {
    this.loadData();
  }

  // ── Public methods ──────────────────────────────────────────

  markAsRead(id: string): void {
    this.adminService.markContactRead(id).subscribe({
      next: (updated) => {
        const idx = this.contacts.findIndex((c) => c.id === id);
        if (idx !== -1) {
          this.contacts = [
            ...this.contacts.slice(0, idx),
            updated,
            ...this.contacts.slice(idx + 1),
          ];
        }
        this.cdr.markForCheck();
      },
    });
  }

  // ── Private helpers ─────────────────────────────────────────

  private loadData(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.adminService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });

    this.adminService.getBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.updateChartData();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private updateChartData(): void {
    const published = this.blogs.filter((b) => b.published).length;
    const drafts = this.blogs.filter((b) => !b.published).length;

    this.blogChartData = {
      labels: ['Published', 'Drafts'],
      datasets: [
        {
          label: 'Blog Posts',
          data: [published, drafts],
          backgroundColor: ['#4f46e5', '#9ca3af'],
        },
      ],
    };
  }
}
