import fetch from 'node-fetch';
let example = 3;

// Kolejność wykonywania
if ( example == 1 ) {

	console.log('Wykonano jako: 1');

	setTimeout(_ => console.log('Wykonano jako: 4'), 0);

	Promise.resolve().then(_ => console.log('Wykonano jako: 3'));

	console.log('Wykonano jako: 2');

}

// Podstawowe użycie Try and Catch
else if ( example == 2 ) {
	const promise = fetch('https://jsonplaceholder.typicode.com/todos/1'); 

	// Zwykłe użycie
	promise
		.then(res => console.log(res.json()))
		.then(user => console.log(user.title));

	// Error handling
	promise
		.then(res => res.json())
		.then(user => {
			throw new Error('Uh oh'); // Od razu przechodzi do catch
			return user;
		})
		.then(user => console.log('😁',user.title))
		.catch(err => console.error('😱',err));
}

// Nie blokowanie kodu
else if ( example == 3 ) {
	const tick = Date.now();
	const log = (v) => console.log(`${v} \n Upłyneło: ${Date.now() - tick}ms`);

	const codeBlocker = () => {
		//// Zwykły blokujący skrypt

		// let i = 0;
		// while(i < 1000000000) { i++; }
		// return 'Blokowanie zakończone';

		//// Ten skrypt również będzie blokował main thread
		// return new Promise((resolve, reject) => {
		// 	let i = 0;
		// 	while(i < 1000000000) { i++; }
		// 	resolve('Blokowanie zakończone');
		// })

		// Ten skrypt wykona się jako ostatni
		return Promise.resolve().then(v => {
			let i = 0;
			while(i < 1000000000) { i++; }
			log('🕑Blokowanie zakończone');
			// return 'Blokowanie zakończone';
		})
	}

	log('👉Checkpoint 1');

	log(codeBlocker());

	log('👉Checkpoint 2');
}

else if ( example == 4 ) {

	const getFruit = async(name) => {
		const fruits = {
			apple: '🍎',
			orange: '🍊',
			banana: '🍌'
		}

		return fruits[name];
	}

	// Samo zwracanie
	// getFruit('apple').then(console.log);

	// Bez await
	const makeSmoothiePure = () => {
		let a;
		return getFruit('apple')
			.then(v => {
				a = v;
				return getFruit('orange');
			})
			.then(v => [v, a]);
	}
	
	// Z await
	// const makeSmoothie = async() => {
	// 	const a = await getFruit('apple');
	// 	const b = await getFruit('orange');
		
	// 	return [a, b];
	// }

	// Powyzszy kod możemy też napisać tak - wtedy zamiast czekac na wykonanie sie kazdego promisa zwracamy wszystkie w tym samym momencie
	const makeSmoothie = async() => {
		const a = getFruit('apple');
		const b = getFruit('orange');
		const smoothie = Promise.all([a, b]);
		
		return smoothie;
	}
	
	makeSmoothie().then(console.log);

	const badSmoothie = async() => {
		try {
			const a = await getFruit('apple');

			throw 'broken!';

			return a;
		} catch(err) {
			console.log(err);
			return 'It is broken!';
		}
	}

	badSmoothie()
		.then(val => console.log({ val }))
		.catch(err => console.log({ err }));
}