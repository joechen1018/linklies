<style>
.result span{
	padding-left : 10px;
	font-size : 12px;
	color : #666;
}
</style>
<p class="result" ng-repeat="rs in results" bindonce>
	<a bo-href="rs.href" bo-text="rs.title"></a>
	<span bo-text="rs.date"></span>
</p>