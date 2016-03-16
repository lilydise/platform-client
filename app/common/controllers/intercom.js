module.exports = [
    '$scope',
    '$rootScope',
    'UserEndpoint',
    'ConfigEndpoint',
    '$q',
function (
    $scope,
    $rootScope,
    UserEndpoint,
    ConfigEndpoint,
    $q
) {
    $rootScope.$on('event:authentication:login:succeeded', function () {
        $q.all([
            ConfigEndpoint.get({ id: 'site' }).$promise,
            UserEndpoint.getFresh({id: 'me'}).$promise
        ]).then(function (results) {
            var site = results[0];
            var user = results[1];

            window.Intercom('boot', {
                app_id: window.ushahidi.intercomAppId,
                email: user.email,
                created_at: user.created,
                user_id: user.id,
                'company': site.name,
                'deployment_url': window.ushahidi.apiUrl,
                'realname' : user.realname,
                'last_login': user.last_login,
                'role': user.role
            });
        });
    });

    $rootScope.$on('event:authentication:logout:succeeded', function () {
        window.Intercom('shutdown');
    });
}];
