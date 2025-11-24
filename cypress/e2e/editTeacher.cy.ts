describe("Edición de Docente", () => {
  beforeEach(() => {
    cy.loginAsHeadOfDepartment();
  });

  it("Debe editar un docente existente correctamente", () => {
    cy.fixture("teachers").then(({ updatedTeacher }) => {
      cy.searchAndEditTeacher(updatedTeacher.code, updatedTeacher);

      cy.contains("Docente actualizado con éxito", { timeout: 10000 })
        .should("be.visible");
      
      cy.get('body').type('{esc}');
      cy.searchTeacher(updatedTeacher.code).then(($row) => {
        // verificar datos
        cy.wrap($row).should('contain', updatedTeacher.code);
        cy.wrap($row).should('contain', updatedTeacher.degree);
        cy.wrap($row).should('contain', updatedTeacher.name);
        cy.wrap($row).should('contain', updatedTeacher.lastname);
        cy.wrap($row).should('contain', updatedTeacher.phone);
      });
    });
  });
});

describe("Validaciones de Edición", () => {
  const teacherCode = '83921'; 

  beforeEach(() => {
    cy.loginAsHeadOfDepartment();
    cy.get('[data-testid="SupervisorAccountIcon"]').click();
    
    cy.searchTeacher(teacherCode).within(() => {
      cy.get('[data-testid="EditIcon"]').click({ force: true });
    },);
    
    cy.get('form').should('be.visible');
  });

  it("Debe mostrar errores para todos los campos requeridos al guardar sin llenar nada", () => {
    cy.fixture("teachers").then(({ validationMessages }) => {
      // Limpiar todos los campos editables
      cy.get('input[name="name"]').clear();
      cy.get('input[name="lastname"]').clear();
      cy.get('input[name="mothername"]').clear();
      cy.get('input[name="code"]').clear();
      cy.get('input[name="email"]').clear();
      cy.get('input[name="phone"]').clear();
      cy.get('#degree').click();
      cy.get('li[data-value=""]').click({ force: true });
      
      cy.contains('button', 'GUARDAR').click();

      // Verificar todos los mensajes de campos requeridos
      const requiredFields = [
        { label: 'Nombres', message: validationMessages.requiredName },
        { label: 'Apellido Paterno', message: validationMessages.requiredPaternalSurname },
        { label: 'Apellido Materno', message: validationMessages.requiredMaternalSurname },
        { label: 'Codigo de Docente', message: validationMessages.requiredCode },
        { label: 'Título Académico', message: validationMessages.requiredTitle },
        { label: 'Correo Electrónico', message: validationMessages.requiredEmail },
        { label: 'Número de Teléfono', message: validationMessages.obligatoryPhone }
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
      cy.get('input[name="name"]').clear().type(invalidTeacher.invalidName);
      cy.get('input[name="lastname"]').clear().type(invalidTeacher.invalidPaternalSurname);
      cy.get('input[name="mothername"]').clear().type(invalidTeacher.invalidMaternalSurname);
      cy.get('input[name="code"]').clear().type(invalidTeacher.invalidCode);
      cy.get('input[name="email"]').clear().type(invalidTeacher.invalidEmail);
      cy.get('input[name="phone"]').clear().type(invalidTeacher.invalidPhone);

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
