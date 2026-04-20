Preciso realizar testes na minha aplicação com o Playwright. Para isso, segue o contexto:


1. Acesse a aplicação: https://homolog-credaluga.siscobra.com.br/servlet/hsiscobra
2. Faça login com o usuário 9953 e a senha Teste@123!asdA1.
3. Após o login, acesse a tela "Pesquisa" pelo menu lateral esquerdo: Acionamento > Pesquisar.
4. Na tela de pesquisa, preencha o campo "CPF/CNPJ" com o valor 47406932839.
5. Clique no botão "Pesquisar".
6. Nos resultados da pesquisa, clique no código do cliente exibido para acessar a ficha do cliente.
7. Na ficha do cliente, clique na aba "Emails".
8. Clique no botão "Adicionar", identificado pelo símbolo "+", para abrir o formulário de cadastro de email.
9. No campo "Tipo", selecione o tipo de email "Pesquisa".
10. Preencha o campo "Email" com o valor teste@playwright.com.
11. Clique no botão "Confirmar" para salvar o email cadastrado.
12. Após salvar, verifique se o email foi adicionado corretamente à lista de emails do cliente, confirmando que teste@playwright.com está presente na lista.
13. Volte para a tela de dívida do cliente clicando no menu central "Contratos (X)".