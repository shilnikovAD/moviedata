describe('Movie Catalog E2E Tests', () => {
  beforeEach(() => {
    // Перехватываем популярные фильмы и поиск
    cy.intercept('GET', '**/movie/popular**', { fixture: 'popular.json' }).as('getPopular');
    cy.intercept('GET', '**/search/movie**', { fixture: 'search_inception.json' });

    cy.visit('/');
    cy.wait('@getPopular');
  });

  it('should load the home page', () => {
    cy.contains('Discover Movies').should('be.visible');
    cy.contains('MovieCatalog').should('be.visible');
  });

  it('should navigate to About page', () => {
    cy.contains('About').click();
    cy.url().should('include', '/about');
    cy.contains('About MovieCatalog').should('be.visible');
  });

  it('should navigate to Favorites page', () => {
    cy.contains('Favorites').click();
    cy.url().should('include', '/favorites');
    cy.contains('My Favorites').should('be.visible');
  });

  it('should show search bar', () => {
    cy.get('input[placeholder="Search for movies..."]').should('be.visible');
  });

  it('should enable search button when typing', () => {
    cy.get('input[placeholder="Search for movies..."]').type('Inception');
    cy.contains('button', 'Search').should('not.be.disabled');
  });
});
