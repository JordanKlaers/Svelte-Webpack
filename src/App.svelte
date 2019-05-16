<script>
	export let name;
	//loading just a simple file adds about 2/3 kb size to the bundle
	//in the network tab it shows 4kb for the call to this file
	// import Red from './components/colors/Red';

	//loading a file that contains a background-image adds 3/5kb to the bundle
	//in the network tab it shows 5.5kb for the component and a 1.2Mb call for the imgae
	// import Green from './components/colors/Green';
	let colors = ['Red', 'Orange', 'Yellow', 'LimeGreen', 'Green', 'Turquoise', 'Blue', 'Purple', 'Pink', ];
	let number = 0;
	let component = null;
	let toggle = true;
	document.addEventListener('click', () => {
		number = ~~(Math.random() * 9);
		console.log(`./components/colors/${colors[number]}`, colors[number]);
		let fileString = toggle ? 'Red' : 'Green';
		toggle = !toggle;
		import(`./components/colors/${fileString}`).then(file => {
			component = file.default;
		})
	})
</script>


<div class="text">Goodnight moon</div>
<svelte:component this={component}></svelte:component>

<style type="text/scss" lang="scss">
@import './assets/styles/test.scss';
$color: pink;
.text {
	border: 5px solid $color;
}
</style>