if Rails.env == 'production'
  uri = URI.parse(ENV["REDISTOGO_URL"])
  Resque.redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
end

Rails.application.config.autoload_paths += Dir[File.join(Rails.root, "lib", "redis.rb")].each {|l| require l }
