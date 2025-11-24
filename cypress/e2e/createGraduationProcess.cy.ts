/// <reference types="cypress" />

describe('Creación de Proceso de Graduación', () => {
  beforeEach(() => {
    cy.loginAsHeadOfDepartment();
  });

  it('Debe crear y verificar proceso de graduación', () => {
    cy.fixture('graduationProcess').then((data) => {
      const { student, process } = data;
      
      // Crear proceso
      cy.createGraduationProcess(student, process);

      cy.get('[data-testid="ChecklistOutlinedIcon"]').click();
      
      // Buscar en tabla
      const formattedPeriod = process.period.replace('-', '');
      cy.searchGraduationProcess(student, process).then(($row) => {
        // Verificar datos específicos
        cy.wrap($row).should('contain', student.name);
        cy.wrap($row).should('contain', formattedPeriod);
      });
    });
  });

  it('Debe manejar error de título existente', () => {
    cy.fixture('graduationProcess').then((data) => {
      const { student2, process } = data;
      
      // Intentar crear con título existente
      cy.handleExistingTitleError(student2, process);
      
      // Cerrar formulario
      cy.get('body').type('{esc}');
      cy.get('[role="dialog"]').should('not.exist');
    });
  });
});

describe('Validaciones de Formulario de Proceso de Graduación', () => {
  beforeEach(() => {
    cy.loginAsHeadOfDepartment();
    
    // Navegar al formulario antes de cada prueba de validación
    cy.get('[data-testid="ChecklistOutlinedIcon"]').click();
    cy.contains('Nuevo Proceso').click();
  });

  it('Debe mostrar errores para campos requeridos', () => {
    cy.fixture('graduationProcess').then((data) => {
      const { invalidData } = data;
      
      // Intentar guardar sin completar ningún campo
      cy.contains('button', 'GUARDAR').click();
      
      // Verificar mensajes de error
      cy.contains('label', 'Nombre Estudiante')
        .siblings('.MuiFormHelperText-root')
        .should('contain', invalidData.requiredFieldError);
        
      cy.contains('label', 'Seleccionar Modalidad')
        .siblings('.MuiFormHelperText-root')
        .should('contain', invalidData.selectModalityError);
        
      cy.contains('label', 'Título de Proyecto')
        .siblings('.MuiFormHelperText-root')
        .should('contain', invalidData.requiredFieldError);
        
      cy.contains('label', 'Seleccionar Período')
        .siblings('.MuiFormHelperText-root')
        .should('contain', invalidData.requiredFieldError);
    });
  });

  it('Debe validar formato del código de estudiante', () => {
    cy.fixture('graduationProcess').then((data) => {
      const { invalidData } = data;
      
      // Probar varios códigos inválidos
      invalidData.invalidCodes.forEach(code => {
        cy.get('input[name="studentCode"]').clear().type(code);
        cy.contains('button', 'GUARDAR').click(); 
        
        cy.contains('label', 'Código Estudiante')
          .siblings('.MuiFormHelperText-root')
          .should('contain', invalidData.numericCodeError);
      });
      
      // Verificar que un código válido no muestra error
      cy.get('input[name="studentCode"]').clear().type('123456');
      cy.contains('button', 'GUARDAR').click();
      cy.contains('label', 'Código Estudiante')
        .siblings('.MuiFormHelperText-root')
        .should('not.exist');
    });
  });

  it('Debe validar longitud mínima del título', () => {
    cy.fixture('graduationProcess').then((data) => {
      const { invalidData } = data;
      
      cy.get('input[name="titleProject"]').clear().type(invalidData.shortTitle);
      cy.contains('button', 'GUARDAR').click(); 
      
      cy.contains('label', 'Título de Proyecto')
        .siblings('.MuiFormHelperText-root')
        .should('contain', invalidData.titleLengthError);
    });
  });

  it('Debe validar formato del título', () => {
    cy.fixture('graduationProcess').then((data) => {
      const { invalidData } = data;
      
      cy.get('input[name="titleProject"]').clear().type(invalidData.invalidTitle);
      cy.contains('button', 'GUARDAR').click(); 
      
      cy.contains('label', 'Título de Proyecto')
        .siblings('.MuiFormHelperText-root')
        .should('contain', invalidData.titleFormatError);
    });
  });
});