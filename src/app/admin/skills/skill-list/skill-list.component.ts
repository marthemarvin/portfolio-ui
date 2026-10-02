import { Component, inject } from '@angular/core';
import { CrudPageComponent } from '../../../shared/crud-page/crud-page.component';
import { skillColumns, skillFields } from '../skill-fields';
import { SkillService } from '../skill.service';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [CrudPageComponent],
  templateUrl: './skill-list.component.html'
})
export class SkillListComponent {
  skills = inject(SkillService);
  fields = skillFields;
  columns = skillColumns;
}
