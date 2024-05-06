describe('My First Test', () => {
	it('Visits the initial project page', () => {
		cy.login();
		cy.visit('/home');
		cy.visit('/home/profile');
		cy.contains('Login');
	});
});
