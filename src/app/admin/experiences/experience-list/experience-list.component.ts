import { Component, inject } from '@angular/core';
import { CrudPageComponent } from '../../../shared/crud-page/crud-page.component';
import { experienceColumns, experienceFields } from '../experience-fields';
import { ExperienceService } from '../experience.service';

@Component({
  selector: 'app-experience-list',
  standalone: true,
  imports: [CrudPageComponent],
  templateUrl: './experience-list.component.html'
})
export class ExperienceListComponent {
  experiences = inject(ExperienceService);
  fields = experienceFields;
  columns = experienceColumns;
}
