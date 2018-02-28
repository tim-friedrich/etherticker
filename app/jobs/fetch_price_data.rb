class FetchPriceData
  @queue = :fetch_data
  def self.perform
    ActiveRecord::Base.clear_active_connections!

    puts "fetched data"
  end
end
