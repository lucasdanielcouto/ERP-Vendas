// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
import 'cypress-xpath';

// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
Cypress.Commands.add('login', (username, password) => {
    cy.visit('https://qualityld.odoo.com/odoo/sales'); // URL da página de login
    
    // Campo de usuário
    cy.xpath('//*[@id="login"]').type('lucasdanielcouto97@gmail.com'); 
    
    // Campo de senha
    cy.xpath('//*[@id="password"]').type('Lucasmonk125.');
    
    // Botão de login
    cy.xpath('//*[@id="wrapwrap"]/main/div[1]/form/div[3]/button').click();
  });
  
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })