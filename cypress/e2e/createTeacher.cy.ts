describe("Creación de Docente", () => {
  beforeEach(() => {
    cy.loginAsHeadOfDepartment();
  });

  it("Se debe crear un docente correctamente", () => {
    cy.fixture("teachers").then(({ validTeacher }) => {
      cy.createTeacher(validTeacher);
      
      cy.contains('Docente Creado!', { timeout: 15000 }).should('be.visible');
      
      // cerrar mensaje de exito y formulario
      cy.get('body').type('{esc}');
      cy.get('body').type('{esc}');
      cy.get('body').type('{esc}');

      cy.wait(3000); //esperar para actualizacion de tabla

      cy.searchTeacher(validTeacher.code);
    });
  });
});

describe("Validaciones", () => {
  beforeEach(() => {
    cy.loginAsHeadOfDepartment();
    cy.get('[data-testid="SupervisorAccountIcon"]').should('be.visible').click();

    cy.contains('Agregar docente').should('be.visible').click();
  });

  it("Debe mostrar errores para todos los campos requeridos al guardar sin llenar nada", () => {
    cy.fixture("teachers").then(({ validationMessages }) => {
      cy.contains('button', 'GUARDAR').click();

      // Verificar todos los mensajes de campos requeridos
      const requiredFields = [
        { label: 'Nombres', message: validationMessages.requiredName },
        { label: 'Apellido Paterno', message: validationMessages.requiredPaternalSurname },
        { label: 'Apellido Materno', message: validationMessages.requiredMaternalSurname },
        { label: 'Codigo de Docente', message: validationMessages.requiredCode },
        { label: 'Título Académico', message: validationMessages.requiredTitle },
        { label: 'Correo Electrónico', message: validationMessages.requiredEmail },
        { label: 'Número de Teléfono', message: validationMessages.requiredPhone }
      ];

      requiredFields.forEach(field => {
        cy.contains('label', field.label)
          .siblings('.MuiFormHelperText-root')
          .should('contain', field.message);
      });
    });
  });

  it("Debe mostrar errores para todos los campos con datos inválidos", () => {
    cy.fixture("teachers").then(({ invalidTeacher, validationMessages }) => {
      // Llenar todos los campos con datos inválidos
      cy.get('input[name="name"]').type(invalidTeacher.invalidName);
      cy.get('input[name="lastname"]').type(invalidTeacher.invalidPaternalSurname);
      cy.get('input[name="mothername"]').type(invalidTeacher.invalidMaternalSurname);
      cy.get('input[name="code"]').type(invalidTeacher.invalidCode);
      cy.get('input[name="email"]').type(invalidTeacher.invalidEmail);
      cy.get('input[name="phone"]').type(invalidTeacher.invalidPhone);

      cy.contains('button', 'GUARDAR').click();

      // Verificar todos los mensajes de formato inválido
      const invalidFields = [
        { label: 'Nombres', message: validationMessages.onlyLettersName },
        { label: 'Apellido Paterno', message: validationMessages.onlyLettersPaternal },
        { label: 'Apellido Materno', message: validationMessages.onlyLettersMaternal },
        { label: 'Correo Electrónico', message: validationMessages.invalidEmailFormat },
        { label: 'Número de Teléfono', message: validationMessages.invalidPhoneLength }
      ];

      invalidFields.forEach(field => {
        cy.contains('label', field.label)
          .siblings('.MuiFormHelperText-root')
          .should('contain', field.message);
      });
    });
  });
});
