<div id="signIn">
	<a id="checking-button" ng-show="isState('checking')" class="btn" href="" data-icon3="r"><span>Authorizing...</span></a>

	<a id="authorize-button" ng-style="{
		'display' : isState('sign') ? 'block' : 'none'
	}" class="btn" href="" data-icon3="r">

		<p>Your cloud desktop is integrated with Google APIs, please</p>
		<span>Sign In With Google+</span>
	</a>
	<div class="bg"></div>
</div>