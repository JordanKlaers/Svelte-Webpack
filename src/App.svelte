


<div class="text">Goodnight moon</div>

<script>
//when using node sass in the webpack to process this scss syntax within this component fails.
//just importing a scss file works for cypres unit test, althought styles that include scss syntax are not applied in the test
</script>

<style type="text/scss">
@import './assets/styles/test.scss';
$color: red;
.text {
	border: 2px solid $color;
}
</style>