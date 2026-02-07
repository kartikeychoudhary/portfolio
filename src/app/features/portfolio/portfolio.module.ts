import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PortfolioRoutingModule } from './portfolio-routing.module';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';

import { PortfolioPageComponent } from './pages/portfolio-page/portfolio-page.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { SocialLinksComponent } from './components/social-links/social-links.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { SkillCardComponent } from './components/skill-card/skill-card.component';
import { ExperienceSectionComponent } from './components/experience-section/experience-section.component';
import { ExperienceTimelineComponent } from './components/experience-timeline/experience-timeline.component';
import { ProjectsSectionComponent } from './components/projects-section/projects-section.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';

@NgModule({
  declarations: [
    PortfolioPageComponent,
    HeroSectionComponent,
    SocialLinksComponent,
    SkillsSectionComponent,
    SkillCardComponent,
    ExperienceSectionComponent,
    ExperienceTimelineComponent,
    ProjectsSectionComponent,
    ProjectCardComponent,
    ContactSectionComponent
  ],
  imports: [
    SharedModule,
    PortfolioRoutingModule,
    InputTextModule,
    TextareaModule,
    ProgressBarModule
  ]
})
export class PortfolioModule { }
