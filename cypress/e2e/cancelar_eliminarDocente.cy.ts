describe('Login test', () => {
  it('should log in successfully', () => {
    cy.visit('http://localhost:5173');

    cy.get('[data-test-id="email-login"]').type('alexismarechal@upb.edu');
    cy.get('[data-test-id="password-login"]').type('123456');
    cy.get('[data-test-id="login-button"]').click(); 

    cy.url().should('include', '/dashboard'); 

    cy.contains('Docentes').click();

    cy.contains('Lista de docentes');

    cy.get('.MuiDataGrid-virtualScroller')
      .scrollTo('right', { duration: 300 });

    cy.get('.MuiDataGrid-row--firstVisible')
  .find('[data-testid="DeleteIcon"]')
  .click();

    cy.contains('Cancelar').click();

    cy.contains('77586').should('exist');
  });
});
