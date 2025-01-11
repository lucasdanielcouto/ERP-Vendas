import 'cypress-xpath';


describe('Criar cadastro de cliente', () => {
  
  const cadastro = {
    street: 'Rua teste',
    street2: 'Rua dois',
    complemento: 'Qd 20 lote 02',
    Neighborhood: 'Jd. Ocidental',
    Cidade: 'Belo Horizonte',
    State: 'Minas Gerais (BR)',
    ZIP: '30110-001',
    País: 'Brasil',

    Identification:'CNPJ',
    Number:'12.345.678/0001-23',

    CodigoIe:'12345678',
    CodigoIm:'87654321',
    CodigoSuframa:'987654',

    Telefone:'+55 31 3333-4444',
    Celular:'+55 31 98888-7777',
    Email:'exemplo@email.com',
    Site:'https://www.siteexemplo.com.br',

    Marcador1: 'B2B',
    Marcador2: 'VIP',
    Marcador3: 'Consultoria'
   };

  let nomeGerado;
  let cnpjValido;

  function gerarCNPJ() {
    const random = (n) => Math.floor(Math.random() * n);
    const n = Array.from({ length: 8 }, () => random(10)).concat([0, 0, 0, 1]);

    const calcDV = (base) => {
      let soma = 0;
      let pos = base.length - 7;
      for (let i = 0; i < base.length; i++) {
        soma += base[i] * pos--;
        if (pos < 2) pos = 9;
      }
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const dv1 = calcDV(n);
    const dv2 = calcDV([...n, dv1]);

    return [...n, dv1, dv2].join('');
  }



    beforeEach(() => {
      
      cy.session('usuario-logado', () => {
      cy.visit('https://qualityld.odoo.com/odoo/sales'); // URL da página de login
    
      // Campo de usuário
      cy.xpath('//*[@id="login"]').type('lucasdanielcouto97@gmail.com'); 
      
      // Campo de senha
      cy.xpath('//*[@id="password"]').type('Lucasmonk125.');
      
      // Botão de login
      cy.xpath('//*[@id="wrapwrap"]/main/div[1]/form/div[3]/button').click();
    });
    });
  
  
    it('Deve acessar módulo de vendas e utilizar a função Criar novo cliente', () => {
      const now = new Date();
      nomeGerado = `Cliente ${now.getDate()}${now.getMonth() + 1} ${now.getHours()}${now.getMinutes()}`;
      cnpjValido = gerarCNPJ();//Gerar cnpj valido

      cy.writeFile('cypress/fixtures/dadosGerados.json', { nome: nomeGerado, cnpj: cnpjValido }); //Guardar o cnpj no arquivo
      

      cy.visit('https://qualityld.odoo.com/odoo/sales').wait(2500);
      cy.get('[data-hotkey="1"] > span').click(); //menu suspenso Pedidos
      cy.get('[href="/odoo/customers"]').click().wait(3000); //clicar em Clientes
      cy.get('.o_control_panel_main_buttons > .d-inline-flex > .btn').click(); //clicar em novo cliente
      cy.get('h1 > .o_field_widget > .o-autocomplete > .o-autocomplete--input').type(nomeGerado)//Inserir no campo  nome do cliente o nome gerado 
      

      cy.get('#street_name_0').type(cadastro.street); //rua 1
      cy.get('#street_number_0').type(cadastro.street2);  //rua 2
      cy.get('#street_number2_0').type(cadastro.complemento); //complemento
      cy.get('#street2_0').type(cadastro.Neighborhood); //neighborhood(bairro)
      cy.get('#city_0').type(cadastro.Cidade); //cidade
      cy.get('#state_id_0').type(`${cadastro.State}`).wait(1000).type('{enter}'); //estado (existe seletor)
      cy.get('#zip_0').type(cadastro.ZIP); //preenche zip (cep)
      cy.get('#country_id_0') .type(`${cadastro.País}`).wait(1000).type('{enter}'); //Brasil (existe seletor)
      
      cy.get('#l10n_latam_identification_type_id_0').type(`${cadastro.Identification}`).wait(1000).type('{enter}'); //escolhe tipo de documento, neste caso CNPJ(seletor)
      cy.get('[name="vat_vies_container"] > .o_field_field_partner_autocomplete > .o-autocomplete > .o-autocomplete--input').type(cnpjValido); //digita o CNPJ ficiticio
      cy.get('#l10n_br_ie_code_0').type(cadastro.CodigoIe);//codigo IE
      cy.get('#l10n_br_im_code_0').type(cadastro.CodigoIm); //codigo IM
      cy.get('#l10n_br_isuf_code_0').type(cadastro.CodigoSuframa); //codigo Suframa

      cy.get('#phone_0').type(cadastro.Telefone, {force : true});//telefone
      cy.get('#mobile_0').type(cadastro.Celular);// celular
      cy.get('#email_0').type(cadastro.Email); //email
      cy.get('#website_0').type(cadastro.Site); //site

      cy.get('#category_id_0').type(`${cadastro.Marcador1}`).wait(2000).type('{enter}').type(`${cadastro.Marcador2}`).wait(2000).type('{enter}').type(`${cadastro.Marcador3}`).wait(2000).type('{enter}');
        

      cy.get(':nth-child(2) > .nav-link').click(); //Ir na aba Vendas e Compras

      cy.get('#user_id_0').type('vendedor').wait(600).type('{enter}');
      cy.get('#property_payment_term_id_0').type('15 dias').wait(600).type('{enter}');
      cy.get('#property_inbound_payment_method_line_id_0').type('manual payment').wait(500).type('{enter}');
      cy.get('#property_delivery_carrier_id_0').type('entrega padrão').wait(500).type('{enter}');


      cy.get('.d-inline-flex > .btn').click({force: true});//clicar em salvar cadastro de cliente 
      cy.wait(3000)
     
    });



  it('Verificar o cadastro salvo e verificar se os dados foram salvos corretamente', () => {
    cy.fixture('dadosGerados.json').then((dados) => {
      const { nome, cnpj } = dados;

      cy.visit('https://qualityld.odoo.com/odoo/customers'); //ir para tela de clientes

      cy.get('.o_searchview_input').type(`${nome}`).wait(1000).type('{enter}'); //Pesquisar cliente criado 
      cy.wait(3500);
      cy.get('[data-id^="datapoint_"]').first().click(); //clicar no primeiro cadastro encontrado

      // Verificar todos os campos preenchidos
    cy.get('#street_name_0').should('have.value', cadastro.street);
    cy.get('#street_number_0').should('have.value', cadastro.street2);
    cy.get('#street_number2_0').should('have.value', cadastro.complemento);
    cy.get('#street2_0').should('have.value', cadastro.Neighborhood);
    cy.get('#city_0').should('have.value', cadastro.Cidade);
    cy.get('#state_id_0').should('have.value', cadastro.State);
    cy.get('#zip_0').should('have.value', cadastro.ZIP);
    cy.get('#country_id_0').should('have.value', cadastro.País);
    cy.get('#l10n_latam_identification_type_id_0').should('have.value', cadastro.Identification);
    cy.get('[name="vat_vies_container"] > .o_field_field_partner_autocomplete > .o-autocomplete > .o-autocomplete--input').should('have.value', cnpj);
    cy.get('#l10n_br_ie_code_0').should('have.value', cadastro.CodigoIe);
    cy.get('#l10n_br_im_code_0').should('have.value', cadastro.CodigoIm)
    cy.get('#l10n_br_isuf_code_0').should('have.value', cadastro.CodigoSuframa);
    cy.get('#phone_0').should('have.value', cadastro.Telefone);
    cy.get('#mobile_0').should('have.value', cadastro.Celular);
    cy.get('#email_0').should('have.value', cadastro.Email);
    cy.get('#website_0').should('have.value', cadastro.Site);

    //Aba Vendas e Compras
    cy.get(':nth-child(2) > .nav-link').click(); //Ir na aba Vendas e Compras


    cy.get('#user_id_0').should('have.value', 'Vendedor');
    cy.get('#property_payment_term_id_0').should('have.value', '15 dias');
    cy.get('#property_inbound_payment_method_line_id_0').should('have.value', 'Manual Payment (Banco)');
    cy.get('#property_delivery_carrier_id_0').should('have.value', 'Entrega padrão')

 
    });
  });























  });