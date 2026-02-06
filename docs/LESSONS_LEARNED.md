# Lessons Learned

This document tracks mistakes encountered during development and the rules to prevent them.

---

## Lesson #1 — 2026-02-06
- **Step:** Phase 2.2 — Creating core service tests
- **Error:** `TS2503: Cannot find namespace 'jasmine'` and `TS2349: This expression is not callable. Type 'TestContext' has no call signatures.`
- **Root Cause:** Angular 21 uses Vitest instead of Karma/Jasmine. `jasmine.createSpyObj` and `jasmine.SpyObj` types don't exist. The `done` callback in Vitest has a different type (`TestContext`).
- **Fix:** Replaced `jasmine.createSpyObj` with `vi.fn()` from Vitest. Replaced `done()` callback pattern with `return new Promise<void>((resolve) => { ... })`.
- **Prevention Rule:** ALWAYS use `vi.fn()`, `vi.spyOn()` and `mockReturnValue()` instead of Jasmine spies in Angular 21+ projects. Use Promise-based async patterns instead of `done()` callbacks.

## Lesson #2 — 2026-02-06
- **Step:** Phase 3.1 — Creating shared component tests
- **Error:** `NG0303: Can't bind to 'icon' since it isn't a known property of 'p-button'` and `expected 'Loading...' to contain 'Please wait...'`
- **Root Cause:** (1) PrimeNG components need to be either imported or schemas set to NO_ERRORS_SCHEMA in tests. (2) Components with OnPush change detection don't detect changes when inputs are set directly on the component instance.
- **Fix:** (1) Used `schemas: [NO_ERRORS_SCHEMA]` in TestBed config. (2) Used `fixture.componentRef.setInput()` instead of direct assignment for OnPush components.
- **Prevention Rule:** ALWAYS use `NO_ERRORS_SCHEMA` when testing components that use PrimeNG elements. ALWAYS use `fixture.componentRef.setInput()` to set inputs on OnPush components in tests.

## Lesson #3 — 2026-02-06
- **Step:** Phase 6 — Building Blog feature module
- **Error:** `TS2551: Property 'setMetaDescription' does not exist on type 'SeoService'. Did you mean 'setDescription'?`
- **Root Cause:** SeoService method was named `setDescription()` but was called as `setMetaDescription()` in the blog components.
- **Fix:** Changed all calls to `seoService.setDescription()` to match the actual SeoService API.
- **Prevention Rule:** ALWAYS check the actual service method signatures before calling them. Read the source service file to verify method names.

## Lesson #4 — 2026-02-06
- **Step:** Phase 7 — Building Admin feature module with AG Grid and Chart.js
- **Error:** AG Grid (`AgGridAngular`) and ng2-charts (`BaseChartDirective`) are standalone components/directives.
- **Root Cause:** In Angular 21, AG Grid and ng2-charts export standalone entities that must be added to the NgModule `imports` array, not `declarations`.
- **Fix:** Added `AgGridAngular` and `BaseChartDirective` to the `imports` array of `AdminModule`.
- **Prevention Rule:** When using third-party standalone components/directives in an NgModule-based project, always add them to `imports`, never to `declarations`.
