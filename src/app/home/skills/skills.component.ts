import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { Skill } from '../../admin/skills/skill';
import { SkillService } from '../../admin/skills/skill.service';

interface SkillGroup {
  category: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements OnInit {
  private skillService = inject(SkillService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  groups: SkillGroup[] | null = null;
  error = '';

  ngOnInit(): void {
    // Load in the browser so visitors always see the latest version.
    if (this.isBrowser) {
      this.skillService.listPublic().subscribe({
        next: skills => this.groups = this.groupByCategory(skills),
        error: () => this.error = 'Couldn’t load skills. Refresh the page to try again.'
      });
    }
  }

  // The backend already sorts by category, so a new group starts whenever the category changes.
  private groupByCategory(skills: Skill[]): SkillGroup[] {
    const groups: SkillGroup[] = [];
    for (const skill of skills) {
      const last = groups[groups.length - 1];
      if (last && last.category === skill.category) {
        last.skills.push(skill);
      } else {
        groups.push({ category: skill.category, skills: [skill] });
      }
    }
    return groups;
  }
}
