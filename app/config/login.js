const Store = require('electron-store');

const schema = {
	user: {
		type: 'string',
		maximum: 100,
		minimum: 2,
		default: "guest user"
	},
    email: {
		type: 'string',
		maximum: 100,
		minimum: 2,
		default: "guest"
	},
    password: {
		type: 'string',
		maximum: 100,
		minimum: 2
		 
	},
	 
};

const store = new Store({schema});

 