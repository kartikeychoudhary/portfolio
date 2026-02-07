import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';

/**
 * Developer Board Component
 *
 * Code editor mockup displaying developer information with:
 * - Window controls (macOS style)
 * - Line numbers with Monaco font
 * - Syntax highlighting
 * - Staggered entrance animations
 * - Rotating gradient background
 * - SpotlightCard effect
 */
@Component({
  selector: 'app-developer-board',
  standalone: false,
  templateUrl: './developer-board.component.html',
  styleUrls: ['./developer-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeveloperBoardComponent implements OnInit {
  @Input() profile: any;

  codeLines: string[] = [];

  ngOnInit(): void {
    this.generateCodeLines();
  }

  /**
   * Generate code lines from profile data.
   */
  private generateCodeLines(): void {
    const name = this.profile?.fullName || 'Developer';
    const role = this.profile?.title || 'Full Stack Developer';
    const tagline = this.profile?.tagline || 'Building innovative solutions';

    this.codeLines = [
      'const developer = {',
      `  name: "${name}",`,
      `  role: "${role}",`,
      `  tagline: "${tagline}",`,
      '  passion: "Building innovative solutions",',
      '  skills: ["Angular", "React", "Node.js"],',
      '  available: true',
      '};',
      '',
      'export default developer;'
    ];
  }

  /**
   * Apply syntax highlighting to a line of code.
   * Order matters: strings first, then keywords, then properties, etc.
   */
  highlightSyntax(line: string): string {
    // Use a placeholder system to prevent nested replacements
    let result = line;
    const placeholders: { [key: string]: string } = {};
    let placeholderIndex = 0;

    // 1. Protect strings first (so keywords inside strings aren't highlighted)
    result = result.replace(/(['"][^'"]*['"])/g, (match) => {
      const placeholder = `__STRING_${placeholderIndex++}__`;
      placeholders[placeholder] = `<span class="string">${match}</span>`;
      return placeholder;
    });

    // 2. Keywords (const, export, etc.)
    result = result.replace(/\b(const|let|var|export|default|import|from)\b/g, '<span class="keyword">$1</span>');

    // 3. Booleans and primitives
    result = result.replace(/\b(true|false|null|undefined)\b/g, '<span class="boolean">$1</span>');

    // 4. Properties (word followed by colon)
    result = result.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '<span class="property">$1</span>:');

    // 5. Brackets and braces
    result = result.replace(/([{}[\]()])/g, '<span class="bracket">$1</span>');

    // 6. Restore string placeholders
    Object.keys(placeholders).forEach(placeholder => {
      result = result.replace(placeholder, placeholders[placeholder]);
    });

    return result;
  }
}
