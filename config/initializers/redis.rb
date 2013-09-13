if Rails.env.test?
  require_relative '../../spec/support/redis'
  CartoDB::RedisTest.up
end

if Cartodb.config[:redis].blank?
  raise <<-MESSAGE
Please, configure Redis in your config/app_config.yml file like this:
  development:
    ...
    redis:
      host: '127.0.0.1'
      port: 6379
MESSAGE
end

# Redis interfaces definition:
conf = Cartodb.config[:redis].symbolize_keys
redis_conf = conf.select { |k, v| [:host, :port].include?(k) }

default_databases = {
  tables_metadata:     0,
  api_credentials:     3,
  users_metadata:      5,
  redis_migrator_logs: 6
}

databases = conf[:databases] || default_databases

$tables_metadata     = Redis.new(redis_conf.merge(db: databases[:tables_metadata]))
$api_credentials     = Redis.new(redis_conf.merge(db: databases[:api_credentials]))
$users_metadata      = Redis.new(redis_conf.merge(db: databases[:users_metadata]))
$redis_migrator_logs = Redis.new(redis_conf.merge(db: databases[:redis_migrator_logs]))

begin
  $tables_metadata.ping
  $api_credentials.ping
  $users_metadata.ping
  $redis_migrator_logs.ping
rescue => e
  raise "Error connecting to Redis databases: #{e}" 
end
